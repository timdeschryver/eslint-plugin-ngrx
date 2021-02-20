import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  actionDispatch,
  docsUrl,
  isExpressionStatement,
  readNgRxStoreName,
} from '../utils'

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
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction"',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const dispatchExpressionsWithSameParent = new Map<
      TSESTree.Node,
      TSESTree.CallExpression[]
    >()
    return {
      [`${actionDispatch(readNgRxStoreName(context))}`](
        node: TSESTree.CallExpression,
      ) {
        if (
          node.parent &&
          isExpressionStatement(node.parent) &&
          node.parent.parent
        ) {
          const nodes =
            dispatchExpressionsWithSameParent.get(node.parent.parent) || []
          dispatchExpressionsWithSameParent.set(node.parent.parent, [
            ...nodes,
            node,
          ])
        }
      },
      ['Program:exit']() {
        dispatchExpressionsWithSameParent.forEach((dispatches) => {
          if (dispatches.length > 1)
            dispatches.forEach((node) =>
              context.report({
                node,
                messageId,
              }),
            )
        })
      },
    }
  },
})
