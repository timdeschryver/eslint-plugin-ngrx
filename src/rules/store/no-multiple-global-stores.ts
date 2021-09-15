import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ASTUtils, ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  constructorExit,
  docsUrl,
  injectedStore,
  isTSParameterProperty,
} from '../../utils'

export const noMultipleGlobalStores = 'noMultipleGlobalStores'
export const noMultipleGlobalStoresSuggest = 'noMultipleGlobalStoresSuggest'
export type MessageIds =
  | typeof noMultipleGlobalStores
  | typeof noMultipleGlobalStoresSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'There should only be one global store injected.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noMultipleGlobalStores]: 'Global store should be injected only once.',
      [noMultipleGlobalStoresSuggest]: 'Remove this reference.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    const collectedStores = new Set<TSESTree.Identifier>()

    return {
      [injectedStore](node: TSESTree.Identifier) {
        collectedStores.add(node)
      },
      [constructorExit]() {
        const stores = [...collectedStores]
        collectedStores.clear()

        if (stores.length <= 1) {
          return
        }

        for (const node of stores) {
          context.report({
            node,
            messageId: noMultipleGlobalStores,
            suggest: [
              {
                fix: (fixer) => getFixes(sourceCode, fixer, node),
                messageId: noMultipleGlobalStoresSuggest,
              },
            ],
          })
        }
      },
    }
  },
})

function getFixes(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: TSESTree.Identifier,
) {
  const { parent } = node
  const nodeToRemove = parent && isTSParameterProperty(parent) ? parent : node
  const nextToken = sourceCode.getTokenAfter(nodeToRemove)
  const isNextTokenComma = nextToken && ASTUtils.isCommaToken(nextToken)
  return [
    fixer.remove(nodeToRemove),
    ...(isNextTokenComma ? [fixer.remove(nextToken)] : []),
  ] as const
}
