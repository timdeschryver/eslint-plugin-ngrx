import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { dispatchInEffects } from './utils'

export const ruleName = 'no-dispatch-in-effects'

export const messageId = 'NoDispatchInEffects'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'An Effect should not call store.dispatch',
      extraDescription: ['An action should be returned from the effect'],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'Calling `store.dispatch` in an Effect is forbidden',
    },
  },
  defaultOptions: [],
  create: context => {
    return {
      [dispatchInEffects](node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
