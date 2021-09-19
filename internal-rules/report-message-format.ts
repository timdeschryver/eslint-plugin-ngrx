import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'

export const messageId = 'reportMessageFormat'
type MessageIds = typeof messageId

type Options = [string]

export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'Ensures a consistent format for rule report messages.',
      recommended: 'error',
    },
    schema: [
      {
        type: 'string',
        additionalProperties: false,
      },
    ],
    messages: {
      [messageId]: 'Report message does not match the pattern `{{pattern}}`.',
    },
  },
  defaultOptions: ['^[A-Z].+\\.$'],
  create: (context, [format]) => {
    const pattern = RegExp(format)

    return {
      [`CallExpression[callee.callee.object.name='ESLintUtils'][callee.callee.property.name='RuleCreator'] Property[key.name='meta'] Property[key.name='messages'] :matches(Literal[value!=${pattern}], TemplateLiteral[quasis.length=1][quasis.0.value.raw!=${pattern}])`](
        node: TSESTree.StringLiteral | TSESTree.TemplateLiteral,
      ) {
        context.report({
          node,
          messageId,
          data: {
            pattern,
          },
        })
      },
    }
  },
})
