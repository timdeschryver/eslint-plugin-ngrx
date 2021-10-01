import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  noDispatchInEffects,
  noDispatchInEffectsSuggest,
} from '../../src/rules/effects/no-dispatch-in-effects'
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
    @Injectable()
    export class FixtureEffects {
      effectOK = createEffect(() => this.actions.pipe(
        ofType('PING'),
        tap(() => ({ type: 'PONG' }))
      ))

      constructor(private actions: Actions, private store: Store) {}
    }`,
    `
    import { Store } from '@ngrx/store'
    @Injectable()
    export class FixtureEffects {
      readonly effectOK1: Observable<unknown>

      constructor(private actions: Actions, private store$: Store) {
         this.effectOK1 = createEffect(
          () => ({ scheduler = asyncScheduler } = {}) =>
            this.actions.pipe(
              ofType(customerActions.remove),
              tap(() => {
                customObject.dispatch({ somethingElse: true })
                return customerActions.removeSuccess()
              }),
            ),
          { dispatch: false },
        )
      }
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(
          () => {
            return this.actions.pipe(
              ofType(someAction),
              tap(() => this.store.dispatch(awesomeAction())),
                        ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
            )
          },
          { dispatch: false },
        )

        constructor(private actions: Actions, private store: Store) {}
      }`,
      {
        suggestions: [
          {
            messageId: noDispatchInEffectsSuggest,
            output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              effectNOK = createEffect(
                () => {
                  return this.actions.pipe(
                    ofType(someAction),
                    tap(() => (awesomeAction())),
                  )
                },
                { dispatch: false },
              )

              constructor(private actions: Actions, private store: Store) {}
            }`,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK1 = createEffect(() => condition ? this.actions.pipe(
          ofType(userActions.add),
          tap(() => {
            return this.store.dispatch(userActions.addSuccess)
                   ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
          })
        ) : this.actions.pipe())

        constructor(private actions: Actions, private store: Store) {}
      }`,
      {
        suggestions: [
          {
            messageId: noDispatchInEffectsSuggest,
            output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              effectNOK1 = createEffect(() => condition ? this.actions.pipe(
                ofType(userActions.add),
                tap(() => {
                  return (userActions.addSuccess)
                })
              ) : this.actions.pipe())

              constructor(private actions: Actions, private store: Store) {}
            }`,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK2 = createEffect(
          () => ({ debounce = 200 } = {}) =>
            this.actions.pipe(
              ofType(actions.ping),
              tap(() => {
                return this.customName.dispatch(/* you shouldn't do this */ actions.pong())
                       ~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
              }),
            ),
        )

        constructor(private actions: Actions, private customName: Store) {}
      }`,
      {
        suggestions: [
          {
            messageId: noDispatchInEffectsSuggest,
            output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              effectNOK2 = createEffect(
                () => ({ debounce = 200 } = {}) =>
                  this.actions.pipe(
                    ofType(actions.ping),
                    tap(() => {
                      return (/* you shouldn't do this */ actions.pong())
                    }),
                  ),
              )

              constructor(private actions: Actions, private customName: Store) {}
            }`,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        readonly effectNOK3: Observable<unknown>

        constructor(private actions: Actions, private readonly store$: Store) {
          this.effectNOK3 = createEffect(
            () =>
              this.actions.pipe(
                ofType(bookActions.load),
                map(() => {
                  this.store$.dispatch(bookActions.loadSuccess());// you shouldn't do this
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
                  return somethingElse()
                }),
              ),
            { dispatch: true, useEffectsErrorHandler: false, ...options },
          )
        }
      }`,
      {
        suggestions: [
          {
            messageId: noDispatchInEffectsSuggest,
            output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              readonly effectNOK3: Observable<unknown>

              constructor(private actions: Actions, private readonly store$: Store) {
                this.effectNOK3 = createEffect(
                  () =>
                    this.actions.pipe(
                      ofType(bookActions.load),
                      map(() => {
                        ;// you shouldn't do this
                        return somethingElse()
                      }),
                    ),
                  { dispatch: true, useEffectsErrorHandler: false, ...options },
                )
              }
            }`,
          },
        ],
      },
    ),
  ],
})
