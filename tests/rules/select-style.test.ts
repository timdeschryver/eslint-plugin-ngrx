import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  METHOD,
  methodSelectMessageId,
  OPERATOR,
  operatorSelectMessageId,
} from '../../src/rules/store/select-style'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.store.select(selector)
      constructor(private store: Store) {}
    }
    `,
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.customName.select(selector)
      constructor(private customName: Store) {}
    }
    `,
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selector))
        constructor(private store: Store) {}
      }
      `,
      options: [OPERATOR],
    },
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selector)
        constructor(private store: Store) {}
      }
      `,
      options: [METHOD],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { select, Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector))
                                 ~~~~~~ [${methodSelectMessageId}]
          constructor(private store: Store) {}
        }
      `,
      {
        output: stripIndent`
          import { select, Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.select(selector)
            constructor(private store: Store) {}
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector, selector2), filter(Boolean))
                                 ~~~~~~ [${methodSelectMessageId}]
          constructor(private store: Store) {}
        }
      `,
      {
        options: [METHOD],
        output: stripIndent`
          import { Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.select(selector, selector2).pipe( filter(Boolean))
            constructor(private store: Store) {}
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import { select, Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$
          constructor(private store: Store) {
            this.foo$ = store.select(selector)
                              ~~~~~~ [${operatorSelectMessageId}]
          }
        }
      `,
      {
        options: [OPERATOR],
        output: stripIndent`
          import { select, Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$
            constructor(private store: Store) {
              this.foo$ = store.pipe(select(selector))
            }
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                                 ~~~~~~ [${methodSelectMessageId}]
          constructor(private store: Store) {}
        }
      `,
      {
        options: [METHOD],
        output: stripIndent`
          import { Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
            constructor(private store: Store) {}
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import type {Creator} from '@ngrx/store'
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.select(selector)
                            ~~~~~~ [${operatorSelectMessageId}]
          constructor(private store: Store) {}
        }
      `,
      {
        options: [OPERATOR],
        output: stripIndent`
          import type {Creator} from '@ngrx/store'
          import { Store, select } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.pipe(select(selector))
            constructor(private store: Store) {}
          }
        `,
      },
    ),
  ],
})
