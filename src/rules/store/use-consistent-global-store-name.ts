import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, injectedStore } from '../../utils'

export const messageId = 'useConsistentGlobalStoreName'
export type MessageIds = typeof messageId

type Options = [string]

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Use a consistent name for the global store.',
      recommended: 'warn',
    },
    schema: [
      {
        type: 'string',
        additionalProperties: false,
      },
    ],
    messages: {
      [messageId]: `Global store should have the name '{{ storeName }}'`,
    },
  },
  defaultOptions: ['store'],
  create: (context, [storeName]) => {
    return {
      [injectedStore](node: TSESTree.Identifier) {
        if (storeName && storeName !== node.name) {
          context.report({
            loc: {
              ...node.loc,
              end: {
                ...node.loc.start,
                column: node.loc.start.column + node.name.length,
              },
            },
            messageId,
            data: {
              storeName,
            },
          })
        }
      },
    }
  },
})
