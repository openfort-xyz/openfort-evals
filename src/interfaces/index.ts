import type { Provider } from '@/src/providers'
import type { Result } from '@/src/utils/result'

export type RunnerDebugPayload = {
  prompt: string
  response: string
  graders: [string, boolean][]
}

/**
 * Every Runner function must return a RunnerResult
 * and should never throw under normal circumstances.
 */
export type RunnerResult = Result<{
  score: number
  debug: RunnerDebugPayload
}>

/**
 * Arguments to be passed to the runner
 */
export type RunnerArgs = {
  provider: Provider
  model: string
  evalPath: string
}

/**
 * Supported frameworks
 */
export type Framework = 'React' | 'Node.js' | 'Next.js' | 'MCP'

/**
 * Categories we test
 */
export type Category = string
export type Evaluation = {
  framework: Framework
  category: Category
  /** e.g. "evals/basic-nextjs" */
  path: string
}

/**
 * Arguments for the MCP runner (extends RunnerArgs with MCP-specific options)
 */
export type MCPRunnerArgs = RunnerArgs & {
  mcpServerUrl: string
  maxToolRounds?: number
  debug?: boolean
}

/**
 * A single score object for a model and category
 */
export type Score = {
  model: string
  label: string
  framework: Framework
  category: Category
  value: number
  updatedAt?: string
}
