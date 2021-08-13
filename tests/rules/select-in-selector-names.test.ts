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
        @NgModule({
          imports: [
            StoreModule.forRoot({
              feeReducer,
              ~~~~~~~~~~                        [${messageId}]
              fieReducer: fie,
              ~~~~~~~~~~                        [${messageId}]
              'fooReducer': foo,
              ~~~~~~~~~~~~                      [${messageId}]
              FoeReducer: FoeReducer,
              ~~~~~~~~~~                        [${messageId}]
            }),
          ],
        })
        export class AppModule {}`,
    ),
    fromFixture(
      stripIndent`
        @NgModule({
          imports: [
            StoreModule.forFeature({
              feeReducer,
              ~~~~~~~~~~                        [${messageId}]
              fieReducer: fie,
              ~~~~~~~~~~                        [${messageId}]
              'fooReducer': foo,
              ~~~~~~~~~~~~                      [${messageId}]
              FoeReducer: FoeReducer,
              ~~~~~~~~~~                        [${messageId}]
            }),
          ],
        })
        export class AppModule {}`,
    ),
    fromFixture(
      stripIndent`
        export const reducers: ActionReducerMap<AppState> = {
          feeReducer,
          ~~~~~~~~~~                          [${messageId}]
          fieReducer: fie,
          ~~~~~~~~~~                          [${messageId}]
          'fooReducer': foo,
          ~~~~~~~~~~~~                        [${messageId}]
          FoeReducer: fromFoe.reducer,
          ~~~~~~~~~~                          [${messageId}]
        };`,
    ),
  ],
})
