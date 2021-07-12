import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import { docsUrl, isIdentifier } from '../../utils'

export const messageId = 'avoidDuplicateActionsInReducer'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'A reducer should handle an action once.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        "The reducer handles a duplication action '{{ actionName }}'.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const actions = new Map<string, TSESTree.Identifier[]>()

    function isDuplicate(action: TSESTree.Identifier) {
      const current = actions.get(action.name)
      const value = [action, ...(current || [])]
      actions.set(action.name, value)

      if (value.length === 2) {
        value.forEach((node) => {
          context.report({
            node,
            messageId,
            data: {
              actionName: action.name,
            },
          })
        })
      } else if (value.length > 2) {
        const [node] = value
        context.report({
          node,
          messageId,
          data: {
            actionName: action.name,
          },
        })
      }
    }

    return {
      [`CallExpression[callee.name='createReducer'] > CallExpression[callee.name='on']`](
        node: TSESTree.CallExpression,
      ) {
        if (node.arguments && node.arguments.length > 1) {
          const [action] = node.arguments
          if (isIdentifier(action)) {
            isDuplicate(action)
          }
        }
      },
    }
  },
})
