import { containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  // Project management tools
  uses_list_projects: containsAny(['list-projects', 'list_projects', 'listProjects']),
  uses_select_or_create_project: containsAny([
    'select-project',
    'select_project',
    'create-project',
    'create_project',
    'selectProject',
    'createProject',
  ]),
  uses_get_keys: containsAny([
    'get-publishable-keys',
    'get-secret-keys',
    'get_publishable_keys',
    'get_secret_keys',
    'getPublishableKeys',
    'getSecretKeys',
    'publishable',
    'secret',
  ]),

  // Policy management tools
  uses_create_policy: containsAny(['create-policy', 'create_policy', 'createPolicy']),
  uses_policy_rule: containsAny([
    'create-policy-rule',
    'create_policy_rule',
    'createPolicyRule',
    'policy-rule',
    'policy_rule',
  ]),
  references_gas_sponsorship: containsAny([
    'sponsor',
    'sponsorship',
    'gas',
    'gasless',
    'sponsorEvmTransaction',
  ]),

  // Contract tools
  uses_contract_tools: containsAny([
    'create-contract',
    'create_contract',
    'createContract',
    'list-contracts',
    'list_contracts',
    'listContracts',
  ]),

  // User/account management
  uses_user_tools: containsAny([
    'create-user',
    'create_user',
    'createUser',
    'list-users',
    'list_users',
    'listUsers',
  ]),
  uses_account_tools: containsAny([
    'create-account',
    'create_account',
    'createAccount',
    'list-accounts',
    'list_accounts',
    'listAccounts',
  ]),

  // Transaction tools
  uses_transaction_tools: containsAny([
    'simulate-transaction',
    'simulate_transaction',
    'simulateTransaction',
    'list-transactions',
    'list_transactions',
    'listTransactions',
  ]),

  // Chain/network references
  references_chain: containsAny(['chainId', 'chain_id', '137', 'polygon', 'Polygon', 'evm']),

  // Quality checks
  demonstrates_workflow: judge(
    'Does the response demonstrate a logical workflow of setting up a Web3 project using Openfort MCP tools, progressing from project setup to policy creation to user/account management?',
  ),
  proper_error_handling: judge(
    'Does the code include proper error handling for MCP tool calls (try/catch, error messages, or status checks)?',
  ),
})
