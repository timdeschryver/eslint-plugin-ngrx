import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  actionDispatch,
  docsUrl,
  findNgRxStoreName,
} from '../../utils'

export const messageId = 'avoidDispatchingMultipleActionsSequentially'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'It is recommended to only dispatch one action at a time.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction"',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    const collectedDispatches = new Set<TSESTree.CallExpression>()

    return {
      [`BlockStatement > ${actionDispatch(storeName)}`](
        node: TSESTree.CallExpression,
      ) {
        collectedDispatches.add(node)
      },
      'BlockStatement:exit'() {
        if (collectedDispatches.size > 1) {
          for (const node of collectedDispatches) {
            context.report({
              node,
              messageId,
            })
          }
        }

        collectedDispatches.clear()
      },
    }
  },
})
