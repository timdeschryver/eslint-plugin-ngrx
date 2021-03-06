import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  createEffectExpression,
  MODULE_PATHS,
  getConditionalImportFix,
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
          messageId,
          node,
          suggest: [
            {
              messageId: messageIdSuggest,
              fix: (fixer) => {
                return [
                  fixer.replaceText(node, 'concatLatestFrom'),
                  ...getConditionalImportFix(
                    fixer,
                    node,
                    'concatLatestFrom',
                    MODULE_PATHS.effects,
                  ),
                ]
              },
            },
          ],
        })
      },
    }
  },
})
