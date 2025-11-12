import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  uses_auth_provider_enum: contains('AuthProvider'),
  mentions_email_auth: containsAny(['AuthProvider.EMAIL']),
  mentions_social_auth: containsAny([
    'AuthProvider.GOOGLE',
    'AuthProvider.FACEBOOK',
    'AuthProvider.TWITTER',
  ]),
  mentions_guest_auth: containsAny(['AuthProvider.GUEST']),
  mentions_wallet_auth: containsAny(['AuthProvider.WALLET']),
  has_ui_config: contains('uiConfig'),
  has_login_ui: containsAny(['OpenfortButton', 'useEmailAuth', 'useOAuth', 'useGuestAuth', 'useWalletAuth']),
  has_publishable_key: containsAny(['publishableKey']),
  has_shield_key: containsAny(['shieldPublishableKey']),
  has_openfort_provider: contains('OpenfortProvider'),
  has_wagmi_provider: containsAny(['WagmiProvider']),
  has_query_client_provider: containsAny(['QueryClientProvider']),
  demonstrates_auth_state: judge(
    'Does the code demonstrate how to check or access authentication state using hooks or similar methods?',
  ),
  shows_login_logout: judge('Does the code show or explain how users can log in and log out?'),
})
