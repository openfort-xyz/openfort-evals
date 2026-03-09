# Task

Implement wallet recovery configuration in a React application using Openfort.

## Requirements

Create a React app that:

1. Configures `OpenfortProvider` with `walletConfig` including recovery settings:
   - `shieldPublishableKey` for Shield integration
   - `createEncryptedSessionEndpoint` for automatic recovery backend
   - `recoverWalletAutomaticallyAfterAuth` flag
2. Uses `RecoveryMethod` enum from `@openfort/react` to specify recovery methods
3. Demonstrates creating wallets with different recovery methods (automatic, password, passkey) via `createWallet`
4. Shows how to change recovery method on an existing wallet using `setRecovery` from `useWallets`