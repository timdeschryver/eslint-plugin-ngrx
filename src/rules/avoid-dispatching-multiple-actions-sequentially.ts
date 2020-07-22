import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  isCallExpression,
  isMemberExpression,
  isIdentifier,
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
    let storeName = ''
    return {
      [`MethodDefinition[kind='constructor'] Identifier[typeAnnotation.typeAnnotation.typeName.name="Store"]`](
        node: TSESTree.Identifier,
      ) {
        storeName = node.name
      },
      [`ClassDeclaration > ClassBody > MethodDefinition > FunctionExpression > BlockStatement`](
        node: TSESTree.BlockStatement,
      ) {
        if (!storeName) return

        const dispatchExpressions = node.body
          .map((expression: TSESTree.ExpressionStatement) => {
            if (
              isCallExpression(expression.expression) &&
              isMemberExpression(expression.expression.callee) &&
              isIdentifier(expression.expression.callee.property) &&
              expression.expression.callee.property.name === 'dispatch' &&
              isMemberExpression(expression.expression.callee.object) &&
              isIdentifier(expression.expression.callee.object.property) &&
              expression.expression.callee.object.property.name === storeName
            ) {
              return expression.expression
            } else {
              return null
            }
          })
          .filter(Boolean)

        if (dispatchExpressions.length > 1) {
          dispatchExpressions.forEach((expression) => {
            context.report({
              node: expression,
              messageId: 'AvoidDispatchingMultipleActionsSequentially',
            })
          })
        }
      },
    }
  },
})
