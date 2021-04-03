import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  docsUrl,
  isLiteral,
  isFunctionExpressionLike,
  storeSelect,
  findNgRxStoreName,
  pipeableSelect,
} from '../utils'

export const ruleName = 'use-selector-in-select'

export const messageId = 'useSelectorInSelect'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Using a selector in a select method is preferred in favor of strings or props drilling',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using string or props drilling is not preferred, use a selector instead',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`${pipeableSelect(storeName)}, ${storeSelect(storeName)}`]({
        arguments: args,
      }: TSESTree.CallExpression) {
        args
          .filter((node) => isLiteral(node) || isFunctionExpressionLike(node))
          .forEach((node) =>
            context.report({
              node,
              messageId,
            }),
          )
      },
    }
  },
})
