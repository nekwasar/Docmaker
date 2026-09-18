import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { streamAIResponse, getAIConfigAsync, type UsageReport } from "@/lib/ai/config";
import { estimateCostUsd, estimateTokens } from "@/lib/pricing";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    let text = "";
    let structure = "auto";
    let style = "professional";
    let format = "pdf";
    let fileContexts: string[] = [];

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      text = (form.get("text") as string) || "";
      structure = (form.get("structure") as string) || "auto";
      style = (form.get("style") as string) || "professional";
      format = (form.get("format") as string) || "pdf";
      const files = form.getAll("files") as File[];
      for (const file of files) {
        if (!file || !file.name) continue;
        const buf = Buffer.from(await file.arrayBuffer());
        let extracted = "";
        const name = file.name.toLowerCase();
        if (name.endsWith(".pdf")) {
          try {
            const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
            // @ts-ignore
            pdfjs.GlobalWorkerOptions.workerSrc = "";
            const doc = await (pdfjs as any).getDocument({ data: new Uint8Array(buf) }).promise;
            let all = "";
            for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
              const page = await doc.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map((it: any) => it.str).join(" ");
              all += pageText + "\n\n";
            }
            extracted = all.slice(0, 8000);
          } catch {}
        } else if (name.endsWith(".docx")) {
          try {
            const mammoth = await import("mammoth");
            const { value } = await mammoth.extractRawText({ buffer: buf });
            extracted = value.slice(0, 8000);
          } catch {}
        } else if (name.endsWith(".txt") || name.endsWith(".csv") || name.endsWith(".xlsx")) {
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
    }

    if (!text && fileContexts.length === 0 && !structure) {
      return new Response(JSON.stringify({ error: "Please provide a description or file" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let fullPrompt = buildPrompt(text || "", structure || "auto");
    if (style === "simple") {
      fullPrompt += "\n\nWrite in simple, plain English suitable for a general audience.";
    }
    if (fileContexts.length > 0) {
      fullPrompt += "\n\nAdditional context from attached files:\n" + fileContexts.join("\n\n---\n\n");
    }

    // Attribution for usage logging (server-side only — never sent to client).
    // If the client sent no session id, mint one so the gate/throttle can't be
    // bypassed by simply dropping cookies/localStorage.
    const session = await getSession().catch(() => null);
    let sessionId =
      request.headers.get("x-session-id") ||
      request.cookies.get("dm_sid")?.value ||
      null;
    let mintedSid: string | null = null;
    if (!sessionId) {
      mintedSid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionId = mintedSid;
    }
    const sidCookie = mintedSid
      ? `dm_sid=${mintedSid}; Path=/; Max-Age=${365 * 24 * 3600}; SameSite=Lax`
      : null;

    const config = await getAIConfigAsync();
    if (!config.apiKey) {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (sidCookie) headers["Set-Cookie"] = sidCookie;
      return new Response(JSON.stringify({ error: "AI is not configured yet. Please try again later." }), {
        status: 503,
        headers,
      });
    }

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user" as const, content: fullPrompt },
    ];

    const promptTokensEst = estimateTokens(SYSTEM_PROMPT + fullPrompt);

    let providerUsage: UsageReport | null = null;
    let completionText = "";
    let streamError: string | null = null;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAIResponse(messages, config, {
            onUsage: (u) => {
              providerUsage = u;
            },
          })) {
            completionText += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error: any) {
          streamError = error.message || "AI generation failed.";
          const errorMsg = `\n\n[Error: ${streamError}]`;
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        } finally {
          // Server-side usage log — fire and forget, never blocks/fails the stream.
          // Failed generations (no content streamed) are NOT logged: no spend occurred.
          if (streamError && !completionText) return;
          try {
            const promptTokens = providerUsage?.promptTokens || promptTokensEst;
            const completionTokens =
              providerUsage?.completionTokens || estimateTokens(completionText);
            const totalTokens =
              providerUsage?.totalTokens || promptTokens + completionTokens;
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
        }
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
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
