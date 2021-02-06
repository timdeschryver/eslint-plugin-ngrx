import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { dispatchInEffects, docsUrl } from '../utils'

export const ruleName = 'no-dispatch-in-effects'

export const noDispatchInEffects = 'noDispatchInEffects'
export const noDispatchInEffectsSuggest = 'noDispatchInEffectsSuggest'
export type MessageIds =
  | typeof noDispatchInEffects
  | typeof noDispatchInEffectsSuggest

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
      [noDispatchInEffects]:
        'Calling `store.dispatch` in an Effect is forbidden',
      [noDispatchInEffectsSuggest]: 'Remove `store.dispatch`',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [dispatchInEffects](node: TSESTree.CallExpression) {
        context.report({
          suggest: [
            {
              fix: (fixer) => fixer.remove(node),
              messageId: noDispatchInEffectsSuggest,
            },
          ],
          node,
          messageId: noDispatchInEffects,
        })
      },
    }
  },
})
