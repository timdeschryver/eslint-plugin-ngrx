import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'

export const messageId = 'messageId'
export type MessageIds = typeof messageId

// uncomment to see the lint error
// const triggerInternal = 'hello'

type Options = []

module.exports = ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'first rule',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'first rule',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ['Identifier[name="triggerInternal"]'](node: TSESTree.Identifier) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
