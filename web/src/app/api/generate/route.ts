import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { streamAIResponse, getAIConfigAsync, type MultimodalMessage, type UsageReport } from "@/lib/ai/config";
import { modelIdForProvider, type AIProvider } from "@/lib/ai/catalog";
import { estimateCostUsd, estimateTokens } from "@/lib/pricing";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { DESIGNER_SYSTEM_PROMPT, buildDesignerPrompt, extractHtml, ensurePrintCss } from "@/lib/ai/designer";
import { renderMarkdownToStyledPages, getTheme } from "@/lib/render/document";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

// Server-Sent-Events style status protocol. The client only renders stages —
// document content is never streamed (avoids a cluttered UI).
type Stage =
  | { stage: "thinking" }
  | { stage: "designing" }
  | { stage: "writing" }
  | { stage: "compiling" }
  | { stage: "done"; html: string; markdown: string; template: string | null }
  | { stage: "error"; error: string };

function loadTemplateImages(thumbnails: unknown): string[] {
  const urls = Array.isArray(thumbnails) ? (thumbnails as string[]) : [];
  const out: string[] = [];
  for (const url of urls.slice(0, 6)) {
    try {
      const fp = path.join(process.cwd(), "public", url.replace(/^\//, ""));
      const buf = fs.readFileSync(fp);
      out.push(`data:image/png;base64,${buf.toString("base64")}`);
    } catch {
      // skip unreadable thumbnail
    }
  }
  return out;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  let text = "";
  let structure = "auto";
  let style = "professional";
  let format = "pdf";
  let templateId = "";
  let fileContexts: string[] = [];

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      text = (form.get("text") as string) || "";
      structure = (form.get("structure") as string) || "auto";
      style = (form.get("style") as string) || "professional";
      format = (form.get("format") as string) || "pdf";
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
      format = body.format || "pdf";
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

        try {
          if (!config.apiKey) {
            throw new Error("AI is not configured yet. Please try again later.");
          }

          // Load the template (if any) — images become the design reference.
          let templateImages: string[] = [];
          if (templateId) {
            const tpl = await prisma.template.findUnique({ where: { id: templateId } });
            if (tpl) {
              templateTitle = tpl.title;
              templateImages = loadTemplateImages(tpl.thumbnails);
              // Fall back to the original file's first page if no thumbnails exist yet.
              if (templateImages.length === 0 && tpl.fileUrl && tpl.fileUrl.endsWith(".pdf")) {
                try {
                  const { execSync } = await import("child_process");
                  const pdfPath = path.join(process.cwd(), "public", tpl.fileUrl.replace(/^\//, ""));
                  const outBase = `/tmp/tpl-${Date.now()}`;
                  execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r110 -dFirstPage=1 -dLastPage=6 -sOutputFile='${outBase}-%d.png' '${pdfPath}'`, { stdio: "ignore" });
                  for (let i = 1; i <= 6; i++) {
                    const p = `${outBase}-${i}.png`;
                    if (fs.existsSync(p)) {
                      templateImages.push(`data:image/png;base64,${fs.readFileSync(p).toString("base64")}`);
                      fs.unlinkSync(p);
                    }
                  }
                } catch {}
              }
            }
          }

          let userContent = text || "";
          if (fileContexts.length > 0) {
            userContent += `\n\nReference material from attached files:\n${fileContexts.join("\n\n---\n\n")}`;
          }

          if (templateImages.length > 0) {
            // ===== TEMPLATE FLOW: vision → HTML replicating the design =====
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

            // Streamed server-side (long HTML generations exceed non-streaming
            // provider timeouts). The client only sees stages — never content.
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
            markdown = userContent; // used for the prompt display / fallback
            if (usage) usageTokens = usage;
          } else {
            // ===== DEFAULT FLOW: markdown → page-type renderer =====
            send({ stage: "thinking" });

            let fullPrompt = buildPrompt(text || "", structure || "auto");
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
            html = renderMarkdownToStyledPages(markdown, getTheme("liceria"));
          }

          send({ stage: "done", html, markdown: markdown.slice(0, 40000), template: templateTitle });
        } catch (err: any) {
          send({ stage: "error", error: err.message || "Generation failed" });
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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
