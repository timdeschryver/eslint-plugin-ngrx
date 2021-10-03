import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { isArrowFunctionExpression } from 'eslint-etc'
import path from 'path'
import { createRule } from '../../rule-creator'
import {
  createEffectExpression,
  findNgRxEffectActionsName,
  getImportAddFix,
  NGRX_MODULE_PATHS,
  storeExpression,
} from '../../utils'

export const messageId = 'preferConcatLatestFrom'
export type MessageIds = typeof messageId

type Options = [{ readonly strict: boolean }]
type WithLatestFromIdentifier = TSESTree.Identifier & {
  parent: TSESTree.CallExpression
}

const defaultOptions: Options[number] = { strict: false }
const concatLatestFromKeyword = 'concatLatestFrom'
const withLatestFromKeyword = 'withLatestFrom'

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    version: '>=12.0.0',
    docs: {
      category: 'Possible Errors',
      description: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\` to prevent the selector from firing until the correct \`Action\` is dispatched.`,
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
      [messageId]: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\`.`,
    },
  },
  defaultOptions: [defaultOptions],
  create: (context, [{ strict }]) => {
    const actionsName = findNgRxEffectActionsName(context)
    if (!actionsName) return {}

    const sourceCode = context.getSourceCode()
    const selector = strict
      ? (`${createEffectExpression} CallExpression > Identifier[name='withLatestFrom']` as const)
      : (`${createEffectExpression} ${storeExpression(
          actionsName,
        )} > CallExpression[arguments.length=1] > Identifier[name='${withLatestFromKeyword}']` as const)

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
    fixer.replaceText(node, concatLatestFromKeyword),
    ...(isArrowFunctionExpression(firstArgument)
      ? []
      : [fixer.insertTextBefore(firstArgument, '() => ')]),
  ].concat(
    getImportAddFix({
      fixer,
      importName: concatLatestFromKeyword,
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
