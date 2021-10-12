import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  docsUrl,
  getNgRxStores,
  namedCallableExpression,
  pipeExpression,
} from '../../utils'

export const messageId = 'avoidMapppingSelectors'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Avoid to add mapping logic in the component, instead move that logic in the projector method of `createSelector`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Map the value of a selector in the projection method of `createSelector`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context)
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null

    if (!storeNames) {
      return {}
    }

    const pipeWithSelectAndMapSelector = `${pipeExpression(
      storeNames,
    )}:has(CallExpression[callee.name='select'] ~ CallExpression[callee.name='map'])` as const
    const selectSelector = `${namedCallableExpression(
      storeNames,
    )}[callee.object.callee.property.name='select']` as const

    return {
      [`:matches(${selectSelector}, ${pipeWithSelectAndMapSelector}) > CallExpression[callee.name='map']`](
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
