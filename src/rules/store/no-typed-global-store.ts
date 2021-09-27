import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, typedStore } from '../../utils'

export const noTypedStore = 'noTypedStore'
export const noTypedStoreSuggest = 'noTypedStoreSuggest'
export type MessageIds = typeof noTypedStore | typeof noTypedStoreSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'The global store should not be typed.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noTypedStore]:
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
          node: typeParameters,
          messageId: noTypedStore,
          suggest: [
            {
              messageId: noTypedStoreSuggest,
              fix: (fixer) => fixer.remove(typeParameters),
            },
          ],
        })
      },
    }
  },
})
