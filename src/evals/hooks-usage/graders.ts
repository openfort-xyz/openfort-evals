import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  uses_use_account: contains('useAccount'),
  uses_wallets_hook: contains('useWallets'),
  uses_balance_hook: containsAny(['useBalance']),
  uses_chain_hooks: containsAny(['useChainId', 'useSwitchChain']),
  uses_use_user_hook: contains('useUser'),
  uses_sign_out_hook: contains('useSignOut'),
  uses_wagmi: contains('wagmi'),
  uses_openfort_react: contains('@openfort/react'),
})