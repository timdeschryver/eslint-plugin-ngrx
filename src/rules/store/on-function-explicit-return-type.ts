import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, onFunctionWithoutType } from '../../utils'

export const messageId = 'onFunctionExplicitReturnType'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'On function should have an explicit return type',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'On functions should have an explicit return type when using arrow functions, on(action, (state):State => {}',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [onFunctionWithoutType](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
