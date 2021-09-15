import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  dispatchInEffects,
  docsUrl,
  findNgRxStoreName,
  isArrowFunctionExpression,
  isReturnStatement,
} from '../../utils'

export const noDispatchInEffects = 'noDispatchInEffects'
export const noDispatchInEffectsSuggest = 'noDispatchInEffectsSuggest'
export type MessageIds =
  | typeof noDispatchInEffects
  | typeof noDispatchInEffectsSuggest

type Options = []
type DispatchInEffects = TSESTree.MemberExpression & {
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
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [dispatchInEffects(storeName)](node: DispatchInEffects) {
        context.report({
          node,
          messageId: noDispatchInEffects,
          suggest: [
            {
              messageId: noDispatchInEffectsSuggest,
              fix: (fixer) => getFixes(fixer, node),
            },
          ],
        })
      },
    }
  },
})

function getFixes(fixer: TSESLint.RuleFixer, node: DispatchInEffects) {
  const { parent } = node
  const { parent: grandParent } = parent
  const nodeToRemove =
    grandParent &&
    (isArrowFunctionExpression(grandParent) || isReturnStatement(grandParent))
      ? node
      : parent
  return fixer.remove(nodeToRemove)
}
