import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  has_wallet_config: contains('walletConfig'),
  uses_recovery_method_enum: contains('RecoveryMethod'),
  has_shield_key: containsAny(['shieldPublishableKey', 'SHIELD_PUBLISHABLE_KEY']),
  has_publishable_key: containsAny(['publishableKey', 'PUBLISHABLE_KEY']),
  mentions_automatic_recovery: containsAny([
    'RecoveryMethod.AUTOMATIC',
    'recoverWalletAutomaticallyAfterAuth',
  ]),
  mentions_passkey_recovery: containsAny(['RecoveryMethod.PASSKEY']),
  mentions_password_recovery: containsAny(['RecoveryMethod.PASSWORD']),
  has_encryption_session_endpoint: contains('createEncryptedSessionEndpoint'),
  uses_create_wallet: contains('createWallet'),
  uses_set_recovery: contains('setRecovery'),
  explains_recovery_flow: judge(
    'Does the code explain or demonstrate how wallet recovery works, including the different recovery methods?',
  ),
})