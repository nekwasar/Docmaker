// Per-model pricing ($ per 1k tokens) + token/cost estimators.
// Prices are estimates for admin spend tracking only — never exposed publicly.
// Last reviewed: Sept 2026 (OpenRouter / vendor list prices). Drift is expected —
// the admin settings UI shows the active model's rate so staleness is visible.

export interface ModelPrice {
  inputPer1k: number;
  outputPer1k: number;
}

// Ordered by specificity — first substring match wins.
const PRICING_TABLE: Array<{ match: string; price: ModelPrice }> = [
  // OpenAI
  { match: "gpt-6", price: { inputPer1k: 0.01, outputPer1k: 0.05 } },
  { match: "gpt-5.6-sol", price: { inputPer1k: 0.002, outputPer1k: 0.01 } },
  { match: "gpt-5.6", price: { inputPer1k: 0.002, outputPer1k: 0.01 } },
  { match: "gpt-5.5", price: { inputPer1k: 0.005, outputPer1k: 0.03 } },
  { match: "gpt-5", price: { inputPer1k: 0.004, outputPer1k: 0.02 } },
  { match: "gpt-4o-mini", price: { inputPer1k: 0.00015, outputPer1k: 0.0006 } },
  { match: "gpt-4o", price: { inputPer1k: 0.005, outputPer1k: 0.015 } },
  // Anthropic
  { match: "claude-opus-4.8", price: { inputPer1k: 0.005, outputPer1k: 0.025 } },
  { match: "claude-opus-4.7", price: { inputPer1k: 0.005, outputPer1k: 0.025 } },
  { match: "claude-opus-4.6", price: { inputPer1k: 0.005, outputPer1k: 0.025 } },
  { match: "claude-opus-5", price: { inputPer1k: 0.005, outputPer1k: 0.025 } },
  { match: "claude-opus", price: { inputPer1k: 0.005, outputPer1k: 0.025 } },
  { match: "claude-sonnet-5", price: { inputPer1k: 0.002, outputPer1k: 0.01 } },
  { match: "claude-sonnet-4", price: { inputPer1k: 0.003, outputPer1k: 0.015 } },
  { match: "claude-sonnet", price: { inputPer1k: 0.002, outputPer1k: 0.01 } },
  { match: "claude-haiku-4.5", price: { inputPer1k: 0.001, outputPer1k: 0.005 } },
  { match: "claude-haiku", price: { inputPer1k: 0.001, outputPer1k: 0.005 } },
  { match: "claude-fable", price: { inputPer1k: 0.01, outputPer1k: 0.05 } },
  // Google
  { match: "gemini-3.7-flash", price: { inputPer1k: 0.00075, outputPer1k: 0.00375 } },
  { match: "gemini-3.8-flash", price: { inputPer1k: 0.00075, outputPer1k: 0.00375 } },
  { match: "gemini-3.1-pro", price: { inputPer1k: 0.002, outputPer1k: 0.012 } },
  { match: "gemini-3", price: { inputPer1k: 0.001, outputPer1k: 0.004 } },
  { match: "gemini-2.5", price: { inputPer1k: 0.0005, outputPer1k: 0.002 } },
  { match: "gemini", price: { inputPer1k: 0.001, outputPer1k: 0.004 } },
  // xAI
  { match: "grok-4.6", price: { inputPer1k: 0.002, outputPer1k: 0.006 } },
  { match: "grok-4.5", price: { inputPer1k: 0.002, outputPer1k: 0.006 } },
  { match: "grok", price: { inputPer1k: 0.002, outputPer1k: 0.006 } },
  // Meta
  { match: "muse-spark", price: { inputPer1k: 0.00125, outputPer1k: 0.00425 } },
  { match: "llama", price: { inputPer1k: 0.0009, outputPer1k: 0.0009 } },
  // Mistral
  { match: "mistral-nemo", price: { inputPer1k: 0.0003, outputPer1k: 0.0003 } },
  { match: "mistral", price: { inputPer1k: 0.0005, outputPer1k: 0.0005 } },
  { match: "devstral", price: { inputPer1k: 0.0005, outputPer1k: 0.0005 } },
  // DeepSeek
  { match: "deepseek-v4-flash", price: { inputPer1k: 0.00027, outputPer1k: 0.0011 } },
  { match: "deepseek-v4-pro", price: { inputPer1k: 0.0022, outputPer1k: 0.009 } },
  { match: "deepseek-v4", price: { inputPer1k: 0.001, outputPer1k: 0.004 } },
  { match: "deepseek", price: { inputPer1k: 0.001, outputPer1k: 0.004 } },
  // Alibaba Qwen
  { match: "qwen3.7", price: { inputPer1k: 0.00148, outputPer1k: 0.00442 } },
  { match: "qwen", price: { inputPer1k: 0.001, outputPer1k: 0.003 } },
  // Zhipu GLM
  { match: "glm-5.3-flash", price: { inputPer1k: 0.000075, outputPer1k: 0.00025 } },
  { match: "glm-5.3", price: { inputPer1k: 0.0014, outputPer1k: 0.0044 } },
  { match: "glm", price: { inputPer1k: 0.001, outputPer1k: 0.003 } },
  // Moonshot Kimi
  { match: "kimi-k3", price: { inputPer1k: 0.003, outputPer1k: 0.015 } },
  { match: "kimi-k2", price: { inputPer1k: 0.00057, outputPer1k: 0.0023 } },
  { match: "kimi", price: { inputPer1k: 0.001, outputPer1k: 0.004 } },
  // Xiaomi / Tencent / MiniMax / StepFun
  { match: "mimo", price: { inputPer1k: 0.0005, outputPer1k: 0.002 } },
  { match: "hy3", price: { inputPer1k: 0.0005, outputPer1k: 0.0015 } },
  { match: "hunyuan", price: { inputPer1k: 0.0005, outputPer1k: 0.0015 } },
  { match: "minimax", price: { inputPer1k: 0.0005, outputPer1k: 0.0005 } },
  { match: "step-3", price: { inputPer1k: 0.0003, outputPer1k: 0.0003 } },
  { match: "stepfun", price: { inputPer1k: 0.0003, outputPer1k: 0.0003 } },
];

export const DEFAULT_PRICE: ModelPrice = { inputPer1k: 0.005, outputPer1k: 0.015 };

export function getModelPrice(model: string): ModelPrice {
  const m = (model || "").toLowerCase();
  for (const entry of PRICING_TABLE) {
    if (m.includes(entry.match)) return entry.price;
  }
  return DEFAULT_PRICE;
}

/** Rough token estimate when the provider reports no usage (~4 chars/token). */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

export function estimateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  const p = getModelPrice(model);
  const cost = (promptTokens / 1000) * p.inputPer1k + (completionTokens / 1000) * p.outputPer1k;
  return Math.round(cost * 1_000_000) / 1_000_000;
}
