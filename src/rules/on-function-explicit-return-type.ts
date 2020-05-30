import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { onFunctionWithoutType, docsUrl } from '../utils'

export const ruleName = 'on-function-explicit-return-type'

export const messageId = 'onFunctionExplicitReturnType'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'On function should have an explicit return type',
      extraDescription: [
        'This rule forces the on function to have an explicit return type when defined with an arrow function.',
      ],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'On functions should have an explicit return type when using arrow functions, on(action, (state):State => {}',
    },
  },
  defaultOptions: [],
  create: context => {
    return {
      [onFunctionWithoutType](node: TSESTree.TSTypeReference) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
