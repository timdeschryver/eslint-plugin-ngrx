import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, typedStore } from '../../utils'

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
      description: 'The global store should not be typed.',
      recommended: 'warn',
      suggestion: true,
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
