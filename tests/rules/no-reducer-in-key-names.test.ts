import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-reducer-in-key-names'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
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
              fieReducer: fie,
              'fooReducer': foo,
              FoeReducer: FoeReducer,
            }),
          ],
        })
        export class AppModule {}`,
      errors: [
        {
          messageId,
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 17,
        },
        {
          messageId,
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 17,
        },
        {
          messageId,
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 19,
        },
        {
          messageId,
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 17,
        },
      ],
    },
    {
      code: stripIndent`
        @NgModule({
          imports: [
            StoreModule.forFeature({
              feeReducer,
              fieReducer: fie,
              'fooReducer': foo,
              FoeReducer: FoeReducer,
            }),
          ],
        })
        export class AppModule {}`,
      errors: [
        {
          messageId,
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 17,
        },
        {
          messageId,
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 17,
        },
        {
          messageId,
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 19,
        },
        {
          messageId,
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 17,
        },
      ],
    },
    {
      code: stripIndent`
        export const reducers: ActionReducerMap<AppState> = {
          feeReducer,
          fieReducer: fie,
          'fooReducer': foo,
          FoeReducer: fromFoe.reducer,
        };`,
      errors: [
        {
          messageId,
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 13,
        },
        {
          messageId,
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 13,
        },
        {
          messageId,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 15,
        },
        {
          messageId,
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 13,
        },
      ],
    },
  ],
})
