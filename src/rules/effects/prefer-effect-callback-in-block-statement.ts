import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { docsUrl, createEffectBody, isCallExpression } from '../../utils'

export const messageId = 'preferEffectCallbackInBlockStatement'

export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'A block statement is easier to troubleshoot.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'The callback of an effect should be wrapped in a block statement.',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [createEffectBody](node: TSESTree.ArrowFunctionExpression) {
        if (node.body && isCallExpression(node.body)) {
          context.report({
            node: node.body,
            messageId,
            fix: (fixer) => [
              fixer.insertTextBefore(node.body, `{ return `),
              fixer.insertTextAfter(node.body, ` }`),
            ],
          })
        }
      },
    }
  },
})
