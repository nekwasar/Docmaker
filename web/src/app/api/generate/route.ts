import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { streamAIResponse, getAIConfigAsync, type MultimodalMessage, type UsageReport } from "@/lib/ai/config";
import { modelIdForProvider, type AIProvider } from "@/lib/ai/catalog";
import { estimateCostUsd, estimateTokens } from "@/lib/pricing";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { DESIGNER_SYSTEM_PROMPT, buildDesignerPrompt, extractHtml, ensurePrintCss } from "@/lib/ai/designer";
import { renderMarkdownToStyledPages, deriveDynamicTheme, type DocumentTheme, type DesignSpec } from "@/lib/render/document";
import { assembleFromKit, parseMarkdownToContent, loadTemplateImages, type DesignKit } from "@/lib/render/designKit";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

// Server-Sent-Events style status protocol. The client only renders stages —
// document content is never streamed (avoids a cluttered UI).
type Stage =
  | { stage: "thinking" }
  | { stage: "designing" }
  | { stage: "writing" }
  | { stage: "compiling" }
  | { stage: "done"; html: string; markdown: string; template: string | null; themeConfig?: DocumentTheme }
  | { stage: "error"; error: string };

// Design spec emitted by the model as the first line: <!--design:{...}-->
function stripDesignSpec(md: string): { markdown: string; spec: DesignSpec | null } {
  const m = /<!--\s*design\s*:?([\s\S]*?)-->/i.exec(md);
  if (!m) return { markdown: md, spec: null };
  const start = m[1].indexOf("{");
  const end = m[1].lastIndexOf("}");
  let spec: DesignSpec | null = null;
  if (start !== -1 && end !== -1) {
    try {
      spec = JSON.parse(m[1].slice(start, end + 1)) as DesignSpec;
    } catch {}
  }
  return { markdown: md.replace(m[0], "").trimStart(), spec };
}


