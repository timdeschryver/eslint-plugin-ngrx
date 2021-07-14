import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  MessageIds,
  preferOneGenericInCreateForFeatureSelector,
  preferOneGenericInCreateForFeatureSelectorSuggest,
} from '../../src/rules/store/prefer-one-generic-in-create-for-feature-selector'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `const featureA = createFeatureSelector<FeatureState>('feature-state')`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        const featureA = createFeatureSelector<GlobalState, FeatureState>('feature-state')
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector}]
      `,
    ),
    {
      code: stripIndent`
        const featureA = createFeatureSelector<GlobalState, FeatureState>('feature-state')
      `,
      errors: [
        {
          messageId: preferOneGenericInCreateForFeatureSelector,
          suggestions: [
            {
              messageId: preferOneGenericInCreateForFeatureSelectorSuggest as MessageIds,
              output: stripIndent`
                const featureA = createFeatureSelector<FeatureState>('feature-state')
              `,
            },
          ],
        },
      ],
    },
  ],
})
