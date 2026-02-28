import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import Tinypool from 'tinypool'

import type {
  Evaluation,
  MCPRunnerArgs,
  RunnerArgs,
  RunnerDebugPayload,
  RunnerResult,
  Score,
} from '@/src/interfaces'
import { getAllModels, getModelsByProvider, type ModelInfo, type Provider } from '@/src/providers'
import consoleReporter from '@/src/reporters/console'
import fileReporter from '@/src/reporters/file'
import { rateLimiter } from '@/src/utils/rate-limiter'

const DEFAULT_MCP_URL = 'https://mcp.openfort.io/sse'

/**
 * Registered models - all latest models across all providers.
 * To filter at runtime use --provider or --model flags.
 */
const models: ModelInfo[] = getAllModels()

/**
 * Registered evaluations
 * To be manually updated
 */
const evaluations = [
  {
    framework: 'React',
    category: 'Setup',
    path: 'evals/basic-setup',
  },
  {
    framework: 'React',
    category: 'Authentication',
    path: 'evals/authentication',
  },
  {
    framework: 'React',
    category: 'Embedded Wallets',
    path: 'evals/embedded-wallets',
  },
  {
    framework: 'React',
    category: 'Wallet Recovery',
    path: 'evals/wallet-recovery',
  },
  {
    framework: 'React',
    category: 'Wallet Actions',
    path: 'evals/wallet-actions',
  },
  {
    framework: 'React',
    category: 'Hooks',
    path: 'evals/hooks-usage',
  },
  {
    framework: 'MCP',
    category: 'MCP Server',
    path: 'evals/mcp-server',
  },
] satisfies Evaluation[]

type DebugArtifact = {
  provider: string
  model: string
  framework: string
  category: string
  evaluationPath: string
  score: number
  prompt: string
  response: string
  graders: RunnerDebugPayload['graders']
}

type DebugError = {
  provider: string
  model: string
  evaluationPath: string
  error: unknown
}

const args = process.argv.slice(2)

const parseStringArg = (longFlag: string, shortFlag?: string): string | undefined => {
  const equalsArg = args.find((arg) => arg.startsWith(`--${longFlag}=`))
  if (equalsArg) {
    return equalsArg.split('=', 2)[1]
  }

  const index = args.findIndex((arg) => arg === `--${longFlag}` || (shortFlag && arg === shortFlag))
  if (index === -1) {
    return undefined
  }

  const value = args[index + 1]
  if (!value || value.startsWith('-')) {
    return undefined
  }

  return value
}

const parseBooleanFlag = (flag: string): boolean => {
  return args.includes(`--${flag}`)
}

const showHelp = () => {
  console.log(`
Openfort Evals - Evaluate LLMs on Openfort code generation

Usage:
  bun start [options]

Options:
  --help, -h              Show this help message
  --eval, -e <path>       Run a specific evaluation (e.g., evals/basic-setup)
  --model, -m <models>    Run only for specific model(s) (e.g., gpt-4.1 or gpt-4.1,claude-opus-4-6)
  --provider, -p <name>   Run only for a specific provider (openai, anthropic, google, vercel)
  --mcp                   Enable MCP tool support (connects to Openfort MCP server)

Available models:
${models.map((m) => `  - ${m.name} (${m.label})`).join('\n')}

Available evaluations:
${evaluations.map((e) => `  - ${e.path} (${e.category})`).join('\n')}

Examples:
  bun start                                      # Run all evals on all models
  bun start --eval evals/basic-setup             # Run one eval on all models
  bun start --model claude-opus-4-6              # Run all evals on one model
  bun start --model gpt-4.1,claude-opus-4-6      # Run all evals on multiple models
  bun start --provider google                    # Run all evals on Google models only
  bun start --mcp                                # Run all evals with MCP tool support
  bun start --mcp --eval evals/mcp-server        # Run MCP server eval with MCP tools
`)
  process.exit(0)
}

const getEvalArg = () => {
  const equalsArg = args.find((arg) => arg.startsWith('--eval='))
  if (equalsArg) {
    return equalsArg.split('=', 2)[1]
  }

  const index = args.findIndex((arg) => arg === '--eval' || arg === '-e')
  if (index === -1) {
    return undefined
  }

  const value = args[index + 1]
  if (!value || value.startsWith('-')) {
    console.error('Missing value for --eval')
    process.exit(1)
  }

  return value
}

