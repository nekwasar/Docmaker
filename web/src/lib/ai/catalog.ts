// Client-safe AI catalog: providers, models, base URLs.
// IMPORTANT: this file must stay free of server-only imports (no prisma,
// no node:crypto, no @/lib/settings) because the admin settings page
// imports it into a client component.

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

// Current models (reviewed Sept 2026) — OpenRouter IDs, grouped by region.
// Legacy IDs (gpt-4, claude-3-*, gemini-pro, llama-3-70b, mixtral) removed:
// unsupported or superseded. A custom ID can always be typed manually.
export interface ModelOption {
  id: string;        // OpenRouter ID (used when AI_PROVIDER=openrouter)
  nativeId?: string; // native API ID (used for direct provider connections)
  name: string;
  provider: string;
}

/** Given an OpenRouter model id and current provider, return the correct id to send to the API. */
export function modelIdForProvider(modelId: string, provider: AIProvider): string {
  if (provider === 'openrouter') return modelId; // OpenRouter uses provider/model
  // Find the nativeId for this provider
  for (const g of MODEL_GROUPS) {
    const m = g.models.find((m) => m.id === modelId);
    if (m?.nativeId) return m.nativeId;
  }
  // Fallback: strip "vendor/" prefix (e.g. "deepseek/deepseek-v4-pro" → "deepseek-v4-pro")
  const slash = modelId.indexOf('/');
  return slash !== -1 ? modelId.slice(slash + 1) : modelId;
}

export const MODEL_GROUPS: Array<{ region: string; models: ModelOption[] }> = [
  {
    region: 'US — Flagships',
    models: [
      { id: 'openai/gpt-5.6-sol', nativeId: 'gpt-5.6-sol', name: 'GPT-5.6 Sol', provider: 'OpenAI' },
      { id: 'openai/gpt-5.5', nativeId: 'gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI' },
      { id: 'anthropic/claude-opus-4.8', nativeId: 'claude-opus-4-8', name: 'Claude Opus 4.8', provider: 'Anthropic' },
      { id: 'anthropic/claude-sonnet-5', nativeId: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic' },
      { id: 'google/gemini-3.7-flash', nativeId: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'Google' },
      { id: 'x-ai/grok-4.6', nativeId: 'grok-4.6', name: 'Grok 4.6', provider: 'xAI' },
      { id: 'meta/muse-spark-1.3', name: 'Muse Spark 1.3', provider: 'Meta' },
    ],
  },
  {
    region: 'US — Efficient',
    models: [
      { id: 'openai/gpt-4o-mini', nativeId: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
      { id: 'anthropic/claude-haiku-4.5', nativeId: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic' },
      { id: 'google/gemini-3.1-pro', nativeId: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google' },
      { id: 'x-ai/grok-4.5', nativeId: 'grok-4.5', name: 'Grok 4.5', provider: 'xAI' },
      { id: 'mistralai/mistral-nemo', nativeId: 'mistral-nemo', name: 'Mistral Nemo', provider: 'Mistral' },
    ],
  },
  {
    region: 'China',
    models: [
      { id: 'deepseek/deepseek-v4-flash', nativeId: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek' },
      { id: 'deepseek/deepseek-v4-pro', nativeId: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek' },
      { id: 'qwen/qwen3.7-max', nativeId: 'qwen3.7-max', name: 'Qwen 3.7 Max', provider: 'Alibaba' },
      { id: 'z-ai/glm-5.3', nativeId: 'glm-5.3', name: 'GLM 5.3', provider: 'Zhipu' },
      { id: 'z-ai/glm-5.3-flash', nativeId: 'glm-5.3-flash', name: 'GLM 5.3 Flash', provider: 'Zhipu' },
      { id: 'moonshotai/kimi-k3', nativeId: 'kimi-k3', name: 'Kimi K3', provider: 'Moonshot' },
      { id: 'moonshotai/kimi-k2', nativeId: 'kimi-k2', name: 'Kimi K2', provider: 'Moonshot' },
      { id: 'xiaomi/mimo-v2.5', nativeId: 'mimo-v2.5', name: 'MiMo V2.5', provider: 'Xiaomi' },
      { id: 'tencent/hy3', nativeId: 'hunyuan-hy3', name: 'Hunyuan HY3', provider: 'Tencent' },
      { id: 'minimax/m3', nativeId: 'm3', name: 'MiniMax M3', provider: 'MiniMax' },
      { id: 'stepfun/step-3.7-flash', nativeId: 'step-3.7-flash', name: 'Step 3.7 Flash', provider: 'StepFun' },
    ],
  },
];

// Flat list (kept for compat).
export const SUPPORTED_MODELS: ModelOption[] = MODEL_GROUPS.flatMap((g) => g.models);
