import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  prefixSelectorsWithSelect,
  prefixSelectorsWithSelectSuggest,
} from '../../src/rules/store/prefix-selectors-with-select'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: () => RunTests['valid'] = () => [
  `
    export const selectFeature: MemoizedSelector<any, any> = (state: AppState) => state.feature`,
  `
    export const selectFeature: MemoizedSelectorWithProps<any, any> = ({ feature }) => feature`,
  `
    export const selectFeature = createSelector((state: AppState) => state.feature)`,
  `
    export const selectFeature = createFeatureSelector<FeatureState>(featureKey)`,
  `
    export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey)`,
  `
    export const selectThing = (id: string) => createSelector(selectThings, things => things[id])`,
  `
    export const selectFeature = createSelectorFactory(factoryFn)`,
  `
    export const select_feature = createSelectorFactory(factoryFn)`,
  `
    export const select$feature = createSelectorFactory(factoryFn)`,
  `
    export const selectF01 = createSelector(factoryFn)`,
]

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    stripIndent`
      export const getCount: MemoizedSelector<any, any> = (state: AppState) => state.feature
                   ~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectCount',
          },
          output: stripIndent`
            export const selectCount: MemoizedSelector<any, any> = (state: AppState) => state.feature`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const getF01 = createSelector((state: AppState) => state.feature)
                   ~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          output: stripIndent`
            export const selectF01 = createSelector((state: AppState) => state.feature)`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const get_f01 = createSelector((state: AppState) => state.feature)
                   ~~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          output: stripIndent`
            export const select_f01 = createSelector((state: AppState) => state.feature)`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const select = (id: string) => createSelector(selectThings, things => things[id])
                   ~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          data: {
            name: 'selectSelect',
          },
          messageId: prefixSelectorsWithSelectSuggest,
          output: stripIndent`
            export const selectSelect = (id: string) => createSelector(selectThings, things => things[id])`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const SELECT_TEST = (id: string) => {
                   ~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
        return createSelector(selectThings, things => things[id])
      }`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectSELECT_TEST',
          },
          output: stripIndent`
            export const selectSELECT_TEST = (id: string) => {
              return createSelector(selectThings, things => things[id])
            }`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const feature = createFeatureSelector<AppState, FeatureState>(featureKey)
                   ~~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectFeature',
          },
          output: stripIndent`
            export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey)`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const selectfeature = createSelector((state: AppState) => state.feature)
                   ~~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
      `,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectFeature',
          },
          output: stripIndent`
            export const selectFeature = createSelector((state: AppState) => state.feature)`,
        },
      ],
    },
  ),
  fromFixture(
    stripIndent`
      export const createSelect = createSelectorFactory((projectionFun) =>
                   ~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
        defaultMemoize(
          projectionFun,
          orderDoesNotMatterComparer,
          orderDoesNotMatterComparer,
        ),
      )`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectCreateSelect',
          },
          output: stripIndent`
            export const selectCreateSelect = createSelectorFactory((projectionFun) =>
              defaultMemoize(
                projectionFun,
                orderDoesNotMatterComparer,
                orderDoesNotMatterComparer,
              ),
            )`,
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
