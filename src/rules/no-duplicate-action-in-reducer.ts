import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { reducerAction } from './selectors'

export const ruleName = 'no-duplicate-action-in-reducer'

export const messageId = 'noDuplicateActionInReducer'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        "An action can't be handled multiple times in the same reducer. See more at https://ngrx.io/api/store/on.",
      extraDescription: [
        'The `on` functions act like a switch case, the last registered `on` will be used to create a state transition',
      ],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'The actions within a reducer must be unique. Duplicate action {{ actionName }}.',
    },
  },
  defaultOptions: [],
  create: context => {
    const actions = new Map<string, TSESTree.Identifier[]>()

    function isDuplicate(action: TSESTree.Identifier) {
      const current = actions.get(action.name)
      const value = [action, ...(current || [])]
      actions.set(action.name, value)

      if (value.length === 2) {
        value.forEach(node => {
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
      [reducerAction](node: TSESTree.Identifier) {
        isDuplicate(node)
      },
    }
  },
})
