import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  isCallExpression,
  isMemberExpression,
  isIdentifier,
  findNgRxStoreName,
} from '../../utils'

export const messageId = 'avoidCombiningSelectors'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Prefer combining selectors at the selector level with `createSelector`',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Combine selectors at the selector level with createSelector',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`CallExpression[callee.name='combineLatest'][arguments.length>1]`](
        node: TSESTree.CallExpression,
      ) {
        const [, ...violations] = node.arguments.filter(
          (n) => selectMethod(n, storeName) || selectPipe(n, storeName),
        )

        for (const node of violations) {
          context.report({
            node,
            messageId,
          })
        }
      },
    }
  },
})

function selectMethod(node: TSESTree.Expression, storeName: string) {
  return (
    isCallExpression(node) &&
    isMemberExpression(node.callee) &&
    isMemberExpression(node.callee.object) &&
    isIdentifier(node.callee.object.property) &&
    node.callee.object.property.name === storeName &&
    isIdentifier(node.callee.property) &&
    node.callee.property.name === 'select'
  )
}

function selectPipe(node: TSESTree.Expression, storeName: string) {
  return (
    isCallExpression(node) &&
    isMemberExpression(node.callee) &&
    isMemberExpression(node.callee.object) &&
    isIdentifier(node.callee.object.property) &&
    node.callee.object.property.name === storeName &&
    isIdentifier(node.callee.property) &&
    node.callee.property.name === 'pipe' &&
    node.arguments.some(
      (a) =>
        isCallExpression(a) &&
        isIdentifier(a.callee) &&
        a.callee.name === 'select',
    )
  )
}