const getModelArg = () => {
  const equalsArg = args.find((arg) => arg.startsWith('--model='))
  if (equalsArg) {
    const value = equalsArg.split('=', 2)[1]
    return value
      ?.split(',')
      .map((m) => m.trim())
      .filter(Boolean)
  }

  const index = args.findIndex((arg) => arg === '--model' || arg === '-m')
  if (index === -1) {
    return undefined
  }

  const value = args[index + 1]
  if (!value || value.startsWith('-')) {
    console.error('Missing value for --model')
    process.exit(1)
  }

  return value
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
}

const normalizeEvalPath = (value: string) => {
  if (value.startsWith('./')) {
    return normalizeEvalPath(value.slice(2))
  }
  if (value.startsWith('evals/')) {
    return value
  }
  return `evals/${value}`
}

// Check for help flag first
if (args.includes('--help') || args.includes('-h')) {
  showHelp()
}

const evalArg = getEvalArg()
const modelArg = getModelArg()
const providerFilter = parseStringArg('provider', '-p')
const mcpEnabled = parseBooleanFlag('mcp')

const selectedEvaluations = (() => {
  if (!evalArg) {
    return evaluations
  }

  const normalized = normalizeEvalPath(evalArg)
  const target = evaluations.find(
    (evaluation) =>
      evaluation.path === normalized ||
      evaluation.path.endsWith(`/${normalized}`) ||
      evaluation.path.endsWith(`/${evalArg}`),
  )

  if (!target) {
    console.error(
      `No evaluation matching "${evalArg}". Available evaluations: ${evaluations
        .map((evaluation) => evaluation.path)
        .join(', ')}`,
    )
    process.exit(1)
  }

  console.log(`Running single evaluation "${target.path}" for all registered models`)

  return [target]
})()

const selectedModels = (() => {
  // Apply provider filter first
  let filteredModels = providerFilter
    ? getModelsByProvider(providerFilter.toLowerCase() as Provider)
    : models

  // Then apply model filter
  if (modelArg && modelArg.length > 0) {
    const targets = modelArg.map((arg) => {
      const target = filteredModels.find((model) => model.name === arg || model.label === arg)

      if (!target) {
        console.error(
          `No model matching "${arg}". Available models: ${filteredModels
            .map((model) => `${model.name} (${model.label})`)
            .join(', ')}`,
        )
        process.exit(1)
      }

      return target
    })

    filteredModels = targets
  }

  if (filteredModels.length === 0) {
    const filter = modelArg ? `model="${modelArg}"` : `provider="${providerFilter}"`
    console.error(`No models match filter: ${filter}`)
    process.exit(1)
  }

  if (filteredModels.length === 1 && filteredModels[0]) {
    console.log(`Running for single model "${filteredModels[0].name}" (${filteredModels[0].label})`)
  } else {
    console.log(
      `Running for ${filteredModels.length} models: ${filteredModels.map((m) => m.name).join(', ')}`,
    )
  }

  return filteredModels
})()

// Select the runner based on --mcp flag
const runnerPath = mcpEnabled ? './runners/mcp.ts' : './runners/main.ts'

// Create a pool of workers to execute the runner
const pool = new Tinypool({
  runtime: 'child_process',
  filename: new URL(runnerPath, import.meta.url).href,
  isolateWorkers: true,
  idleTimeout: 10000,
  maxThreads: 10,
})

const mcpUrl = process.env.MCP_SERVER_URL_OVERRIDE || DEFAULT_MCP_URL

const debugArtifacts: DebugArtifact[] = []
const debugErrors: DebugError[] = []

const debugRunTimestamp = new Date().toISOString().replace(/[:.]/g, '-')
const debugRunDirectory = path.join(process.cwd(), 'debug-runs', debugRunTimestamp)
await mkdir(debugRunDirectory, { recursive: true })
console.log(`Saving outputs to ${debugRunDirectory}`)

if (mcpEnabled) {
  console.log(`MCP enabled — connecting to ${mcpUrl}`)
}

