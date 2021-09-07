import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { constructorExit, docsUrl, injectedStore } from '../../utils'

export const messageId = 'noMultipleGlobalStores'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'There should only be one global store injected.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Global store should be injected only once.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const collectedStores = new Set<TSESTree.Identifier>()

    return {
      [injectedStore](node: TSESTree.Identifier) {
        collectedStores.add(node)
      },
      [constructorExit]() {
        if (collectedStores.size > 1) {
          for (const node of collectedStores) {
            context.report({
              node,
              messageId,
            })
          }
        }

        collectedStores.clear()
      },
    }
  },
})
