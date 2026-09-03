// AI Configuration - Supports any model provider
// Use OpenRouter to access OpenAI, Anthropic, Google, Meta, Mistral, etc.

export type AIProvider = 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export function getAIConfig(): AIConfig {
  return {
    provider: (process.env.AI_PROVIDER as AIProvider) || 'openrouter',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'openai/gpt-4',
    baseUrl: process.env.AI_BASE_URL || undefined,
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

// Streaming response handler
export async function* streamAIResponse(
  prompt: string,
  systemPrompt?: string
): AsyncGenerator<string> {
  const config = getAIConfig();
  
  const baseUrl = config.baseUrl || 
    (config.provider === 'openrouter' ? 'https://openrouter.ai/api/v1' :
     config.provider === 'ollama' ? 'http://localhost:11434/v1' :
     config.provider === 'anthropic' ? 'https://api.anthropic.com/v1' :
     'https://api.openai.com/v1');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter' && { 'HTTP-Referer': 'https://docmaker.io' }),
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      stream: true,
    }),
  });

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
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {}
      }
    }
  }
}