// Collect list of tasks to be run
const tasks = selectedModels.flatMap((model) =>
  selectedEvaluations.map((evaluation) => ({
    provider: model.provider,
    model: model.name,
    label: model.label,
    category: evaluation.category,
    framework: evaluation.framework,
    evalPath: new URL(evaluation.path, import.meta.url).pathname,
    evaluationPath: evaluation.path,
  })),
)

// Accumulate scores
const scores: Score[] = []

// Progress output
console.log(
  `Starting ${tasks.length} tasks across ${selectedModels.length} models and ${selectedEvaluations.length} evaluations (up to 10 workers)...`,
)

let completed = 0

// Run all tasks with rate limiting per provider
await Promise.all(
  tasks.map(async (task, index) => {
    console.log(`[start ${index + 1}/${tasks.length}] ${task.model} → ${task.evaluationPath}`)

    const baseArgs: RunnerArgs = {
      evalPath: task.evalPath,
      provider: task.provider as Provider,
      model: task.model,
    }

    const runnerArgs: RunnerArgs | MCPRunnerArgs = mcpEnabled
      ? { ...baseArgs, mcpServerUrl: mcpUrl, maxToolRounds: 10 }
      : baseArgs

    try {
      // Schedule task through rate limiter to prevent API rate limit errors
      const result: RunnerResult = await rateLimiter.schedule(task.provider, () =>
        pool.run(runnerArgs),
      )

      if (!result.ok) {
        console.log({
          message: 'Runner errored',
          task,
          error: result.error,
        })
        debugErrors.push({
          provider: task.provider,
          model: task.model,
          evaluationPath: task.evaluationPath,
          error: result.error,
        })
        return
      }

      const labelSuffix = mcpEnabled ? ' (MCP)' : ''
      const score: Score = {
        model: task.model,
        label: `${task.label}${labelSuffix}`,
        framework: task.framework,
        category: task.category,
        value: result.value.score,
        updatedAt: new Date().toISOString(),
      }
      scores.push(score)

      debugArtifacts.push({
        provider: task.provider,
        model: task.model,
        framework: task.framework,
        category: task.category,
        evaluationPath: task.evaluationPath,
        score: result.value.score,
        prompt: result.value.debug.prompt,
        response: result.value.debug.response,
        graders: result.value.debug.graders,
      })
    } finally {
      completed += 1
      console.log(`[done  ${completed}/${tasks.length}] ${task.model} → ${task.evaluationPath}`)
    }
  }),
)

const sanitizeForFilename = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '_')

for (const artifact of debugArtifacts) {
  const evaluationSlug = artifact.evaluationPath.split('/').filter(Boolean).join('__')
  const evaluationDir = path.join(debugRunDirectory, evaluationSlug)
  await mkdir(evaluationDir, { recursive: true })

  const fileSafeName = sanitizeForFilename(`${artifact.provider}__${artifact.model}`)

  const gradersRows =
    artifact.graders.length > 0
      ? artifact.graders
          .map(
            // TODO(voz): To make things pretty we could swap true/false for ✅/❌
            ([name, passed]) => `| ${name} | ${passed ? 'true' : 'false'} |`,
          )
          .join('\n')
      : '| (none) | - |'

  const debugContent = `---
provider: ${artifact.provider}
model: ${artifact.model}
framework: ${artifact.framework}
category: ${artifact.category}
evaluation: ${artifact.evaluationPath}
score: ${artifact.score.toFixed(2)}
run_at: ${debugRunTimestamp}
---

## Prompt
~~~
${artifact.prompt.trimEnd()}
~~~

## Response
~~~
${artifact.response.trimEnd()}
~~~

## Graders
| name | passed |
| --- | --- |
${gradersRows}
`

  const filePath = path.join(evaluationDir, `${fileSafeName}.md`)
  await writeFile(filePath, debugContent, 'utf8')
}

if (debugErrors.length > 0) {
  const errorsPath = path.join(debugRunDirectory, 'errors.json')
  await writeFile(errorsPath, JSON.stringify(debugErrors, null, 2), 'utf8')
}

// Report
const outputFile = mcpEnabled ? 'scores-mcp.json' : 'scores.json'
fileReporter(scores, outputFile)
consoleReporter(scores)
