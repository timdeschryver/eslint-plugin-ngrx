import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import { getTypeServices } from 'eslint-etc'
import path from 'path'
import { docsUrl, effectsImplicitReturn, effectsReturn } from '../../utils'

export const messageId = 'noMultipleActionsInEffects'
export type MessageIds = typeof messageId

type Options = []

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
      [effectsImplicitReturn](node: TSESTree.ArrayExpression) {
        context.report({
          node,
          messageId,
        })
      },
      [effectsReturn]({ argument }: TSESTree.ReturnStatement) {
        if (!argument) return

        const { couldBeType } = getTypeServices(context)

        if (couldBeType(argument, 'Array')) {
          context.report({
            node: argument,
            messageId,
          })
        }
      },
    }
  },
})
