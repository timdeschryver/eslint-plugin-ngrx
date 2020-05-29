import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { select, docsUrl } from './utils'

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
      extraDescription: [
        'A selector is more performant, shareable and maintainable',
      ],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using string or props drilling is not preferred, use a selector instead',
    },
  },
  defaultOptions: [],
  create: context => {
    return {
      [select](node: TSESTree.Literal | TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
