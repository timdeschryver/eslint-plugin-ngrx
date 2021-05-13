import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/use-consistent-global-store-name'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}
      }
      `,
    },
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        constructor(private customName: Store){}
      }
      `,
      options: ['customName'],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          constructor(private somethingElse: Store){}
                              ~~~~~~~~~~~~~   [${messageId} { "storeName": "store" }]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          constructor(private store: Store){}
                              ~~~~~   [${messageId} { "storeName": "customName" }]
        }
      `,
      {
        options: ['customName'],
      },
    ),
  ],
})
