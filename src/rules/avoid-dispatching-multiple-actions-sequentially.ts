import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { multipleActionDispatch, docsUrl } from '../utils'

export const ruleName = 'avoid-dispatching-multiple-actions-sequentially'

export const messageId = 'AvoidDispatchingMultipleActionsSequentially'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'It is recommended to only dispatch one action at a time.',
      extraDescription: [
        'See more at https://redux.js.org/style-guide/style-guide#avoid-dispatching-many-actions-sequentially',
      ],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction"',
    },
  },
  defaultOptions: [],
  create: context => {
    return {
      [multipleActionDispatch](node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
