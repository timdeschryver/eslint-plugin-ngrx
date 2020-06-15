import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { docsUrl, actionCreator } from '../utils'

export const ruleName = 'action-hygiene'

export const messageId = 'actionHygiene'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Enforces the use of good action hygiene. See more at https://www.youtube.com/watch?v=JmnsEvoy-gY.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: `Action type '{{ actionType }}' does not follow the good action hygiene practice, use "[Source] Event" to define action types`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [actionCreator](node: TSESTree.CallExpression) {
        if (node.arguments && node.arguments[0].type === 'Literal') {
          const { value } = node.arguments[0] as TSESTree.Literal
          if (typeof value === 'string' && !/[\[].*[\]]\s.*/.test(value)) {
            context.report({
              node: node.arguments[0],
              messageId,
              data: {
                actionType: value,
              },
            })
          }
        }
      },
    }
  },
})
