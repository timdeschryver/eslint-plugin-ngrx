import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ASTUtils, ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, getLast, onFunctionWithoutType } from '../../utils'

export const onFunctionExplicitReturnType = 'onFunctionExplicitReturnType'
export const onFunctionExplicitReturnTypeSuggest =
  'onFunctionExplicitReturnTypeSuggest'
export type MessageIds =
  | typeof onFunctionExplicitReturnType
  | typeof onFunctionExplicitReturnTypeSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'On function should have an explicit return type.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [onFunctionExplicitReturnType]:
        'On functions should have an explicit return type when using arrow functions: `on(action, (state): State => {}`.',
      [onFunctionExplicitReturnTypeSuggest]:
        'Add the explicit return type `State` (if the interface/type is named differently you need to manually correct the return type).',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()

    return {
      [onFunctionWithoutType](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId: onFunctionExplicitReturnType,
          suggest: [
            {
              messageId: onFunctionExplicitReturnTypeSuggest,
              fix: (fixer) => getFixes(node, sourceCode, fixer),
            },
          ],
        })
      },
    }
  },
})

function getFixes(
  { params }: TSESTree.ArrowFunctionExpression,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
) {
  const [firstParam] = params
  const lastParam = getLast(params)
  const previousToken = sourceCode.getTokenBefore(firstParam)
  const isParenthesized =
    previousToken && ASTUtils.isOpeningParenToken(previousToken)

  if (isParenthesized) {
    const nextToken = sourceCode.getTokenAfter(lastParam)
    return fixer.insertTextAfter(nextToken ?? lastParam, ': State')
  }

  return [
    fixer.insertTextBefore(firstParam, '('),
    fixer.insertTextAfter(lastParam, '): State'),
  ] as const
}
