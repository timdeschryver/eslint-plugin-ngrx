import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/no-reducer-in-key-names'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    @NgModule({
      imports: [
        StoreModule.forRoot({
          foo,
          persons: personsReducer,
          'people': peopleReducer,
        }),
      ],
    })
    export class AppModule {}`,
    `
    @NgModule({
      imports: [
        StoreModule.forFeature({
          foo,
          persons: personsReducer,
          'people': peopleReducer,
        }),
      ],
    })
    export class AppModule {}`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/91
    `
    @NgModule({
      imports: [
        StoreModule.forRoot(reducers, {metaReducers}),
      ],
    })
    export class AppModule {}`,
    `
    export const reducers: ActionReducerMap<AppState> = {
      foo,
      persons: personsReducer,
      'people': peopleReducer,
    };`,
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
              ['FoeReducer']: FoeReducer,
               ~~~~~~~~~~~~                     [${messageId}]
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
          [\`FoeReducer\`]: fromFoe.reducer,
           ~~~~~~~~~~~~                       [${messageId}]
        };`,
    ),
  ],
})
