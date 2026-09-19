// AI Configuration - Supports any model provider
// Use OpenRouter to access OpenAI, Anthropic, Google, Meta, Mistral, etc.
//
// Resolution order: AdminSetting DB values (set in /admin) override env.
// Spend/token internals stay server-side — never return them to clients.

import { getSetting } from "@/lib/settings";

// Client-safe catalog (providers, models, base URLs) lives in ./catalog so
// client components never bundle server-only modules (prisma, node:crypto).
export type { AIProvider, ModelOption } from "./catalog";
export { AI_PROVIDERS, MODEL_GROUPS, SUPPORTED_MODELS, baseUrlForProvider } from "./catalog";
import type { AIProvider } from "./catalog";
import { baseUrlForProvider } from "./catalog";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Multimodal content block (OpenAI-compatible vision format).
export interface ContentBlock {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export type MultimodalMessage = { role: 'system' | 'user' | 'assistant'; content: string | ContentBlock[] };

export interface UsageReport {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Sync env-only version (kept for compat). Prefer getAIConfigAsync. */
export function getAIConfig(): AIConfig {
  return {
    provider: (process.env.AI_PROVIDER as AIProvider) || 'openrouter',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'openai/gpt-4',
    baseUrl: process.env.AI_BASE_URL || undefined,
  };
}

/** DB-first version: AdminSetting overrides env. */
export async function getAIConfigAsync(): Promise<AIConfig> {
  const [provider, apiKey, model, baseUrl] = await Promise.all([
    getSetting("AI_PROVIDER"),
    getSetting("AI_API_KEY"),
    getSetting("AI_MODEL"),
    getSetting("AI_BASE_URL"),
  ]);
  const fallback = getAIConfig();
  return {
    provider: (provider as AIProvider) || fallback.provider,
    apiKey: apiKey ?? fallback.apiKey,
    model: model || fallback.model,
    baseUrl: baseUrl || fallback.baseUrl,
  };
}

function resolveBaseUrl(config: AIConfig): string {
  return baseUrlForProvider(config.provider, config.baseUrl);
}

// Streaming response handler — yields text chunks, reports provider usage via opts.
// Accepts multimodal messages (content may be a string or ContentBlock[]).
export async function* streamAIResponse(
  messages: MultimodalMessage[],
  config: AIConfig,
  opts?: { onUsage?: (u: UsageReport) => void; signal?: AbortSignal }
): AsyncGenerator<string> {
  if (!config.apiKey) throw new Error('AI is not configured (missing API key).');

  const baseUrl = resolveBaseUrl(config);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter' && { 'HTTP-Referer': 'https://docmaker.io' }),
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
    }),
    signal: opts?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`AI provider error (${response.status}): ${body.slice(0, 200)}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
        const usage = parsed.usage;
        if (usage && opts?.onUsage) {
          const promptTokens = Number(usage.prompt_tokens ?? 0);
          const completionTokens = Number(usage.completion_tokens ?? 0);
          if (promptTokens || completionTokens) {
            opts.onUsage({
              promptTokens,
              completionTokens,
              totalTokens: Number(usage.total_tokens ?? promptTokens + completionTokens),
            });
          }
        }
      } catch {}
    }
  }
}

// Non-streaming completion — used by the vision document pipeline.
// Accepts multimodal messages (text + images) and returns full text + usage.
export async function completeAI(
  messages: MultimodalMessage[],
  config: AIConfig,
  opts?: { maxTokens?: number; signal?: AbortSignal }
): Promise<{ text: string; usage: UsageReport | null }> {
  if (!config.apiKey) throw new Error('AI is not configured (missing API key).');

  const baseUrl = resolveBaseUrl(config);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter' && { 'HTTP-Referer': 'https://docmaker.io' }),
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
      ...(opts?.maxTokens ? { max_tokens: opts.maxTokens } : {}),
    }),
    signal: opts?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`AI provider error (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const u = data.usage;
  const usage: UsageReport | null = u
    ? {
        promptTokens: Number(u.prompt_tokens ?? 0),
        completionTokens: Number(u.completion_tokens ?? 0),
        totalTokens: Number(u.total_tokens ?? 0),
      }
    : null;

  return { text, usage };
}
