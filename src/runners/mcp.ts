/**
 * MCP Runner - executes evaluations with MCP tool support.
 * Allows models to use MCP tools (e.g. Openfort documentation search)
 * during evaluation, testing their ability to leverage tool-assisted context.
 */
import { generateText, type LanguageModel, stepCountIs } from 'ai'
import type { MCPRunnerArgs, RunnerResult } from '@/src/interfaces'
import { createMCPClient, type MCPClient } from '@/src/utils/mcp-client'
import { ERR, OK } from '@/src/utils/result'
import {
  computeScore,
  loadGraders,
  loadPrompt,
  resolveModel,
  runGraders,
  SYSTEM_PROMPT,
} from './shared'

/**
 * MCP Runner - executes evaluations with MCP tool support
 */
export default async function exec({
  provider,
  model,
  evalPath,
  mcpServerUrl,
  maxToolRounds = 10,
}: MCPRunnerArgs): Promise<RunnerResult> {
  const languageModel = resolveModel(provider, model)
  if (!languageModel) {
    return ERR(new Error(`Unsupported: ${provider}/${model}`))
  }

  let mcpClient: MCPClient | null = null

  try {
    // Connect to MCP server
    const mcp = await createMCPClient(mcpServerUrl)
    mcpClient = mcp.client
    const mcpTools = mcp.tools

    // Load prompt and generate with tool support
    const prompt = await loadPrompt(evalPath)
    const response = await generateText({
      model: languageModel as LanguageModel,
      prompt,
      system: SYSTEM_PROMPT,
      tools: mcpTools as Parameters<typeof generateText>[0]['tools'],
      stopWhen: stepCountIs(maxToolRounds),
      maxOutputTokens: 16384,
    })

    // Collect text from all steps
    const fullResponse =
      response.steps
        ?.map((s) => s.text)
        .filter(Boolean)
        .join('\n\n') || response.text

    // Run graders
    const graders = await loadGraders(evalPath)
    const graderResults = await runGraders(graders, fullResponse)
    const score = computeScore(graderResults)

    return OK({
      score,
      debug: {
        prompt,
        response: fullResponse,
        graders: graderResults,
      },
    })
  } catch (error) {
    return ERR(error)
  } finally {
    await mcpClient?.close()
  }
}
