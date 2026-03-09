# Task

Set up a new React application with Openfort embedded wallet infrastructure for Ethereum.

## Requirements

Create a React app that:

1. Includes all necessary dependencies for Openfort integration (`@openfort/react`, `wagmi`, `viem`, `@tanstack/react-query`)
2. Uses `getDefaultConfig` from `@openfort/react` to create the wagmi configuration
3. Creates a `Providers` component that wraps the application with `WagmiProvider`, `QueryClientProvider`, and `OpenfortProvider` in the correct hierarchy
4. Configures `OpenfortProvider` with `publishableKey` and `walletConfig` (including `shieldPublishableKey`)
5. Configures the app to connect to the **Base Sepolia** testnet chain
6. Uses environment variables for sensitive keys