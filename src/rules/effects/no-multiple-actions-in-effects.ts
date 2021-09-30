import type { TSESTree } from '@typescript-eslint/experimental-utils'
import {
  AST_NODE_TYPES,
  ESLintUtils,
} from '@typescript-eslint/experimental-utils'
import { getTypeServices } from 'eslint-etc'
import path from 'path'
import {
  createEffectExpression,
  docsUrl,
  mapLikeOperatorsExplicitReturn,
  mapLikeOperatorsImplicitReturn,
} from '../../utils'

export const messageId = 'noMultipleActionsInEffects'
export type MessageIds = typeof messageId

type Options = []
type EffectsMapLikeOperatorsReturn =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.CallExpression
  | TSESTree.ReturnStatement

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'An `Effect` should not return multiple actions.',
      recommended: 'warn',
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]: 'An `Effect` should return a single action.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`${createEffectExpression} :matches(${mapLikeOperatorsImplicitReturn}, ${mapLikeOperatorsExplicitReturn})`](
        node: EffectsMapLikeOperatorsReturn,
      ) {
        const nodeToReport = getNodeToReport(node)

        if (
          !nodeToReport ||
          !getTypeServices(context).couldBeType(nodeToReport, 'Array')
        ) {
          return
        }

        context.report({
          node: nodeToReport,
          messageId,
        })
      },
    }
  },
})

function getNodeToReport(node: EffectsMapLikeOperatorsReturn) {
  switch (node.type) {
    case AST_NODE_TYPES.ArrowFunctionExpression:
      return node.body
    case AST_NODE_TYPES.CallExpression:
      return node.arguments[0]
    default:
      return node.argument
  }
}
