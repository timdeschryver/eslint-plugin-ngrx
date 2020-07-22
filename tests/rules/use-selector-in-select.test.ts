import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/use-selector-in-select'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
      export class Component {
        view$ = this.store.pipe(select(selectCustomers))
        constructor(store: Store){}
      }`,
    stripIndent`
      export class Component {
        view$ = this.store.select(selectCustomers)
        constructor(store: Store){}
      }`,
    stripIndent`
      export class Component {
        view$ = this.store.pipe(select(selectorsObj.selectCustomers))
        constructor(store: Store){}
      }`,
    stripIndent`
      export class Component {
        view$ = this.store.select(selectorsObj.selectCustomers)
        constructor(store: Store){}
      }`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/41
    stripIndent`
      export class Component {
        view$ = this.store.pipe(select(selectQueryParam('parameter')))
        constructor(store: Store){}
      }`,
  ],
  invalid: [
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.pipe(select('customers'))
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 34,
          endLine: 2,
          endColumn: 45,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.select('customers')
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 29,
          endLine: 2,
          endColumn: 40,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.pipe(select('customers', 'orders'))
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 34,
          endLine: 2,
          endColumn: 45,
        },
        {
          messageId,
          line: 2,
          column: 47,
          endLine: 2,
          endColumn: 55,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.select('customers', 'orders')
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 29,
          endLine: 2,
          endColumn: 40,
        },
        {
          messageId,
          line: 2,
          column: 42,
          endLine: 2,
          endColumn: 50,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.pipe(select(s => s.customers))
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 34,
          endLine: 2,
          endColumn: 50,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store.select(s => s.customers)
          constructor(store: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 29,
          endLine: 2,
          endColumn: 45,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store$.select(s => s.customers)
          constructor(store$: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 46,
        },
      ],
    },
    {
      code: stripIndent`
        export class Component {
          view$ = this.store$.pipe(select('customers'))
          constructor(store$: Store){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 35,
          endLine: 2,
          endColumn: 46,
        },
      ],
    },
  ],
})
