import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createVercel } from '@ai-sdk/vercel'

/**
 * Supported language model providers.
 * - "openai": For OpenAI models (e.g. GPT-4.1, GPT-5, o3, o4-mini, etc.)
 * - "anthropic": For Anthropic models (e.g. Claude Opus 4.6, Sonnet 4.5, Haiku 4.5, etc.)
 * - "google": For Google models (e.g. Gemini 2.5 Pro, Gemini 2.5 Flash, etc.)
 * - "vercel": For Vercel AI models (e.g. v0-1.5-md)
 */
export type Provider = 'openai' | 'anthropic' | 'google' | 'vercel'

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
 * MODELS.google // Array of Google models
 * MODELS.vercel // Array of Vercel models
 */
export type ProviderModels = {
  [provider in Provider]: ModelInfo[]
}

/**
 * Lists of supported models for each provider.
 * Used to look up display names and filter/iterate over supported models in the app.
 */
export const MODELS: ProviderModels = {
  openai: [
    { provider: 'openai', name: 'gpt-4.1', label: 'GPT-4.1' },
    { provider: 'openai', name: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { provider: 'openai', name: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
    { provider: 'openai', name: 'gpt-4o', label: 'GPT-4o' },
    { provider: 'openai', name: 'gpt-5', label: 'GPT-5' },
    { provider: 'openai', name: 'o3', label: 'o3' },
    { provider: 'openai', name: 'o3-mini', label: 'o3 Mini' },
    { provider: 'openai', name: 'o4-mini', label: 'o4 Mini' },
  ],
  anthropic: [
    { provider: 'anthropic', name: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { provider: 'anthropic', name: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
    { provider: 'anthropic', name: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  ],
  google: [
    { provider: 'google', name: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { provider: 'google', name: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  ],
  vercel: [{ provider: 'vercel', name: 'v0-1.5-md', label: 'v0-1.5-md' }],
}

/**
 * Returns a flat array of all models across all providers.
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

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

const vercel = createVercel({
  apiKey: process.env.V0_API_KEY,
})

export function getModel(provider: Provider, model: string) {
  if (provider === 'openai') {
    return openai(model)
  } else if (provider === 'anthropic') {
    return anthropic(model)
  } else if (provider === 'google') {
    return google(model)
  } else if (provider === 'vercel') {
    return vercel(model)
  }
}
