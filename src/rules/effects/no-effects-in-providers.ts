import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  effectsInNgModuleImports,
  effectsInNgModuleProviders,
  ngModuleDecorator,
} from '../../utils'

export const messageId = 'noEffectsInProviders'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        'An `Effect` should not be listed as a provider if it is added to the `EffectsModule`.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'The `Effect` should not be listed as a provider if it is added to the `EffectsModule`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const effectsInProviders: TSESTree.Identifier[] = []
    const importedEffectsNames: string[] = []

    return {
      [effectsInNgModuleProviders](node: TSESTree.Identifier) {
        effectsInProviders.push(node)
      },
      [effectsInNgModuleImports](node: TSESTree.Identifier) {
        importedEffectsNames.push(node.name)
      },
      [`${ngModuleDecorator}:exit`]() {
        for (const effectInProvider of effectsInProviders) {
          if (importedEffectsNames.includes(effectInProvider.name)) {
            context.report({
              node: effectInProvider,
              messageId,
            })
          }
        }
      },
    }
  },
})
