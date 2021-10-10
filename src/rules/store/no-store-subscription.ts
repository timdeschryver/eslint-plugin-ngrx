import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  docsUrl,
  getNgRxStores,
  namedCallableExpression,
} from '../../utils'

export const messageId = 'noStoreSubscription'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        "Don't create a store subscription, prefer to use the async pipe.",
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        "Don't create a store subscription, prefer to use the async pipe.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context)
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null

    if (!storeNames) {
      return {}
    }

    return {
      [`${namedCallableExpression(
        storeNames,
      )} > MemberExpression > Identifier[name='subscribe']`](
        node: TSESTree.Identifier,
      ) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
