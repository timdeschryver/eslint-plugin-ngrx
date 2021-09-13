import { stripIndents } from 'common-tags'
import path from 'path'
import rule, {
  useConsistentGlobalStoreName,
  useConsistentGlobalStoreNameSuggest,
} from '../../src/rules/store/use-consistent-global-store-name'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private store: Store) {}
      }
      `,
    },
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private customName: Store) {}
      }
      `,
      options: ['customName'],
    },
  ],
  invalid: [
    {
      code: stripIndents`
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private readonly somethingElse$: Store) {}
      }
      `,
      errors: [
        {
          column: 30,
          endColumn: 44,
          line: 4,
          messageId: useConsistentGlobalStoreName,
          data: {
            storeName: 'store',
          },
          suggestions: [
            {
              messageId: useConsistentGlobalStoreNameSuggest,
              output: stripIndents`
              import { Store } from '@ngrx/store'
              @Component()
              export class FixtureComponent {
                constructor(private readonly store: Store) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndents`
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private store: Store) {}
      }
      `,
      options: ['customName'],
      errors: [
        {
          column: 21,
          endColumn: 26,
          line: 4,
          messageId: useConsistentGlobalStoreName,
          data: {
            storeName: 'customName',
          },
          suggestions: [
            {
              messageId: useConsistentGlobalStoreNameSuggest,
              output: stripIndents`
              import { Store } from '@ngrx/store'
              @Component()
              export class FixtureComponent {
                constructor(private customName: Store) {}
              }`,
            },
          ],
        },
      ],
    },
  ],
})
