import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/use-selector-in-select'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    stripIndent`
      import { Store } from '@ngrx/store'
      export class Component {
        view$ = this.store.pipe(select(selectCustomers))
        constructor(store: Store){}
      }`,
    stripIndent`
      import { Store } from '@ngrx/store'
      export class Component {
        view$ = this.store.select(selectCustomers)
        constructor(store: Store){}
      }`,
    stripIndent`
      import { Store } from '@ngrx/store'
      export class Component {
        view$ = this.store.pipe(select(selectorsObj.selectCustomers))
        constructor(store: Store){}
      }`,
    stripIndent`
      import { Store } from '@ngrx/store'
      export class Component {
        view$ = this.store.select(selectorsObj.selectCustomers)
        constructor(store: Store){}
      }`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/41
    stripIndent`
      import { Store } from '@ngrx/store'
      export class Component {
        view$ = this.store.pipe(select(selectQueryParam('parameter')))
        constructor(store: Store){}
      }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.pipe(select('customers'))
                                         ~~~~~~~~~~~  [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.select('customers')
                                    ~~~~~~~~~~~  [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.pipe(select('customers', 'orders'))
                                         ~~~~~~~~~~~            [${messageId}]
                                                      ~~~~~~~~  [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.select('customers', 'orders')
                                    ~~~~~~~~~~~               [${messageId}]
                                                 ~~~~~~~~     [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.pipe(select(s => s.customers))
                                         ~~~~~~~~~~~~~~~~  [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store.select(s => s.customers)
                                    ~~~~~~~~~~~~~~~~  [${messageId}]
          constructor(store: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store$.select(s => s.customers)
                                     ~~~~~~~~~~~~~~~~  [${messageId}]
          constructor(store$: Store){}
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        export class Component {
          view$ = this.store$.pipe(select('customers'))
                                          ~~~~~~~~~~~  [${messageId}]
          constructor(store$: Store){}
        }`,
    ),
  ],
})
