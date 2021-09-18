import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  preferOneGenericInCreateForFeatureSelector,
  preferOneGenericInCreateForFeatureSelectorSuggest,
} from '../../src/rules/store/prefer-one-generic-in-create-for-feature-selector'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `const createFeatureSelector = test('feature-state')`,
    `const featureOk = createFeatureSelector('feature-state')`,
    `const featureOk1 = createFeatureSelector<FeatureState>('feature-state')`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        const featureNotOk = createFeatureSelector<GlobalState, FeatureState>('feature-state')
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector}]
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
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector}]
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
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector}]
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
  ],
})
