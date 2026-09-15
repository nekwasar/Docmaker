import { NextRequest } from "next/server";
import { streamAIResponse, getAIConfig } from "@/lib/ai/config";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    let text = "";
    let structure = "auto";
    let fileContexts: string[] = [];

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      text = (form.get("text") as string) || "";
      structure = (form.get("structure") as string) || "auto";
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
    }

    if (!text && fileContexts.length === 0 && !structure) {
      return new Response(JSON.stringify({ error: "Please provide a description or file" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let fullPrompt = buildPrompt(text || "", structure || "auto");
    if (fileContexts.length > 0) {
      fullPrompt += "\n\nAdditional context from attached files:\n" + fileContexts.join("\n\n---\n\n");
    }

    const config = getAIConfig();
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user" as const, content: fullPrompt },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAIResponse(messages, config)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error: any) {
          const errorMsg = `\n\n[Error: ${error.message || "AI generation failed."}]`;
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
