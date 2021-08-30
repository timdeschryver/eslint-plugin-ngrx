import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import { findNgRxStoreName } from '../../utils/helper-functions/index'

import { docsUrl, storeExpression } from '../../utils'

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
        "Don't create a store subscription, prefer to use the async pipe",
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        "Don't create a store subscription, prefer to use the async pipe",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`CallExpression:matches([callee.object.callee.object.name=${storeName}], [callee.object.callee.object.object.type='ThisExpression'][callee.object.callee.object.property.name=${storeName}]) > MemberExpression > Identifier[name='subscribe']`](
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
