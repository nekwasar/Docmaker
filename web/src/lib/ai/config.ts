// AI Configuration - Supports any model provider
// Use OpenRouter to access OpenAI, Anthropic, Google, Meta, Mistral, etc.
//
// Resolution order: AdminSetting DB values (set in /admin) override env.
// Spend/token internals stay server-side — never return them to clients.

import { getSetting } from "@/lib/settings";

export type AIProvider = 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'custom';

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

// Supported models via OpenRouter
export const SUPPORTED_MODELS = [
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'meta-llama/llama-3-70b', name: 'Llama 3 70B', provider: 'Meta' },
  { id: 'mistralai/mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral' },
] as const;

function resolveBaseUrl(config: AIConfig): string {
  if (config.baseUrl) return config.baseUrl;
  if (config.provider === 'openrouter') return 'https://openrouter.ai/api/v1';
  if (config.provider === 'ollama') return 'http://localhost:11434/v1';
  if (config.provider === 'anthropic') return 'https://api.anthropic.com/v1';
  return 'https://api.openai.com/v1';
}

// Streaming response handler — yields text chunks, reports provider usage via opts.
export async function* streamAIResponse(
  messages: ChatMessage[],
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
