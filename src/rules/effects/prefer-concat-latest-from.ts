import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  createEffectExpression,
  docsUrl,
  getImportAddFix,
  MODULE_PATHS,
} from '../../utils'

export const messageId = 'preferConcatLatestFrom'
export const messageIdSuggest = 'preferConcatLatestFromSuggest'
export type MessageIds = typeof messageId | typeof messageIdSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Possible Errors',
      description:
        'Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct action is dispatched.',
      recommended: 'warn',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]: 'Use `concatLatestFrom` instead of `withLatestFrom`',
      [messageIdSuggest]: 'Replace `withLatestFrom` with `concatLatestFrom`',
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
                    importedName: 'concatLatestFrom',
                    moduleName: MODULE_PATHS.effects,
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
