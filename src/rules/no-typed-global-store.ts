import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { typedStore, docsUrl } from '../utils'

export const messageId = 'noTypedStore'
export const noTypedStoreSuggest = 'noTypedStoreSuggest'
export type MessageIds = typeof messageId | typeof noTypedStoreSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Store should not be typed',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        'Store should not be typed, use `Store` (without generic) instead.',
      [noTypedStoreSuggest]: 'Remove generic from `Store`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [typedStore]({
        typeParameters,
      }: TSESTree.TSTypeReference & {
        typeParameters: TSESTree.TSTypeParameterInstantiation
      }) {
        context.report({
          // TODO: Turn it into a fix once https://github.com/ngrx/platform/issues/2780 is fixed.
          suggest: [
            {
              fix: (fixer) => fixer.remove(typeParameters),
              messageId: noTypedStoreSuggest,
            },
          ],
          node: typeParameters,
          messageId,
        })
      },
    }
  },
})
