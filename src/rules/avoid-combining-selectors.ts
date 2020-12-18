import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  isCallExpression,
  isMemberExpression,
  isIdentifier,
} from '../utils'

export const ruleName = 'avoid-combining-selectors'

export const messageId = 'avoidCombiningSelectors'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
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
    return {
      [`CallExpression[callee.name='combineLatest'][arguments.length>1]`](
        node: TSESTree.CallExpression,
      ) {
        const [, ...violations] = node.arguments.filter(
          (p) =>
            isCallExpression(p) &&
            isMemberExpression(p.callee) &&
            isMemberExpression(p.callee.object) &&
            isIdentifier(p.callee.object.property) &&
            p.callee.object.property.name === 'store' &&
            isIdentifier(p.callee.property) &&
            p.callee.property.name === 'select',
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
