# Task

Build a complete Node.js/TypeScript application that uses the Openfort MCP server to manage a Web3 project programmatically.

## Context

Openfort provides an MCP (Model Context Protocol) server at `https://mcp.openfort.io/sse` that exposes tools for managing Web3 projects, wallets, policies, contracts, and transactions. Your task is to demonstrate how to use these MCP tools effectively.

## Requirements

### 1. Project Setup
- Use the Openfort MCP server tools to list existing projects
- Select or create a project to work with
- Retrieve the project's publishable keys and secret keys

### 2. Policy Management
- Create a gas sponsorship policy for the project
- Add a rule to the policy that sponsors EVM transactions on a specific chain (e.g., Polygon, chain ID 137)
- List all policies to verify the policy was created

### 3. Smart Contract Registration
- Register a smart contract with the project (e.g., an ERC-20 token contract)
- Provide the contract address, chain ID, and ABI
- List contracts to verify registration

### 4. User and Account Management
- Create a new user in the project
- Create an embedded smart account/wallet for the user
- List all users and accounts to verify creation

### 5. Transaction Simulation
- Simulate a transaction to verify validity and estimate gas fees
- Use the simulate-transaction tool with appropriate parameters

## Expected MCP Tools

The Openfort MCP server exposes the following tool categories:

**Context Tools**: `search-documentation`, `create-openfortkit-app`
**Management Tools**: `list-projects`, `get-project`, `create-project`, `select-project`, `get-publishable-keys`, `get-secret-keys`, `get-shield-publishable-key`, `create-publishable-key`, `create-secret-key`, `create-shield-keys`
**Policy Tools**: `list-policies`, `create-policy`, `get-policy`, `update-policy`, `delete-policy`, `enable-policy`, `disable-policy`, `list-policy-rules`, `create-policy-rule`, `update-policy-rule`, `delete-policy-rule`
**Contract Tools**: `create-contract`, `get-contract`, `list-contracts`, `update-contract`, `delete-contract`
**User/Account Tools**: `create-user`, `get-user`, `list-users`, `update-user`, `delete-user`, `create-account`, `get-account`, `list-accounts`
**Transaction Tools**: `list-transactions`, `get-transaction`, `simulate-transaction`

## Output

Provide a well-structured TypeScript application that demonstrates the complete workflow of setting up and managing a Web3 project using Openfort's MCP tools. Include proper error handling and clear comments explaining each step.
