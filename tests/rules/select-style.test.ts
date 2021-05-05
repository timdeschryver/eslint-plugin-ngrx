import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  METHOD,
  OPERATOR,
  operatorSelectMessageId,
  methodSelectMessageId,
} from '../../src/rules/store/select-style'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.store.select(selector);
      constructor(private store: Store){}
    }
    `,
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      foo$ = this.customName.select(selector);
      constructor(private customName: Store){}
    }
    `,
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selector));
        constructor(private store: Store){}
      }
      `,
      options: [{ mode: OPERATOR }],
    },
    {
      code: `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selector);
        constructor(private store: Store){}
      }
      `,
      options: [{ mode: METHOD }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { select, Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector));
                                 ~~~~~~~~~~~~~~~~   [${methodSelectMessageId}]

          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector));
                                 ~~~~~~~~~~~~~~~~   [${methodSelectMessageId}]

          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store, select } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$;

          constructor(private store: Store){
            this.foo$ = store.pipe(select(selector));
                                   ~~~~~~~~~~~~~~~~   [${methodSelectMessageId}]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.pipe(select(selector));
                                 ~~~~~~~~~~~~~~~~   [${methodSelectMessageId}]

          constructor(private store: Store){}
        }
      `,
      {
        options: [{ mode: METHOD }],
      },
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          foo$ = this.store.select(selector);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~       [${operatorSelectMessageId}]
          constructor(private store: Store){}
        }

      `,
      {
        options: [{ mode: OPERATOR }],
      },
    ),
  ],
})
