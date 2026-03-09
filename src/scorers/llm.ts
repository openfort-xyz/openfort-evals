import { generateText } from 'ai'
import { getModel } from '@/src/providers'

const DEFAULT_JUDGE_MODEL = 'gemini-2.5-flash'

/** Configurable via EVAL_JUDGE_MODEL env var */
const judgeModel = process.env.EVAL_JUDGE_MODEL || DEFAULT_JUDGE_MODEL

/** In-memory cache for identical (criteria + response) pairs within a run */
const judgeCache = new Map<string, boolean>()

export type LLMJudgeConfig =
  | string
  | {
      /** Prompt passed to the judge */
      criteria: string
      /** Optional supplemental input */
      input?: string
      /** Override the default judge model */
      model?: string
    }

export const makeScorer = (config: LLMJudgeConfig) => {
  const {
    criteria,
    input = '',
    model = judgeModel,
  } = typeof config === 'string' ? { criteria: config } : config

  return async (actual: string) => {
    const cacheKey = `${model}::${criteria}::${actual.slice(0, 2000)}`
    const cached = judgeCache.get(cacheKey)
    if (cached !== undefined) return cached

    const userPrompt = [
      input ? `Context: ${input}` : '',
      `Criteria: ${criteria}`,
      `Response: ${actual}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const { text } = await generateText({
      model: getModel('google', model)!,
      system:
        'You are an expert evaluator. Given the criteria below, judge whether the response satisfies it. Reply with ONLY "Y" or "N". Do not include any other text.',
      prompt: userPrompt,
    })

    const result = text.trim().toUpperCase().startsWith('Y')
    judgeCache.set(cacheKey, result)
    return result
  }
}

export function getJudgeCacheStats() {
  return { size: judgeCache.size }
}
