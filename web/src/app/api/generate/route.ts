import { NextRequest } from "next/server";
import { streamAIResponse, getAIConfig } from "@/lib/ai/config";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const { text, structure } = await request.json();

    if (!text && !structure) {
      return new Response(
        JSON.stringify({ error: "Please provide a description or select a document type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const config = getAIConfig();

    // Build the prompt based on structure type
    const userPrompt = buildPrompt(text || "", structure || "auto");

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user" as const, content: userPrompt },
    ];

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAIResponse(messages, config)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error: any) {
          console.error("AI streaming error:", error);
          const errorMsg = `\n\n[Error: ${error.message || "AI generation failed. Please check your API key configuration."}]`;
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
    console.error("Generate error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
