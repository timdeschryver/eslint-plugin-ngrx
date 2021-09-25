import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createEffectFunction, docsUrl } from '../../utils'

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
      [`${createEffectFunction} > CallExpression`](
        node: TSESTree.CallExpression,
      ) {
        context.report({
          node,
          messageId,
          fix: (fixer) => [
            fixer.insertTextBefore(node, `{ return `),
            fixer.insertTextAfter(node, ` }`),
          ],
        })
      },
    }
  },
})
