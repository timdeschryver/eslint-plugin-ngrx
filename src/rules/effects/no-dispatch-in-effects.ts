import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ASTUtils, ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  createEffectExpression,
  dispatchInEffects,
  docsUrl,
  findNgRxStoreName,
  isArrowFunctionExpression,
  isIdentifier,
  isLiteral,
  isObjectExpression,
  isProperty,
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
    fixable: 'code',
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

    let createEffect: TSESTree.CallExpression | undefined
    let dispatchExpression: MemberExpressionWithinCallExpression | undefined

    return {
      [createEffectExpression](node: TSESTree.CallExpression) {
        createEffect = node
      },
      [dispatchInEffects(storeName)](
        node: MemberExpressionWithinCallExpression,
      ) {
        dispatchExpression = node
      },
      [`${createEffectExpression}:exit`]() {
        if (!dispatchExpression) {
          return
        }

        const nodeToReport = getNodeToReport(dispatchExpression)
        const fix: TSESLint.ReportFixFunction = (fixer) =>
          fixer.remove(nodeToReport)

        context.report({
          node: nodeToReport,
          messageId: noDispatchInEffects,
          ...(!createEffect || isLikelyToContainDispatchFalse(createEffect)
            ? { suggest: [{ messageId: noDispatchInEffectsSuggest, fix }] }
            : { fix }),
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

function isLikelyToContainDispatchFalse({
  arguments: [, callExpressionArgument],
}: TSESTree.CallExpression) {
  if (!callExpressionArgument || !isObjectExpression(callExpressionArgument)) {
    return false
  }

  let hasDispatchFalse = false

  for (const property of callExpressionArgument.properties) {
    if (
      !isProperty(property) ||
      (property.computed && isIdentifier(property.key))
    ) {
      return true
    }

    if (!hasDispatchFalse && isDispatchFalse(property)) {
      hasDispatchFalse = true
    }
  }

  return hasDispatchFalse
}

function isDispatchFalse(property: TSESTree.Property) {
  return (
    ASTUtils.getPropertyName(property) === 'dispatch' &&
    isLiteral(property.value) &&
    property.value.value === false
  )
}
