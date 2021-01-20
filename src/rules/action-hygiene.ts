import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { actionCreatorWithLiteral, docsUrl } from '../utils'

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
      [actionCreatorWithLiteral](node: TSESTree.CallExpression) {
        const literal = node.arguments[0] as TSESTree.Literal
        const { value: actionType } = literal
        const sourceEventPattern = /[\[].*[\]]\s.*/

        if (
          typeof actionType === 'string' &&
          !sourceEventPattern.test(actionType)
        ) {
          context.report({
            node: literal,
            messageId,
            data: { actionType },
          })
        }
      },
    }
  },
})