export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  let text = "";
  let structure = "auto";
  let style = "professional";
  let templateId = "";
  const fileContexts: string[] = [];

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      text = (form.get("text") as string) || "";
      structure = (form.get("structure") as string) || "auto";
      style = (form.get("style") as string) || "professional";
      templateId = (form.get("templateId") as string) || "";
      const files = form.getAll("files") as File[];
      for (const file of files) {
        if (!file || !file.name) continue;
        const buf = Buffer.from(await file.arrayBuffer());
        let extracted = "";
        const name = file.name.toLowerCase();
        if (name.endsWith(".pdf")) {
          try {
            const { execSync } = await import("child_process");
            const tmp = `/tmp/docmaker-gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
            fs.writeFileSync(tmp, buf);
            try {
              extracted = execSync(`pdftotext -layout "${tmp}" -`, { maxBuffer: 10 * 1024 * 1024 }).toString("utf-8").slice(0, 8000);
            } finally {
              fs.unlinkSync(tmp);
            }
          } catch {}
        } else if (name.endsWith(".docx")) {
          try {
            const mammoth = await import("mammoth");
            const { value } = await mammoth.extractRawText({ buffer: buf });
            extracted = value.slice(0, 8000);
          } catch {}
        } else if (name.endsWith(".txt") || name.endsWith(".csv") || name.endsWith(".xlsx") || name.endsWith(".md")) {
          extracted = buf.toString("utf-8").slice(0, 8000);
        } else if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp")) {
          extracted = `[Image file: ${file.name} (${file.size} bytes) - use as visual reference]`;
        }
        if (extracted) fileContexts.push(`File "${file.name}":\n${extracted}`);
      }
    } else {
      const body = await request.json();
      text = body.text || "";
      structure = body.structure || "auto";
      style = body.style || "professional";
      templateId = body.templateId || "";
    }

    if (!text && fileContexts.length === 0 && !templateId) {
      return new Response(JSON.stringify({ error: "Please provide a description or file" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Attribution (server-side only).
    const session = await getSession().catch(() => null);
    let sessionId = request.headers.get("x-session-id") || request.cookies.get("dm_sid")?.value || null;
    let mintedSid: string | null = null;
    if (!sessionId) {
      mintedSid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionId = mintedSid;
    }
    const sidCookie = mintedSid
      ? `dm_sid=${mintedSid}; Path=/; Max-Age=${365 * 24 * 3600}; SameSite=Lax`
      : null;

    const rawConfig = await getAIConfigAsync();
    const config = { ...rawConfig, model: modelIdForProvider(rawConfig.model, rawConfig.provider as AIProvider) };

    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Stage) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

        let markdown = "";
        let html = "";
        let usageTokens = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
        let templateTitle: string | null = null;
        let themeConfig: DocumentTheme | undefined;

        try {
          if (!config.apiKey) {
            throw new Error("AI is not configured yet. Please try again later.");
          }

          // Load the template (if any) — kit provides the design, images the fallback.
          let templateImages: string[] = [];
          let designKit: unknown = null;
          if (templateId) {
            const tpl = await prisma.template.findUnique({ where: { id: templateId } });
            if (tpl) {
              templateTitle = tpl.title;
              designKit = tpl.designKit;
              templateImages = loadTemplateImages(tpl.thumbnails, tpl.fileUrl);
            }
          }

          let userContent = text || "";
          if (fileContexts.length > 0) {
            userContent += `\n\nReference material from attached files:\n${fileContexts.join("\n\n---\n\n")}`;
          }

          if (templateImages.length > 0 || designKit) {
            // ===== TEMPLATE FLOW =====
            // Fast path: cached design kit → only the CONTENT is AI-written
            // (text-only call, ~1-2KB output). No vision cost at generation.
            if (designKit) {
              send({ stage: "thinking" });
              send({ stage: "writing" });

              let fullPrompt = buildPrompt(text || "", structure || "auto");
              fullPrompt += `\n\nThe document will be typeset into a pre-designed template with page archetypes: cover, table of contents, content pages, ${""}and a closing page. Structure your markdown to use these archetypes: start with a # main title, use ## headings for each major section, use tables and lists where appropriate.`;
              if (style === "simple") {
                fullPrompt += "\n\nWrite in simple, plain English suitable for a general audience.";
              }
              if (fileContexts.length > 0) {
                fullPrompt += "\n\nAdditional context from attached files:\n" + fileContexts.join("\n\n---\n\n");
              }

              let raw = "";
              let usage: UsageReport | null = null;
              for await (const chunk of streamAIResponse(
                [
                  { role: "system", content: SYSTEM_PROMPT },
                  { role: "user", content: fullPrompt },
                ],
                config,
                { onUsage: (u) => { usage = u; } }
              )) {
                raw += chunk;
              }
              markdown = raw;
              if (usage) usageTokens = usage;

              send({ stage: "compiling" });
              // Parse the markdown into pages and fill the cached skeletons.
              const parsed = parseMarkdownToContent(markdown);
              html = ensurePrintCss(assembleFromKit(designKit as unknown as DesignKit, parsed));
            } else {
              // Slow fallback: per-generation vision → HTML (no kit cached yet)
              send({ stage: "thinking" });
              send({ stage: "designing" });

              const messages: MultimodalMessage[] = [
                { role: "system", content: DESIGNER_SYSTEM_PROMPT },
                {
                  role: "user",
                  content: [
                    { type: "text", text: buildDesignerPrompt(userContent, style, structure) },
                    ...templateImages.map((url) => ({ type: "image_url" as const, image_url: { url } })),
                  ],
                },
              ];

              let raw = "";
              let usage: UsageReport | null = null;
              for await (const chunk of streamAIResponse(messages, config, {
                onUsage: (u) => { usage = u; },
              })) {
                raw += chunk;
              }
              html = ensurePrintCss(extractHtml(raw));
              if (!html || !html.includes("<")) {
                throw new Error("The model did not return a valid document design. Try again or pick a different model.");
              }
              markdown = userContent;
              if (usage) usageTokens = usage;
            }
          } else {
            // ===== DEFAULT FLOW: markdown → dynamic per-document design =====
            send({ stage: "thinking" });

            let fullPrompt = buildPrompt(text || "", structure || "auto");
            // Dynamic styling: the model picks a palette + fonts that fit THIS
            // document. Never a fixed default — spec line is parsed and applied.
            fullPrompt += `\n\nVery important — first line of your response must be exactly one HTML comment specifying this document's visual identity. Choose colors and fonts that genuinely fit the document's subject, audience, and tone (a legal NDA should look sober; a kids' program proposal may be warm; a tech report crisp; vary your choices between documents):\n<!--design:{"primary":"#1B2A4A","accent":"#C08362","text":"#12131A","bg":"#FFFFFF","headingFont":"Space Grotesk","bodyFont":"Inter"}-->\nColors are hex. headingFont and bodyFont must be chosen from: ${"Archivo, Public Sans, Space Grotesk, Inter, Manrope, DM Sans, Playfair Display, Source Serif 4, Sora, Libre Baskerville, Lora, Poppins, Fraunces"}. After that single line, output the markdown document starting with "# " title. No other commentary.`;
            if (style === "simple") {
              fullPrompt += "\n\nWrite in simple, plain English suitable for a general audience.";
            }
            if (fileContexts.length > 0) {
              fullPrompt += "\n\nAdditional context from attached files:\n" + fileContexts.join("\n\n---\n\n");
            }

            send({ stage: "writing" });
            let raw = "";
            let usage: UsageReport | null = null;
            for await (const chunk of streamAIResponse(
              [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: fullPrompt },
              ],
              config,
              { onUsage: (u) => { usage = u; } }
            )) {
              raw += chunk;
            }
            markdown = raw;
            if (usage) usageTokens = usage;

            send({ stage: "compiling" });
            const { markdown: cleanMd, spec } = stripDesignSpec(markdown);
            const dynamicTheme = deriveDynamicTheme(spec, text || cleanMd);
            markdown = cleanMd;
            html = renderMarkdownToStyledPages(markdown, dynamicTheme);
            themeConfig = dynamicTheme;
          }

          send({ stage: "done", html, markdown: markdown.slice(0, 40000), template: templateTitle, themeConfig });
        } catch (err: unknown) {
          send({ stage: "error", error: err instanceof Error ? err.message : "Generation failed" });
        } finally {
          // Usage log — server-side, never sent to the client.
          try {
            const promptTokens = usageTokens.promptTokens || estimateTokens(text);
            const completionTokens = usageTokens.completionTokens || estimateTokens(markdown + html);
            const totalTokens = usageTokens.totalTokens || promptTokens + completionTokens;
            const cost = estimateCostUsd(config.model, promptTokens, completionTokens);
            await prisma.apiUsageLog.create({
              data: {
                provider: config.provider,
                model: config.model,
                promptTokens,
                completionTokens,
                totalTokens,
                estimatedCostUsd: cost,
                userId: session?.id ?? null,
                sessionId,
                path: "/api/generate",
              },
            });
          } catch {}
          controller.close();
        }
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    };
    if (sidCookie) headers["Set-Cookie"] = sidCookie;
    return new Response(stream, { headers });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
