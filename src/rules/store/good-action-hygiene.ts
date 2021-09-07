import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { actionCreatorWithLiteral, docsUrl } from '../../utils'

export const messageId = 'goodActionHygiene'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Enforces the use of good action hygiene.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Action type `{{ actionType }}` does not follow the good action hygiene practice, use "[Source] Event" to define action types.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceEventPattern = /[\[].*[\]]\s.*/

    return {
      [actionCreatorWithLiteral]({
        arguments: { 0: node },
      }: Omit<TSESTree.CallExpression, 'arguments'> & {
        arguments: TSESTree.StringLiteral[]
      }) {
        const { value: actionType } = node

        if (sourceEventPattern.test(actionType)) {
          return
        }

        context.report({
          node,
          messageId,
          data: {
            actionType,
          },
        })
      },
    }
  },
})
