import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl, isIdentifier, isTSTypeReference } from '../../utils'

export const preferOneGenericInCreateForFeatureSelector =
  'preferOneGenericInCreateForFeatureSelector'
export const preferOneGenericInCreateForFeatureSelectorSuggest =
  'preferOneGenericInCreateForFeatureSelectorSuggest'
export type MessageIds =
  | typeof preferOneGenericInCreateForFeatureSelector
  | typeof preferOneGenericInCreateForFeatureSelectorSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Prefer using a single generic to define the feature state.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [preferOneGenericInCreateForFeatureSelector]:
        'Prefer using a single generic to define the feature state',
      [preferOneGenericInCreateForFeatureSelectorSuggest]:
        'Remove global state generic',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name='createFeatureSelector'] TSTypeParameterInstantiation[params.length>1]`](
        node: TSESTree.TSTypeParameterInstantiation,
      ) {
        context.report({
          node,
          messageId: preferOneGenericInCreateForFeatureSelector,
          suggest: [
            {
              fix: (fixer) => {
                const [, featureState] = node.params
                if (
                  isTSTypeReference(featureState) &&
                  isIdentifier(featureState.typeName)
                ) {
                  return fixer.replaceText(
                    node,
                    `<${featureState.typeName.name}>`,
                  )
                }
                return []
              },
              messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
            },
          ],
        })
      },
    }
  },
})
