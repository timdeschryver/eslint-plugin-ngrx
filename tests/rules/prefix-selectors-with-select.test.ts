import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/prefix-selectors-with-select'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    export const selectFeature:MemoizedSelector<any, any> = (state: AppState) => state.feature`,
    `
    export const selectFeature = createSelector((state: AppState) => state.feature)`,
    `
    export const selectFeature = createFeatureSelector<FeatureState>(featureKey);`,
    `
    export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey);`,
    `
    export const selectFeature = createSelector((state, props) => state.counter[props.id])`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export const getFeature: MemoizedSelector<any, any> = (state: AppState) => state.feature
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[${messageId}]`,
    ),
    fromFixture(
      stripIndent`
        export const getFeature = createSelector((state: AppState) => state.feature)
                     ~~~~~~~~~~                        [${messageId}]`,
    ),
    fromFixture(
      stripIndent`
      export const feature = createFeatureSelector<AppState, FeatureState>(featureKey);
                   ~~~~~~~                            [${messageId}]`,
    ),
    fromFixture(
      stripIndent`
        export const selectfeature = createSelector((state: AppState) => state.feature)
                     ~~~~~~~~~~~~~                    [${messageId}]`,
    ),
    fromFixture(
      stripIndent`
      const getCount = createSelector((state, props) => state * props.multiply)
            ~~~~~~~~                                  [${messageId}]`,
    ),
  ],
})
