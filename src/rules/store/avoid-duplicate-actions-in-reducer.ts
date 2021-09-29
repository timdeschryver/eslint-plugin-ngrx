import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createReducer, docsUrl, getNodeToCommaRemoveFix } from '../../utils'

export const avoidDuplicateActionsInReducer = 'avoidDuplicateActionsInReducer'
export const avoidDuplicateActionsInReducerSuggest =
  'avoidDuplicateActionsInReducerSuggest'
export type MessageIds =
  | typeof avoidDuplicateActionsInReducer
  | typeof avoidDuplicateActionsInReducerSuggest

type Options = []
type Action = TSESTree.Identifier & { parent: TSESTree.CallExpression }

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'A `Reducer` should handle an `Action` once.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [avoidDuplicateActionsInReducer]:
        'The `Reducer` handles a duplicate `Action` `{{ actionName }}`.',
      [avoidDuplicateActionsInReducerSuggest]: 'Remove this duplication.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    const collectedActions = new Map<string, Action[]>()

    return {
      [`${createReducer} > CallExpression[callee.name='on'][arguments.0.type='Identifier']`]({
        arguments: { 0: action },
      }: TSESTree.CallExpression & {
        arguments: Action[]
      }) {
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
              messageId: avoidDuplicateActionsInReducer,
              data: {
                actionName,
              },
              suggest: [
                {
                  messageId: avoidDuplicateActionsInReducerSuggest,
                  fix: (fixer) =>
                    getNodeToCommaRemoveFix(sourceCode, fixer, node.parent),
                },
              ],
            })
          }
        }

        collectedActions.clear()
      },
    }
  },
})
