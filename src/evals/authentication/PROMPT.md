# Task

Build a React application that implements authentication using Openfort's React SDK.

## Requirements

Your application must:

1. **Configure the Openfort React SDK** with:
   - `OpenfortProvider` with `publishableKey` and `walletConfig`
   - Required React provider wrappers (`WagmiProvider`, `QueryClientProvider`)

2. **Implement these FOUR authentication methods using Openfort's React hooks**:
   - Email-based authentication using `useEmailAuth` (with `signInEmail` and `signUpEmail`)
   - Social authentication using `useOAuth` (with `OAuthProvider` enum)
   - Wallet-based authentication using `useWalletAuth` (Sign-In with Ethereum)
   - Guest/anonymous authentication using `useGuestAuth`

3. **Manage user authentication state using Openfort's React hooks**:
   - Access current user info via `useUser`
   - Handle auth callbacks via `useAuthCallback`
   - Implement sign out via `useSignOut`