import { stripIndent } from 'common-tags'
import path from 'path'
import rule, {
  noReducerInKeyNames,
  noReducerInKeyNamesSuggest,
} from '../../src/rules/store/no-reducer-in-key-names'
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
    {
      code: stripIndent`
        @NgModule({
          imports: [
            StoreModule.forRoot({
              feeReducer,
            }),
          ],
        })
        export class AppModule {}`,
      errors: [
        {
          column: 7,
          endColumn: 17,
          line: 4,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                @NgModule({
                  imports: [
                    StoreModule.forRoot({
                      fee,
                    }),
                  ],
                })
                export class AppModule {}`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
        @NgModule({
          imports: [
            StoreModule.forFeature({
              'fooReducer': foo,
              FoeReducer: FoeReducer,
            }),
          ],
        })
        export class AppModule {}`,
      errors: [
        {
          column: 7,
          endColumn: 19,
          line: 4,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                @NgModule({
                  imports: [
                    StoreModule.forFeature({
                      'foo': foo,
                      FoeReducer: FoeReducer,
                    }),
                  ],
                })
                export class AppModule {}`,
            },
          ],
        },
        {
          column: 7,
          endColumn: 17,
          line: 5,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                @NgModule({
                  imports: [
                    StoreModule.forFeature({
                      'fooReducer': foo,
                      Foe: FoeReducer,
                    }),
                  ],
                })
                export class AppModule {}`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
        export const reducers: ActionReducerMap<AppState> = {
          feeReducer,
          'fieReducer': fie,
          ['fooReducerName']: foo,
          [\`ReducerFoe\`]: FoeReducer,
        };`,
      errors: [
        {
          column: 3,
          endColumn: 13,
          line: 2,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                export const reducers: ActionReducerMap<AppState> = {
                  fee,
                  'fieReducer': fie,
                  ['fooReducerName']: foo,
                  [\`ReducerFoe\`]: FoeReducer,
                };`,
            },
          ],
        },
        {
          column: 3,
          endColumn: 15,
          line: 3,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                export const reducers: ActionReducerMap<AppState> = {
                  feeReducer,
                  'fie': fie,
                  ['fooReducerName']: foo,
                  [\`ReducerFoe\`]: FoeReducer,
                };`,
            },
          ],
        },
        {
          column: 4,
          endColumn: 20,
          line: 4,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                export const reducers: ActionReducerMap<AppState> = {
                  feeReducer,
                  'fieReducer': fie,
                  ['fooName']: foo,
                  [\`ReducerFoe\`]: FoeReducer,
                };`,
            },
          ],
        },
        {
          column: 4,
          endColumn: 16,
          line: 5,
          messageId: noReducerInKeyNames,
          suggestions: [
            {
              messageId: noReducerInKeyNamesSuggest,
              output: stripIndent`
                export const reducers: ActionReducerMap<AppState> = {
                  feeReducer,
                  'fieReducer': fie,
                  ['fooReducerName']: foo,
                  [\`Foe\`]: FoeReducer,
                };`,
            },
          ],
        },
      ],
    },
  ],
})
