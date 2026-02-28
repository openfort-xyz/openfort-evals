# openfort-evals

This repository hosts public evaluation suites used to test how LLMs perform at writing Openfort code (primarily with React and Next.js). Openfort provides embedded wallet infrastructure, authentication, and blockchain integration. If an AI contributor is asked to "create a new eval suite for embedded wallet creation", it should add a new folder under `src/evals/` with a `PROMPT.md` and `graders.ts`, then register it in `src/index.ts`.

![diagram](./docs/diagram.jpg)

## Quickstart

Install [Bun](https://bun.sh) `>=1.3.0`, then gather the required API keys. See [`.env.example`](./.env.example)

```bash
cp .env.example .env
```

Run the eval suite

```bash
bun i
bun start
```

## Supported Models

The eval suite supports the following models across all major providers:

| Provider | Models |
|----------|--------|
| **OpenAI** | gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, gpt-4o, gpt-5, o3, o3-mini, o4-mini |
| **Anthropic** | claude-opus-4-6, claude-sonnet-4-5, claude-haiku-4-5 |
| **Google** | gemini-2.5-pro, gemini-2.5-flash |
| **Vercel** | v0-1.5-md |

## CLI Options

```bash
bun start                                      # Run all evals on all models
bun start --eval evals/basic-setup             # Run one eval on all models
bun start --model claude-opus-4-6              # Run all evals on one model
bun start --model gpt-4.1,claude-opus-4-6      # Run all evals on multiple models
bun start --provider google                    # Run all evals on Google models only
bun start --mcp                                # Run all evals with MCP tool support
bun start --mcp --eval evals/mcp-server        # Run MCP server eval with MCP tools
```

### MCP Mode

The `--mcp` flag enables MCP (Model Context Protocol) tool support. When enabled, models can access the Openfort MCP server tools during evaluation, testing their ability to leverage documentation and API tools.

The default MCP server URL is `https://mcp.openfort.io/sse`. Override it with `MCP_SERVER_URL_OVERRIDE` in your `.env` file.

```bash
bun start:mcp                                  # Shortcut for bun start --mcp
```

## Add a new evaluation

For detailed, copy-pastable steps see [`docs/ADDING_EVALS.md`](./docs/ADDING_EVALS.md). In short:

- Create `src/evals/your-eval/` with `PROMPT.md` and `graders.ts`.
- Implement graders that return booleans using `defineGraders(...)` and shared judges in `@/src/graders/catalog`.
- Append an entry to the `evaluations` array in `src/index.ts` with `framework`, `category`, and `path` (e.g., `evals/embedded-wallets`).
- Run `bun run start:eval src/evals/your-eval` (optionally `--debug`).

<details>
<summary>Example scores</summary>

```json
[
  {
    "model": "gpt-4.1",
    "label": "GPT-4.1",
    "framework": "React",
    "category": "Setup",
    "value": 0.85,
    "updatedAt": "2026-02-28T12:00:00.000Z"
  },
  {
    "model": "claude-opus-4-6",
    "label": "Claude Opus 4.6",
    "framework": "React",
    "category": "Setup",
    "value": 0.92,
    "updatedAt": "2026-02-28T12:00:00.000Z"
  },
  {
    "model": "gemini-2.5-pro",
    "label": "Gemini 2.5 Pro",
    "framework": "React",
    "category": "Setup",
    "value": 0.77,
    "updatedAt": "2026-02-28T12:00:00.000Z"
  }
]
```

</details>

**Debugging**

```bash
# Run a single evaluation
bun run start:eval evals/basic-setup

# Run in debug mode
bun run start --debug

# Run for a specific provider
bun run start --provider anthropic
```

## Overview

This project is broken up into a few core pieces:

- [`src/index.ts`](./src/index.ts): This is the main entrypoint of the project. Evaluations, models, reporters, and the runner are registered here, and all executed.
- [`/evals`](./src/evals): Folders that contain a prompt and grading expectations. Runners currently assume that eval folders contain two files: `graders.ts` and `PROMPT.md`.
- [`/runners`](./src/runners): The primary logic responsible for loading evaluations, calling provider LLMs, and outputting scores. Includes `main.ts` (baseline) and `mcp.ts` (with MCP tool support).
- [`/reporters`](./src/reporters): The primary logic responsible for sending scores somewhere — stdout, a file, etc.

### Running

A **runner** takes a simple object as an argument:

```jsonc
{
  "provider": "openai",
  "model": "gpt-4.1",
  "evalPath": "/absolute/path/to/openfort-evals/src/evals/basic-setup"
}
```

It will resolve the provider and model to the respective SDK.

It will load the designated **evaluation**, generate LLM text from the prompt, and pass the result to graders.

When MCP mode is enabled (`--mcp`), the runner additionally:
- Connects to the Openfort MCP server
- Provides discovered MCP tools to the model during generation
- Allows the model to call tools (up to 10 rounds) before final response

### Evaluations

At the moment, **evaluations** are simply folders that contain:

- `PROMPT.md`: the instruction for which we're evaluating the model's output on
- `graders.ts`: a module containing grader functions which return `true/false` signalling if the model's output passed or failed. This is essentially our acceptance criteria.

### Graders

Shared grader primitives live in [`src/graders/index.ts`](./src/graders/index.ts). Use them to declare new checks with a consistent, terse shape:

```ts
import { contains, defineGraders, judge } from '@/src/graders'
import { llmChecks } from '@/src/graders/catalog'

export const graders = defineGraders({
  references_providers: contains('providers.tsx'),
  package_json: llmChecks.packageJsonOpenfortReactVersion,
  openfort_setup: judge(
    'Does the answer correctly set up OpenfortProvider with publishableKey and walletConfig?',
  ),
})
```

- `contains` / `containsAny`: case-insensitive substring checks by default
- `matches`: regex checks
- `judge`: thin wrappers around the LLM-as-judge scorer. Shared prompts live in [`src/graders/catalog.ts`](./src/graders/catalog.ts); add new reusable prompts there.
- `defineGraders`: preserves type inference for the exported `graders` record.

### Score

For a given model, and evaluation, we'll retrieve a score from `0..1`, which is the percentage of grader functions that passed.

### Reporting

At the moment, we employ two minimal **reporters**

- [console](./src/reporters/console.ts): writes scores via `console.log()`
- [file](./src/reporters/file.ts): saves scores to a gitignored `scores.json` file.

### Interfaces

For the notable interfaces, see [`/interfaces`](./src/interfaces/index.ts).
