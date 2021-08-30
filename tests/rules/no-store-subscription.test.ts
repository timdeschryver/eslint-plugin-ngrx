import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/no-store-subscription'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        vm$ = this.store.select(selectItems)

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        vm$ = this.store.pipe(select(selectItems))

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        readonly formControlChangesSubscription$ = this.formCtrlOrg.valueChanges
          .pipe(takeUntil(this.drop))
          .subscribe((orgName) => {
            this.store.dispatch(UserPageActions.checkOrgNameInput({ orgName }))
          })

        constructor(private store: Store) {}
      }
    `,
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        readonly items$: Observable<readonly Item[]>
        readonly metrics$: Observable<Metric>

        constructor(store: Store) {
          this.items$ = store.pipe(select(selectItems))
          this.metrics$ = store.select(selectMetrics)
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
          sub = this.store.select(selectItems).subscribe()
                                               ~~~~~~~~~ [${messageId}]
          constructor(private store: Store) {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          sub = this.store.pipe(select(selectItems)).subscribe()
                                                     ~~~~~~~~~ [${messageId}]
          constructor(private store: Store) {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          constructor(private store: Store) {}

          ngOnInit() {
            this.store.select(selectItems).subscribe()
                                           ~~~~~~~~~ [${messageId}]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          constructor(private store: Store) {}

          ngOnInit() {
            this.store.pipe(select(selectItems)).subscribe()
                                                 ~~~~~~~~~ [${messageId}]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          constructor(store: Store) {
            store.pipe(select(selectItems)).subscribe()
                                            ~~~~~~~~~ [${messageId}]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          readonly control = new FormControl();

          constructor(store: Store) {
            this.control.valueChanges.subscribe(() => {
              store.pipe(select(selectItems)).subscribe()
                                              ~~~~~~~~~ [${messageId}]
            })
          }
        }
      `,
    ),
  ],
})
