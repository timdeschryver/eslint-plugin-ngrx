import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { dispatchInEffects, docsUrl, readNgRxStoreName } from '../utils'

export const ruleName = 'no-dispatch-in-effects'

export const messageId = 'NoDispatchInEffects'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'An Effect should not call store.dispatch',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'Calling `store.dispatch` in an Effect is forbidden',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [dispatchInEffects(readNgRxStoreName(context))](
        node: TSESTree.CallExpression,
      ) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
