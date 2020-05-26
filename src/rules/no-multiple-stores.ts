import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { constructorExit, injectedStore } from './utils'

export const ruleName = 'no-multiple-stores'

export const messageId = 'noMultipleStores'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'There should only be one store injected',
      extraDescription: ['There is only one global store'],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'Store should be injected only once',
    },
  },
  defaultOptions: [],
  create: context => {
    const injectedStores: TSESTree.Identifier[] = []

    return {
      [injectedStore](node: TSESTree.TSTypeReference) {
        injectedStores.push(node.parent.parent as TSESTree.Identifier)
      },
      [constructorExit]() {
        injectedStores
          .filter((_, i) => i > 0)
          .forEach(node => {
            context.report({
              node,
              messageId,
            })
          })
      },
    }
  },
})