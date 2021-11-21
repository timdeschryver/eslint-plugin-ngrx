import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  preferOneGenericInCreateForFeatureSelector,
  preferOneGenericInCreateForFeatureSelectorSuggest,
} from '../../src/rules/store/prefer-one-generic-in-create-for-feature-selector'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: () => RunTests['valid'] = () => [
  `const createFeatureSelector = test('feature-state')`,
  `const featureOk = createFeatureSelector('feature-state')`,
  `const featureOk1 = createFeatureSelector<FeatureState>('feature-state')`,
]

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    stripIndent`
        const featureNotOk = createFeatureSelector<GlobalState, FeatureState>('feature-state')
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]
      `,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: stripIndent`
              const featureNotOk = createFeatureSelector< FeatureState>('feature-state')
            `,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      const featureNotOk1 = createFeatureSelector<AppState, readonly string[]>('feature-state')
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]
    `,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: stripIndent`
            const featureNotOk1 = createFeatureSelector< readonly string[]>('feature-state')
          `,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
        const featureNotOk2 = createFeatureSelector<GlobalState  , StateA & StateB>('feature-state')
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]
      `,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: stripIndent`
              const featureNotOk2 = createFeatureSelector< StateA & StateB>('feature-state')
            `,
        },
      ],
    },
  ),
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, {
    valid: valid(),
    invalid: invalid(),
  })
})
test.run()
