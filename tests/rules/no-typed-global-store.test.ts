import { stripIndent } from 'common-tags'
import path from 'path'
import rule, {
  noTypedStore,
  noTypedStoreSuggest,
} from '../../src/rules/store/no-typed-global-store'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    stripIndent`
    export class Ok {
      constructor(store: Store) {}
    }`,
  ],
  invalid: [
    {
      code: stripIndent`
      export class NotOk1 {
        constructor(store: Store<PersonsState>) {}
      }`,
      errors: [
        {
          column: 27,
          endColumn: 41,
          line: 2,
          messageId: noTypedStore,
          suggestions: [
            {
              messageId: noTypedStoreSuggest,
              output: stripIndent`
              export class NotOk1 {
                constructor(store: Store) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk2 {
        constructor(cdr: ChangeDetectionRef, private store: Store<CustomersState>) {}
      }`,
      errors: [
        {
          column: 60,
          endColumn: 76,
          line: 2,
          messageId: noTypedStore,
          suggestions: [
            {
              messageId: noTypedStoreSuggest,
              output: stripIndent`
              export class NotOk2 {
                constructor(cdr: ChangeDetectionRef, private store: Store) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk3 {
        constructor(private store: Store<any>, private personsService: PersonsService) {}
      }`,
      errors: [
        {
          column: 35,
          endColumn: 40,
          line: 2,
          messageId: noTypedStore,
          suggestions: [
            {
              messageId: noTypedStoreSuggest,
              output: stripIndent`
              export class NotOk3 {
                constructor(private store: Store, private personsService: PersonsService) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk4 {
        constructor(store: Store<{}>) {}
      }`,
      errors: [
        {
          column: 27,
          endColumn: 31,
          line: 2,
          messageId: noTypedStore,
          suggestions: [
            {
              messageId: noTypedStoreSuggest,
              output: stripIndent`
              export class NotOk4 {
                constructor(store: Store) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk5 {
        constructor(store: Store<object>) {}
      }`,
      errors: [
        {
          column: 27,
          endColumn: 35,
          line: 2,
          messageId: noTypedStore,
          suggestions: [
            {
              messageId: noTypedStoreSuggest,
              output: stripIndent`
              export class NotOk5 {
                constructor(store: Store) {}
              }`,
            },
          ],
        },
      ],
    },
  ],
})
