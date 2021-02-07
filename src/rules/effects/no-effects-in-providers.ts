import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ASTUtils, ESLintUtils } from '@typescript-eslint/experimental-utils'
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
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        'The `Effect` should not be listed as a provider if it is added to the `EffectsModule`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    const effectsInProviders = new Set<TSESTree.Identifier>()
    const effectsInImports = new Set<string>()

    return {
      [effectsInNgModuleProviders](node: TSESTree.Identifier) {
        effectsInProviders.add(node)
      },
      [effectsInNgModuleImports](node: TSESTree.Identifier) {
        effectsInImports.add(node.name)
      },
      [`${ngModuleDecorator}:exit`]() {
        for (const effectInProvider of effectsInProviders) {
          if (!effectsInImports.has(effectInProvider.name)) {
            continue
          }

          context.report({
            node: effectInProvider,
            messageId,
            fix: (fixer) => getFixes(sourceCode, fixer, effectInProvider),
          })
        }

        effectsInImports.clear()
        effectsInProviders.clear()
      },
    }
  },
})

function getFixes(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: TSESTree.Identifier,
) {
  const nextToken = sourceCode.getTokenAfter(node)
  const isNextTokenComma = nextToken && ASTUtils.isCommaToken(nextToken)
  return [
    fixer.remove(node),
    ...(isNextTokenComma ? [fixer.remove(nextToken)] : []),
  ] as const
}
