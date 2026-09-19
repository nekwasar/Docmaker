// AI Configuration - Supports any model provider
// Use OpenRouter to access OpenAI, Anthropic, Google, Meta, Mistral, etc.
//
// Resolution order: AdminSetting DB values (set in /admin) override env.
// Spend/token internals stay server-side — never return them to clients.

import { getSetting } from "@/lib/settings";

export type AIProvider =
  | 'openrouter'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'xai'
  | 'deepseek'
  | 'alibaba'
  | 'moonshot'
  | 'zhipu'
  | 'mistral'
  | 'ollama'
  | 'custom';

export const AI_PROVIDERS: Array<{ id: AIProvider; label: string; region: 'Global' | 'US' | 'China' }> = [
  { id: 'openrouter', label: 'OpenRouter (all models, one key)', region: 'Global' },
  { id: 'openai', label: 'OpenAI', region: 'US' },
  { id: 'anthropic', label: 'Anthropic', region: 'US' },
  { id: 'google', label: 'Google', region: 'US' },
  { id: 'xai', label: 'xAI (Grok)', region: 'US' },
  { id: 'deepseek', label: 'DeepSeek', region: 'China' },
  { id: 'alibaba', label: 'Alibaba (Qwen)', region: 'China' },
  { id: 'moonshot', label: 'Moonshot (Kimi)', region: 'China' },
  { id: 'zhipu', label: 'Zhipu (GLM)', region: 'China' },
  { id: 'mistral', label: 'Mistral', region: 'Global' },
  { id: 'ollama', label: 'Ollama (local)', region: 'Global' },
  { id: 'custom', label: 'Custom endpoint', region: 'Global' },
];

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

// Current models (reviewed Sept 2026) — OpenRouter IDs, grouped by region.
// Legacy IDs (gpt-4, claude-3-*, gemini-pro, llama-3-70b, mixtral) removed:
// unsupported or superseded. A custom ID can always be typed manually.
export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

export const MODEL_GROUPS: Array<{ region: string; models: ModelOption[] }> = [
  {
    region: 'US — Flagships',
    models: [
      { id: 'openai/gpt-5.6-sol', name: 'GPT-5.6 Sol', provider: 'OpenAI' },
      { id: 'openai/gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI' },
      { id: 'anthropic/claude-opus-4.8', name: 'Claude Opus 4.8', provider: 'Anthropic' },
      { id: 'anthropic/claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic' },
      { id: 'google/gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'Google' },
      { id: 'x-ai/grok-4.6', name: 'Grok 4.6', provider: 'xAI' },
      { id: 'meta/muse-spark-1.3', name: 'Muse Spark 1.3', provider: 'Meta' },
    ],
  },
  {
    region: 'US — Efficient',
    models: [
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
      { id: 'anthropic/claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'Anthropic' },
      { id: 'google/gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google' },
      { id: 'x-ai/grok-4.5', name: 'Grok 4.5', provider: 'xAI' },
      { id: 'mistralai/mistral-nemo', name: 'Mistral Nemo', provider: 'Mistral' },
    ],
  },
  {
    region: 'China',
    models: [
      { id: 'deepseek/deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek' },
      { id: 'deepseek/deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek' },
      { id: 'qwen/qwen3.7-max', name: 'Qwen 3.7 Max', provider: 'Alibaba' },
      { id: 'z-ai/glm-5.3', name: 'GLM 5.3', provider: 'Zhipu' },
      { id: 'z-ai/glm-5.3-flash', name: 'GLM 5.3 Flash', provider: 'Zhipu' },
      { id: 'moonshotai/kimi-k3', name: 'Kimi K3', provider: 'Moonshot' },
      { id: 'moonshotai/kimi-k2', name: 'Kimi K2', provider: 'Moonshot' },
      { id: 'xiaomi/mimo-v2.5', name: 'MiMo V2.5', provider: 'Xiaomi' },
      { id: 'tencent/hy3', name: 'Hunyuan HY3', provider: 'Tencent' },
      { id: 'minimax/m3', name: 'MiniMax M3', provider: 'MiniMax' },
      { id: 'stepfun/step-3.7-flash', name: 'Step 3.7 Flash', provider: 'StepFun' },
    ],
  },
];

// Flat list (kept for compat).
export const SUPPORTED_MODELS: ModelOption[] = MODEL_GROUPS.flatMap((g) => g.models);

const PROVIDER_BASE_URLS: Record<Exclude<AIProvider, 'custom'>, string> = {
  openrouter: 'https://openrouter.ai/api/v1',
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  xai: 'https://api.x.ai/v1',
  deepseek: 'https://api.deepseek.com/v1',
  alibaba: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  moonshot: 'https://api.moonshot.ai/v1',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4',
  mistral: 'https://api.mistral.ai/v1',
  ollama: 'http://localhost:11434/v1',
};

export function baseUrlForProvider(provider: AIProvider, custom?: string): string {
  if (custom) return custom;
  if (provider === 'custom') return '';
  return PROVIDER_BASE_URLS[provider] ?? 'https://api.openai.com/v1';
}

function resolveBaseUrl(config: AIConfig): string {
  return baseUrlForProvider(config.provider, config.baseUrl);
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
