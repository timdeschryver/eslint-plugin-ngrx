import type { TSESTree } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createRule } from '../../rule-creator'
import {
  createEffectExpression,
  getImportAddFix,
  NGRX_MODULE_PATHS,
} from '../../utils'

export const messageId = 'preferConcatLatestFrom'
export const messageIdSuggest = 'preferConcatLatestFromSuggest'
export type MessageIds = typeof messageId | typeof messageIdSuggest

type Options = []

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
      suggestion: true,
    },
    schema: [],
    messages: {
      [messageId]: 'Use `concatLatestFrom` instead of `withLatestFrom`.',
      [messageIdSuggest]: 'Replace `withLatestFrom` with `concatLatestFrom`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`${createEffectExpression} > [body] > [arguments] > CallExpression > Identifier[name='withLatestFrom']`](
        node: TSESTree.Identifier,
      ) {
        context.report({
          node,
          messageId,
          suggest: [
            {
              messageId: messageIdSuggest,
              fix: (fixer) => {
                return [fixer.replaceText(node, 'concatLatestFrom')].concat(
                  getImportAddFix({
                    fixer,
                    importName: 'concatLatestFrom',
                    moduleName: NGRX_MODULE_PATHS.effects,
                    node,
                  }),
                )
              },
            },
          ],
        })
      },
    }
  },
})
