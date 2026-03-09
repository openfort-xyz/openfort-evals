import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  has_openfort_react_import: contains('@openfort/react'),
  uses_wallets_hook: contains('useWallets'),
  mentions_wallet_creation: contains('createWallet'),
  displays_wallet_address: containsAny(['.address', 'address']),
  uses_active_wallet: containsAny(['activeWallet', 'setActiveWallet']),
  has_wallet_config: contains('walletConfig'),
  demonstrates_wallet_operations: judge(
    'Does the code show practical wallet operations like creating a wallet, displaying the address, or managing active wallet?',
  ),
  proper_error_handling: judge('Does the code include error handling for wallet operations?'),
})