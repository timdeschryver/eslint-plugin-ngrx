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
        readonly test$ = somethingOutside();
      }`,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selectItems)

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.select(selectItems).pipe(filter(x => !!x))

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selectItems))

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        foo$ = this.store.pipe(select(selectItems)).pipe(filter(x => !!x))

        constructor(private store: Store) {}
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
            )
          }
        )

        constructor(private store: Store) {}
      }
    `,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/174
    `
      import { Store, select } from '@ngrx/store'
      @Injectable()
      export class FixtureEffect {
        loginUserSuccess$ = combineLatest([
          this.store.select(selectAuthorizations), this.hasAuthorization$
        ]).pipe(map((val) => !isEmpty(intersection(val))))

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        readonly customers$ = this.store$.select(({ customers }) => customers).pipe()
        readonly users$ = this.store$
          .select('users')
          .pipe(switchMap(() => of(items.map(parseItem))))

        constructor(private readonly store$: Store) {}

        ngOnInit() {
          this.store$.pipe()
        }
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.store
            .select(selectItems)
            .pipe(map((item) => item.select()))
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]

          constructor(private store: Store) {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = this.customStore.select(selectItems).pipe(
            filter((x) => !!x),
            map(getName),
            ~~~~~~~~~~~~ [${messageId}]
          )

          constructor(private customStore: Store) {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          readonly vm$ = this.store.pipe(
            select(selectItems),
            map((item) => ({ name: item.name, ...item.pipe() })),
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          )

          constructor(private readonly store: Store) {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          readonly vm$: Observable<Name>

          constructor(store$: Store) {
            this.vm$ = store$.pipe(
              select(selectItems),
              filter(Boolean),
              map(({ name }) => ({ name })),
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
            )
          }
        }
      `,
    ),
  ],
})
