import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { isArrowFunctionExpression } from 'eslint-etc'
import path from 'path'
import { createRule } from '../../rule-creator'
import {
  createEffectExpression,
  getImportAddFix,
  NGRX_MODULE_PATHS,
} from '../../utils'

export const messageId = 'preferConcatLatestFrom'
export type MessageIds = typeof messageId

type Options = [{ readonly strict: boolean }]
const defaultOptions: Options[number] = { strict: true }

type WithLatestFromIdentifier = TSESTree.Identifier & {
  parent: TSESTree.CallExpression
}

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    version: '>=12.0.0',
    docs: {
      category: 'Possible Errors',
      description:
        'Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct `Action` is dispatched.',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          strict: {
            type: 'boolean',
            default: defaultOptions.strict,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [messageId]: 'Use `concatLatestFrom` instead of `withLatestFrom`.',
    },
  },
  defaultOptions: [defaultOptions],
  create: (context, [{ strict }]) => {
    const sourceCode = context.getSourceCode()
    const selector = strict
      ? (`${createEffectExpression} CallExpression > Identifier[name='withLatestFrom']` as const)
      : (`${createEffectExpression} > [body] > [arguments] > CallExpression[arguments.length=1] > Identifier[name='withLatestFrom']` as const)

    return {
      [selector](node: WithLatestFromIdentifier) {
        context.report({
          node,
          messageId,
          fix: (fixer) => getFixes(sourceCode, fixer, node),
        })
      },
    }
  },
})

function getFixes(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: WithLatestFromIdentifier,
) {
  const { parent } = node
  const isUsingDeprecatedProjectorArgument = parent.arguments.length > 1
  const [firstArgument] = parent.arguments
  const nextToken =
    isUsingDeprecatedProjectorArgument &&
    sourceCode.getTokenAfter(firstArgument)
  return [
    fixer.replaceText(node, 'concatLatestFrom'),
    ...(isArrowFunctionExpression(firstArgument)
      ? []
      : [fixer.insertTextBefore(firstArgument, '() => ')]),
  ].concat(
    getImportAddFix({
      fixer,
      importName: 'concatLatestFrom',
      moduleName: NGRX_MODULE_PATHS.effects,
      node,
    }),
    ...(isUsingDeprecatedProjectorArgument && nextToken
      ? [
          getImportAddFix({
            fixer,
            importName: 'map',
            moduleName: 'rxjs',
            node,
          }),
          fixer.insertTextAfterRange(nextToken.range, '), map('),
        ]
      : []),
  )
}
