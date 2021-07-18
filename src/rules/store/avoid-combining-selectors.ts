import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  findNgRxStoreName,
  storeSelect,
  storeExpression,
} from '../../utils'

export const messageId = 'avoidCombiningSelectors'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Prefer combining selectors at the selector level with `createSelector`',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Combine selectors at the selector level with createSelector',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    const pipeableOrStoreSelect = `:matches(${storeExpression(
      storeName,
    )}[callee.property.name='pipe']:has(CallExpression[callee.name='select']), ${storeSelect(
      storeName,
    )})`

    return {
      [`CallExpression[callee.name='combineLatest'][arguments.length>1] ${pipeableOrStoreSelect} ~ ${pipeableOrStoreSelect}`](
        node: TSESTree.CallExpression,
      ) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
