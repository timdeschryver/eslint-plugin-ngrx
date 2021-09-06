import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createReducer, docsUrl } from '../../utils'

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
        'The `Reducer` handles a duplicate `Action` `{{ actionName }}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const collectedActions = new Map<string, TSESTree.Identifier[]>()

    return {
      [`${createReducer} > CallExpression[callee.name='on'][arguments.0.type='Identifier']`]({
        arguments: { 0: action },
      }: TSESTree.CallExpression & { arguments: TSESTree.Identifier[] }) {
        const actions = collectedActions.get(action.name) ?? []
        collectedActions.set(action.name, [...actions, action])
      },
      [`${createReducer}:exit`]() {
        for (const [actionName, identifiers] of collectedActions) {
          if (identifiers.length <= 1) {
            break
          }

          for (const node of identifiers) {
            context.report({
              node,
              messageId,
              data: {
                actionName,
              },
            })
          }
        }

        collectedActions.clear()
      },
    }
  },
})
