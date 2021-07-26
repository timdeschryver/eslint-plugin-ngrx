import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/avoid-mapping-selectors'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selectItems);
        constructor(private store: Store){}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selectItems).pipe(filter(x => !!x));
        constructor(private store: Store){}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selectItems));
        constructor(private store: Store){}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selectItems)).pipe(filter(x => !!x));
        constructor(private store: Store){}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Injectable()
      export class FixtureEffect {
        loginUserSuccess$ = createEffect(() => {
            return this.actions$.pipe(
              ofType(AuthActions.loginUserSuccess),
              concatLatestFrom(action => this.store.select(startUrl)),
              map(([action, url]) => AuthActions.setStartUrl({data: ''})),
            );
          }
        );
        constructor(private store: Store){}
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.store.select(selectItems).pipe(map(x => ({name: x.name})))
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.customStore.select(selectItems).pipe(filter(x => !!x), map(x => ({name: x.name})))
                                                                            ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private customStore: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.store.pipe(select(selectItems), map(x => ({name: x.name})))
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.customStore.pipe(select(selectItems), filter(x => !!x), map(x => ({name: x.name})))
                                                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private customStore: Store){}
        }
      `,
    ),
  ],
})
