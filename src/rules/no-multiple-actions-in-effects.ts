import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  effectsImplicitReturn,
  effectsReturn,
  docsUrl,
  typecheck,
} from '../utils'

export const messageId = 'noMultipleActionsInEffects'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'An Effect should not return multiple actions.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'An Effect should not return multiple actions.',
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

        const { couldBeOfType } = typecheck(context)
        if (couldBeOfType(argument, 'Array')) {
          context.report({
            node: argument,
            messageId,
          })
        }
      },
    }
  },
})
