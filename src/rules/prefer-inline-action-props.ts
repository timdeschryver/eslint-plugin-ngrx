import path from 'path'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import type { TSESTree } from '@typescript-eslint/experimental-utils'

import { actionCreatorPropsComputed, docsUrl } from '../utils'

export const preferInlineActionProps = 'preferInlineActionProps'
export const preferInlineActionPropsSuggest = 'preferInlineActionPropsSuggest'
export type MessageIds =
  | typeof preferInlineActionProps
  | typeof preferInlineActionPropsSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Prefer using inline types instead of interfaces/classes.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [preferInlineActionProps]:
        'Prefer using inline types instead of interfaces/classes',
      [preferInlineActionPropsSuggest]: 'Change to inline types',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [actionCreatorPropsComputed](node: TSESTree.TSTypeReference) {
        context.report({
          suggest: [
            {
              fix: (fixer) => [
                fixer.insertTextBefore(node, '{name: '),
                fixer.insertTextAfter(node, '}'),
              ],
              messageId: preferInlineActionPropsSuggest,
            },
          ],
          node,
          messageId: preferInlineActionProps,
        })
      },
    }
  },
})
