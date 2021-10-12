import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  docsUrl,
  getNgRxStores,
  namedExpression,
  selectExpression,
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
        'Prefer combining selectors at the selector level with `createSelector`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Combine selectors at the selector level with `createSelector`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context)
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null

    if (!storeNames) {
      return {}
    }

    const pipeableOrStoreSelect = `:matches(${namedExpression(
      storeNames,
    )}[callee.property.name='pipe']:has(CallExpression[callee.name='select']), ${selectExpression(
      storeNames,
    )})` as const

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
