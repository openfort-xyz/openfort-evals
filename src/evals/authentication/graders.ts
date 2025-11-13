import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  // Provider setup
  has_openfort_provider: contains('OpenfortProvider'),
  has_publishable_key: contains('publishableKey'),
  has_shield_key: contains('shieldPublishableKey'),
  has_wagmi_provider: contains('WagmiProvider'),
  has_query_client_provider: contains('QueryClientProvider'),
  has_ui_config: contains('uiConfig'),
  
  // Authentication hooks (at least 2 required)
  uses_email_auth: contains('useEmailAuth'),
  uses_oauth: contains('useOAuth'),
  uses_oauth_provider_enum: contains('OAuthProvider'),
  uses_wallet_auth: contains('useWalletAuth'),
  uses_guest_auth: contains('useGuestAuth'),

  // State management hooks
  uses_user_hook: contains('useUser'),
  uses_sign_out_hook: contains('useSignOut'),
  
  // OAuth callback handling
  mentions_auth_callback: contains('useAuthCallback'),
  
  // Recovery configuration
  has_recovery_config: containsAny(['walletRecovery', 'RecoveryMethod']),
})
