import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/select-in-selector-names'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    interface AppState {
      feature: FeatureState;
    }

    export const selectFeature:MemoizedSelector<any, any> = (state: AppState) => state.feature`,
    `
    interface AppState {
      feature: FeatureState;
    }

    export const selectFeature = createSelector((state: AppState) => state.feature)`,
    `
   export const featureKey = 'feature';
 
    export interface FeatureState {
      counter: number;
    }

    export interface AppState {
      feature: FeatureState;
    }

    export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey);`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        interface AppState {
          feature: FeatureState;
        }

        export const getFeature: MemoizedSelector<any, any> = (state: AppState) => state.feature
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[${messageId}]`,
    ),
    fromFixture(
      stripIndent`
        interface AppState {
          feature: FeatureState;
        }

        export const getFeature = createSelector((state: AppState) => state.feature)
                     ~~~~~~~~~~                        [${messageId}]`,
    ),
  ],
})
