import { contains, containsAny, defineGraders, judge } from '@/src/graders'

export const graders = defineGraders({
  uses_sign_message: containsAny(['useSignMessage', 'signMessage']),
  uses_account_hook: contains('useAccount'),
  uses_sign_typed_data: containsAny(['useSignTypedData', 'signTypedData']),
  uses_wait_transaction_receipt: contains('useWaitForTransactionReceipt'),
  demonstrates_transactions: containsAny([
    'useWriteContract',
    'writeContract',
  ]),
  there_is_an_address: containsAny(['address']),
  handles_transaction_status: containsAny([
    'isPending',
    'isSuccess',
    'isError',
    'status',
  ]),
  demonstrates_error_handling: judge(
    'Does the code include proper error handling for transaction failures?',
  ),
  shows_blockchain_interaction: judge(
    'Does the code demonstrate practical blockchain interaction (reading/writing data, sending transactions)?',
  ),
})