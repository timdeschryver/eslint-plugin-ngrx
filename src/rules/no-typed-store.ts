import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { typedStore, docsUrl } from '../utils'

export const ruleName = 'no-typed-store'

export const messageId = 'noTypedStore'
export const noTypedStoreSuggest = 'noTypedStoreSuggest'
export type MessageIds = typeof messageId | typeof noTypedStoreSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'Store should not be typed',
      recommended: 'error',
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
