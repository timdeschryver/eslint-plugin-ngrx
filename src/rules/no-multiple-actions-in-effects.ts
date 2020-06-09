import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { effectsArrowReturn, effectsReturn, docsUrl, typecheck } from '../utils'

export const ruleName = 'no-multiple-actions-in-effects'

export const messageId = 'noMultipleActionsInEffects'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'An Effect should not return multiple actions.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'An Effect should not return multiple actions.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [effectsArrowReturn](node: TSESTree.ArrayExpression) {
        context.report({
          node,
          messageId,
        })
      },
      [effectsReturn](node: TSESTree.ReturnStatement) {
        const { couldBeOfType } = typecheck(context)
        if (couldBeOfType(node.argument, 'Array')) {
          context.report({
            node: node.argument,
            messageId,
          })
        }
      },
    }
  },
})
