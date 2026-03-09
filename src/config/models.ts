import type { Provider } from '@/src/providers'

/**
 * Information about a specific model offered by a provider.
 *
 * @property provider The provider name (machine readable, e.g. "openai")
 * @property name The model name (machine readable, e.g. "gpt-4o")
 * @property label A friendly human-readable name (e.g. "GPT-4o (May 2024)")
 */
export type ModelInfo = {
  provider: Provider
  name: string
  label: string
}

/**
 * Mapping of each provider to its available models.
 *
 * @example
 * MODELS.openai // Array of OpenAI models
 * MODELS.anthropic // Array of Anthropic models
 */
type ProviderModels = {
  [provider in Provider]: ModelInfo[]
}

/**
 * Lists of supported models for each provider.
 * Used to look up display names and filter/iterate over supported models in the app.
 */
export const MODELS: ProviderModels = {
  openai: [
    { provider: 'openai', name: 'gpt-5.2', label: 'GPT-5.2' },
    { provider: 'openai', name: 'gpt-5-nano', label: 'GPT-5 Nano' },
    { provider: 'openai', name: 'gpt-5.3-codex', label: 'GPT-5.3 Codex' },
  ],
  anthropic: [
    { provider: 'anthropic', name: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
    { provider: 'anthropic', name: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  ],
  google: [
    { provider: 'google', name: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro' },
    { provider: 'google', name: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite' },
  ],
}

/**
 * Returns all models as a flat array.
 */
export function getAllModels(): ModelInfo[] {
  return Object.values(MODELS).flat()
}

/**
 * Returns models for a specific provider.
 */
export function getModelsByProvider(provider: Provider): ModelInfo[] {
  return MODELS[provider] ?? []
}
