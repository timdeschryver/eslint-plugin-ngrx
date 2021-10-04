import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  findNgRxStoreName,
  getNearestUpperNodeFrom,
  isCallExpression,
  isCallExpressionWith,
  storeDispatch,
} from '../../utils'

export const messageId = 'preferActionCreatorInDispatch'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Using an `action creator` in `dispatch` is preferred over `object` or old `Action`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `object` or old `Action` is not preferred, use an `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`${storeDispatch(
        storeName,
      )} :matches(NewExpression, :not(NewExpression) > ObjectExpression)`](
        node: TSESTree.NewExpression | TSESTree.ObjectExpression,
      ) {
        const nearestUpperCallExpression = getNearestUpperNodeFrom(
          node,
          isCallExpression,
        )
        const isStoreDispatchImmediateParent =
          nearestUpperCallExpression !== undefined &&
          isCallExpressionWith(
            nearestUpperCallExpression,
            storeName,
            'dispatch',
          )

        if (!isStoreDispatchImmediateParent) {
          return
        }

        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
