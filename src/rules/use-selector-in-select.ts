import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  docsUrl,
  isLiteral,
  isFunctionLike,
  storeSelect,
  readNgRxStoreNameFromSettings,
  createStoreSelectCallExpressionVisitors,
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
    const report = (callNode: TSESTree.CallExpression) => {
      for (const node of callNode.arguments) {
        if (isLiteral(node) || isFunctionLike(node)) {
          context.report({
            node,
            messageId,
          })
        }
      }
    }

    return {
      ...createStoreSelectCallExpressionVisitors(
        readNgRxStoreNameFromSettings(context.settings),
        report,
      ),
      [storeSelect(readNgRxStoreNameFromSettings(context.settings))](
        node: TSESTree.CallExpression,
      ) {
        report(node)
      },
    }
  },
})
