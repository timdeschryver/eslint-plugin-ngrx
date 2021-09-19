import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  methodSelectMessageId,
  operatorSelectMessageId,
  SelectStyle,
} from '../../src/rules/store/select-style'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      constructor(private store: Store) {}
    }
    `,
    `
    import { Store, select } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      constructor(private store: Store) {}
    }
    `,
    `
    import { Store, select } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = select(selector)
      constructor(private store: Store) {}
    }
    `,
    `
    import { select } from '@my-org/framework'
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.store.pipe(select(selector))
      constructor(private store: Store) {}
    }
    `,
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
      foo$ = this.store.select(selector)
      constructor(private store: Store) {}
    }
    `,
    `
    import { Store, select } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.customName.select(selector)
      constructor(private customName: Store) {}
    }
    `,
    {
      code: `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selector))
        constructor(private store: Store) {}
      }
      `,
      options: [SelectStyle.Operator],
    },
    {
      code: `
      import { select, Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selector)
        constructor(private store: Store) {}
      }
      `,
      options: [SelectStyle.Method],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { select, Store } from '@ngrx/store'
                 ~~~~~~ [${methodSelectMessageId}]
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe( select(selector), )
                                  ~~~~~~ [${methodSelectMessageId}]
          constructor(private store: Store) {}
        }
      `,
      {
        output: stripIndent`
          import {  Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store. select((selector), )
            constructor(private store: Store) {}
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import { Store, select } from '@ngrx/store'
                        ~~~~~~ [${methodSelectMessageId}]
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe  (select
                                   ~~~~~~ [${methodSelectMessageId}]
            (selector, selector2), filter(Boolean))

          constructor(private store: Store) {}
        }
      `,
      {
        options: [SelectStyle.Method],
        output: stripIndent`
          import { Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.select
              (selector, selector2).pipe  ( filter(Boolean))

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
            this.foo$ = store.select(
                              ~~~~~~ [${operatorSelectMessageId}]
              selector,
            )
          }
        }
      `,
      {
        options: [SelectStyle.Operator] as const,
        output: stripIndent`
          import { select, Store } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$
            constructor(private store: Store) {
              this.foo$ = store.pipe(select(
                selector,
              ))
            }
          }
        `,
      },
    ),
    fromFixture(
      stripIndent`
        import {
          Store,
          select,
          ~~~~~~ [${methodSelectMessageId}]
        } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                                 ~~~~~~ [${methodSelectMessageId}]
          bar$ = this.store.
            select(selector).pipe()
          baz$ = this.store.pipe(
            select(({customers}) => customers), map(toItem),
            ~~~~~~ [${methodSelectMessageId}]
          ).pipe()
          constructor(private store: Store) {}
        }

        @Component()
        export class FixtureComponent2 {
          foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                                 ~~~~~~ [${methodSelectMessageId}]
          constructor(private readonly store: Store) {}
        }
      `,
      {
        options: [SelectStyle.Method],
        output: stripIndent`
          import {
            Store,
          } from '@ngrx/store'
          @Component()
          export class FixtureComponent {
            foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
            bar$ = this.store.
              select(selector).pipe()
            baz$ = this.store.select(({customers}) => customers).pipe(
               map(toItem),
            ).pipe()
            constructor(private store: Store) {}
          }

          @Component()
          export class FixtureComponent2 {
            foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
            constructor(private readonly store: Store) {}
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
        options: [SelectStyle.Operator],
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
