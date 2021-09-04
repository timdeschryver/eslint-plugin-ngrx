import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
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
      description: 'A `Reducer` should handle an `Action` once.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'The `Reducer` handles a duplication `Action` `{{ actionName }}`.',
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
