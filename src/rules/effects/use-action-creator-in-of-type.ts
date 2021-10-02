import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl } from '../../utils'

export const messageId = 'useActionCreatorInOfType'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description:
        'Using an `action creator` in `ofType` is preferred over `string`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `string` is not preferred, use an `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name='ofType'] Literal`](node: TSESTree.Literal) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
