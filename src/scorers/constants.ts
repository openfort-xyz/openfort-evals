import { makeScorer } from '@/src/scorers/llm'

export const PATTERNS = {
  OPENFORT_NODE_IMPORT: /from ['"]@openfort\/openfort-node['"]/,
  OPENFORT_REACT_IMPORT: /from ['"]@openfort\/react['"]/,
}

const PROMPT_USES_OPENFORT_SDK =
  'Does the solution correctly import and initialize the Openfort SDK using the new namespace API (e.g., new Openfort(...) or @openfort/openfort-node)?'
const PROMPT_PROPER_ERROR_HANDLING =
  'Does the solution include proper error handling for API calls (try/catch blocks, error responses)?'
const PROMPT_USES_ENV_VARIABLES =
  'Does the solution use environment variables for sensitive keys (API keys, wallet secrets) rather than hardcoding them?'

export const SCORERS = {
  USES_OPENFORT_SDK: makeScorer(PROMPT_USES_OPENFORT_SDK),
  PROPER_ERROR_HANDLING: makeScorer(PROMPT_PROPER_ERROR_HANDLING),
  USES_ENV_VARIABLES: makeScorer(PROMPT_USES_ENV_VARIABLES),
}
