import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  dispatchInEffects,
  docsUrl,
  getNgRxStores,
  isArrowFunctionExpression,
  isReturnStatement,
} from '../../utils'

export const noDispatchInEffects = 'noDispatchInEffects'
export const noDispatchInEffectsSuggest = 'noDispatchInEffectsSuggest'
export type MessageIds =
  | typeof noDispatchInEffects
  | typeof noDispatchInEffectsSuggest

type Options = []
type MemberExpressionWithinCallExpression = TSESTree.MemberExpression & {
  parent: TSESTree.CallExpression
}

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Possible Errors',
      description: 'An `Effect` should not call `store.dispatch`.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noDispatchInEffects]:
        'Calling `store.dispatch` in an `Effect` is forbidden.',
      [noDispatchInEffectsSuggest]: 'Remove `store.dispatch`.',
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
      [dispatchInEffects(storeNames)](
        node: MemberExpressionWithinCallExpression,
      ) {
        const nodeToReport = getNodeToReport(node)
        context.report({
          node: nodeToReport,
          messageId: noDispatchInEffects,
          suggest: [
            {
              messageId: noDispatchInEffectsSuggest,
              fix: (fixer) => fixer.remove(nodeToReport),
            },
          ],
        })
      },
    }
  },
})

function getNodeToReport(node: MemberExpressionWithinCallExpression) {
  const { parent } = node
  const { parent: grandParent } = parent
  return grandParent &&
    (isArrowFunctionExpression(grandParent) || isReturnStatement(grandParent))
    ? node
    : parent
}
