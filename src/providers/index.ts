import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'

export type Provider = 'openai' | 'anthropic' | 'google'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export function getModel(provider: Provider, model: string) {
  if (provider === 'openai') {
    return openai(model)
  } else if (provider === 'anthropic') {
    return anthropic(model)
  } else if (provider === 'google') {
    return google(model)
  }
}
