import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { effectDecorator } from './utils'

export const ruleName = 'no-effect-decorator'

export const messageId = 'noEffectDecorator'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'The createEffect creator function is preferred',
      extraDescription: ['createEffect allows an effect to be type safe'],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'The createEffect creator function is preferred.',
    },
  },
  defaultOptions: [],
  create: context => {
    return {
      [effectDecorator](node: TSESTree.TSTypeReference) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
