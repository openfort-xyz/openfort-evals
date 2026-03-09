# Task

Implement wallet actions (signing and sending transactions) in a React application using Openfort.

## Requirements

Create a React app that:

1. Configures Openfort with `OpenfortProvider`, `WagmiProvider`, and `QueryClientProvider`
2. Demonstrates message signing using `useSignMessage` from wagmi
3. Demonstrates typed data signing using `useSignTypedData` from wagmi
4. Demonstrates sending transactions using `useWriteContract` from wagmi
5. Shows transaction status tracking with `useWaitForTransactionReceipt`