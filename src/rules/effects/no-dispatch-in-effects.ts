import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { dispatchInEffects, docsUrl, findNgRxStoreName } from '../../utils'

export const messageId = 'NoDispatchInEffects'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Possible Errors',
      description: 'An Effect should not call store.dispatch',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Calling `store.dispatch` in an Effect is forbidden',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [dispatchInEffects(storeName)](node: TSESTree.MemberExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
