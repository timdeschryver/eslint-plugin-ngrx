import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  ngModuleDecorator,
  ngModuleImports,
  ngModuleProviders,
  docsUrl,
} from '../utils'

export const ruleName = 'no-effects-in-providers'

export const messageId = 'noEffectsInProviders'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        'An Effect should not be listed as a provider if it is added to the EffectsModule',
      extraDescription: [
        'If an Effect is registered with EffectsModule and is added as a provider, it will be registered twice',
      ],
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'The Effect should not be listed as a provider if it is added to the EffectsModule',
    },
  },
  defaultOptions: [],
  create: context => {
    const effectsInProviders: TSESTree.Identifier[] = []
    const importedEffectsNames: string[] = []

    return {
      [ngModuleProviders](node: TSESTree.Identifier) {
        effectsInProviders.push(node)
      },
      [ngModuleImports](node: TSESTree.Identifier) {
        importedEffectsNames.push(node.name)
      },
      [`${ngModuleDecorator}:exit`]() {
        effectsInProviders.forEach((effect: TSESTree.Identifier) => {
          if (importedEffectsNames.includes(effect.name)) {
            context.report({
              node: effect,
              messageId,
            })
          }
        })
      },
    }
  },
})
