import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  isCallExpression,
  isIdentifier,
  findNgRxStoreName,
} from '../utils'

export const ruleName = 'avoid-mapping-selectors'

export const messageId = 'avoidMapppingSelectors'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Prefer mapping a selector at the selector level, in the projector method of `createSelector`',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Map the value of a selector in the projection method of `createSelector`',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`CallExpression[callee.object.callee.object.property.name=${storeName}][callee.object.callee.property.name='select'][callee.property.name='pipe']`](
        node: TSESTree.CallExpression,
      ) {
        const violations = node.arguments.filter(
          (p) =>
            isCallExpression(p) &&
            isIdentifier(p.callee) &&
            p.callee.name === 'map',
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
