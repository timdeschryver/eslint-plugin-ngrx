import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  docsUrl,
  injectedStore,
  isMemberExpression,
  isIdentifier,
  isLiteral,
  isCallExpression,
  isArrowFunctionExpression,
} from '../utils'

export const ruleName = 'use-selector-in-select'

export const messageId = 'useSelectorInSelect'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        'Using a selector in a select function is preferred in favor of strings/props drilling',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using string or props drilling is not preferred, use a selector instead',
    },
  },
  defaultOptions: [],
  create: (context) => {
    let storeName = ''
    const selectNodes: { node: TSESTree.Node; storeName: string }[] = []

    return {
      [injectedStore](node: TSESTree.Identifier) {
        storeName = node.name
      },
      [`ClassDeclaration > ClassBody CallExpression[callee.property.name="select"]`](
        node: TSESTree.CallExpression,
      ) {
        const invalidArguments = node.arguments.filter(
          (arg) => isLiteral(arg) || isArrowFunctionExpression(arg),
        )

        if (
          invalidArguments.length &&
          isMemberExpression(node.callee) &&
          isMemberExpression(node.callee.object) &&
          isIdentifier(node.callee.object.property)
        ) {
          for (const argument of invalidArguments) {
            selectNodes.push({
              node: argument,
              storeName: node.callee.object.property.name,
            })
          }
        }
      },
      [`ClassDeclaration > ClassBody CallExpression[callee.name="select"]`](
        node: TSESTree.CallExpression,
      ) {
        const invalidArguments = node.arguments.filter(
          (arg) => isLiteral(arg) || isArrowFunctionExpression(arg),
        )

        if (
          invalidArguments.length &&
          isCallExpression(node.parent) &&
          isMemberExpression(node.parent.callee) &&
          isMemberExpression(node.parent.callee.object) &&
          isIdentifier(node.parent.callee.object.property)
        ) {
          for (const argument of invalidArguments) {
            selectNodes.push({
              node: argument,
              storeName: node.parent.callee.object.property.name,
            })
          }
        }
      },
      ['Program:exit']: () => {
        if (!storeName) return
        selectNodes.forEach((n) => {
          if (n.storeName === storeName) {
            context.report({
              node: n.node,
              messageId,
            })
          }
        })
      },
    }
  },
})
