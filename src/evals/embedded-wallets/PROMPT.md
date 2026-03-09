# Task

Implement embedded wallet creation and management in a React application using Openfort.

## Requirements

Create a React app that:

1. Configures `OpenfortProvider` with `publishableKey` and `walletConfig` (including `shieldPublishableKey`)
2. Uses the `useWallets` hook from `@openfort/react` to manage wallets
3. Implements wallet creation using the `createWallet` function from `useWallets`
4. Displays wallet information (address, active wallet status)
5. Demonstrates setting the active wallet with `setActiveWallet`