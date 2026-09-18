// Per-model pricing ($ per 1k tokens) + token/cost estimators.
// Prices are estimates for admin spend tracking only — never exposed publicly.

export interface ModelPrice {
  inputPer1k: number;
  outputPer1k: number;
}

// Ordered by specificity — first substring match wins.
const PRICING_TABLE: Array<{ match: string; price: ModelPrice }> = [
  { match: "gpt-4o-mini", price: { inputPer1k: 0.00015, outputPer1k: 0.0006 } },
  { match: "gpt-4o", price: { inputPer1k: 0.005, outputPer1k: 0.015 } },
  { match: "gpt-4-turbo", price: { inputPer1k: 0.01, outputPer1k: 0.03 } },
  { match: "gpt-4", price: { inputPer1k: 0.03, outputPer1k: 0.06 } },
  { match: "claude-3-5-sonnet", price: { inputPer1k: 0.003, outputPer1k: 0.015 } },
  { match: "claude-3-opus", price: { inputPer1k: 0.015, outputPer1k: 0.075 } },
  { match: "claude-3-sonnet", price: { inputPer1k: 0.003, outputPer1k: 0.015 } },
  { match: "claude-3-haiku", price: { inputPer1k: 0.00025, outputPer1k: 0.00125 } },
  { match: "gemini-1.5-pro", price: { inputPer1k: 0.0035, outputPer1k: 0.0105 } },
  { match: "gemini-pro", price: { inputPer1k: 0.0005, outputPer1k: 0.0015 } },
  { match: "llama-3-70b", price: { inputPer1k: 0.0009, outputPer1k: 0.0009 } },
  { match: "mixtral", price: { inputPer1k: 0.0005, outputPer1k: 0.0005 } },
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
