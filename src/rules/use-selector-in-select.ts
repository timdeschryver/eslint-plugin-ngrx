import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  docsUrl,
  isLiteral,
  isFunctionExpressionLike,
  storeSelect,
  readNgRxStoreNameFromSettings,
  pipeableSelect,
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
    const storeName = readNgRxStoreNameFromSettings(context.settings)

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
