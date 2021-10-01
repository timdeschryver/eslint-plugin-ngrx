import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ASTUtils, ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createEffectExpression, docsUrl } from '../../utils'

export const messageId = 'preferEffectCallbackInBlockStatement'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'A block statement is easier to troubleshoot.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'The callback of an effect should be wrapped in a block statement.',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    const nonParametrizedEffect =
      `${createEffectExpression} > ArrowFunctionExpression > .body[type!=/^(ArrowFunctionExpression|BlockStatement)$/]` as const
    const parametrizedEffect =
      `${createEffectExpression} > ArrowFunctionExpression > ArrowFunctionExpression > .body[type!='BlockStatement']` as const
    const parametrizedEffectWithinBlockStatement =
      `${createEffectExpression} > ArrowFunctionExpression > BlockStatement > ReturnStatement > ArrowFunctionExpression > .body[type!='BlockStatement']` as const

    return {
      [`${nonParametrizedEffect}, ${parametrizedEffect}, ${parametrizedEffectWithinBlockStatement}`](
        node: TSESTree.ArrowFunctionExpression['body'],
      ) {
        context.report({
          node,
          messageId,
          fix: (fixer) => {
            const [previousNode, nextNode] = getSafeNodesToApplyFix(
              sourceCode,
              node,
            )
            return [
              fixer.insertTextBefore(previousNode, `{ return `),
              fixer.insertTextAfter(nextNode, ` }`),
            ]
          },
        })
      },
    }
  },
})

function getSafeNodesToApplyFix(
  sourceCode: Readonly<TSESLint.SourceCode>,
  node: TSESTree.Node,
) {
  const previousToken = sourceCode.getTokenBefore(node)
  const nextToken = sourceCode.getTokenAfter(node)

  if (
    previousToken &&
    ASTUtils.isOpeningParenToken(previousToken) &&
    nextToken &&
    ASTUtils.isClosingParenToken(nextToken)
  ) {
    return [previousToken, nextToken] as const
  }

  return [node, node] as const
}
