import { stripIndents } from 'common-tags'
import path from 'path'
import rule, {
  noMultipleGlobalStores,
  noMultipleGlobalStoresSuggest,
} from '../../src/rules/store/no-multiple-global-stores'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `export class NoCtorOK {}`,
    `
    export class EmptyOk {
      constructor() {}
    }`,
    `
    export class OneWithVisibilityOk {
      constructor(private store: Store) {}
    }`,
    `
    export class OneWithoutVisibilityOk {
      constructor(store: Store) {}
    }`,
    `
    export class OnePlusExtraOk {
      constructor(private store: Store, data: Service) {}
    }`,
  ],
  invalid: [
    {
      code: stripIndents`
        export class NotOk1 {
          constructor(store: Store, store2: Store) {}
        }`,
      errors: [
        {
          column: 13,
          endColumn: 25,
          line: 2,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk1 {
                constructor( store2: Store) {}
              }`,
            },
          ],
        },
        {
          column: 27,
          endColumn: 40,
          line: 2,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk1 {
                constructor(store: Store, ) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndents`
        export class NotOk2 {
          constructor(store: Store /* first store */, private readonly actions$: Actions, private store2: Store, b: B) {}
        }`,
      errors: [
        {
          column: 13,
          endColumn: 25,
          line: 2,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk2 {
                constructor( /* first store */ private readonly actions$: Actions, private store2: Store, b: B) {}
              }`,
            },
          ],
        },
        {
          column: 89,
          endColumn: 102,
          line: 2,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk2 {
                constructor(store: Store /* first store */, private readonly actions$: Actions,  b: B) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndents`
        export class NotOk3 {
          constructor(
            a: A,
            store: Store,// a comment
            private readonly actions$: Actions,
            private store2: Store,
            private readonly store3: Store,
          ) {}
        }`,
      errors: [
        {
          column: 1,
          endColumn: 13,
          line: 4,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk3 {
                constructor(
                  a: A,
                  // a comment
                  private readonly actions$: Actions,
                  private store2: Store,
                  private readonly store3: Store,
                ) {}
              }`,
            },
          ],
        },
        {
          column: 9,
          endColumn: 22,
          line: 6,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk3 {
                constructor(
                  a: A,
                  store: Store,// a comment
                  private readonly actions$: Actions,

                  private readonly store3: Store,
                ) {}
              }`,
            },
          ],
        },
        {
          column: 18,
          endColumn: 31,
          line: 7,
          messageId: noMultipleGlobalStores,
          suggestions: [
            {
              messageId: noMultipleGlobalStoresSuggest,
              output: stripIndents`
              export class NotOk3 {
                constructor(
                  a: A,
                  store: Store,// a comment
                  private readonly actions$: Actions,
                  private store2: Store,

                ) {}
              }`,
            },
          ],
        },
      ],
    },
  ],
})
