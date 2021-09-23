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
    @Injectable()
    export class FixtureEffects {
      effectOK = createEffect(() => this.actions.pipe(
        ofType('PING'),
        map(() => ({ type: 'PONG' }))
      ))

      constructor(private actions: Actions, private store: Store) {}
    }`,
    `
    @Injectable()
    export class FixtureEffects {
      effectOK1 = createEffect(
        () =>
          this.actions.pipe(
            ofType(customerActions.delete),
            map(() => {
              customObject.dispatch({ somethingElse: true })
              return { type: 'PONG' }
            }),
          ),
        { dispatch: false },
      )

      constructor(private actions: Actions, private store: Store) {}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(() => this.actions.pipe(
          ofType(someAction),
          tap(() => this.store.dispatch(awesomeAction()))
                    ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
        ), { dispatch: false })

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
              effectNOK = createEffect(() => this.actions.pipe(
                ofType(someAction),
                tap(() => (awesomeAction()))
              ), { dispatch: false })

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
        effectNOK1 = createEffect(() => this.actions.pipe(
          ofType(userActions.add),
          map(() => {
            return this.store.dispatch({ type: 'PONG' });
                   ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
          })
        ))

        constructor(private actions: Actions, private store: Store) {}
      }`,
      {
        output: stripIndent`
        import { Store } from '@ngrx/store'
        @Injectable()
        export class FixtureEffects {
          effectNOK1 = createEffect(() => this.actions.pipe(
            ofType(userActions.add),
            map(() => {
              return ({ type: 'PONG' });
            })
          ))

          constructor(private actions: Actions, private store: Store) {}
        }`,
      },
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK2 = createEffect(
          () =>
            this.actions.pipe(
              ofType('PING'),
              map(() => {
                return this.customName.dispatch({ /* you shouldn't do this */ type: 'PONG' })
                       ~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
              }),
            ),
          { 'dispatch': true },
        )

        constructor(private actions: Actions, private customName: Store) {}
      }`,
      {
        output: stripIndent`
        import { Store } from '@ngrx/store'
        @Injectable()
        export class FixtureEffects {
          effectNOK2 = createEffect(
            () =>
              this.actions.pipe(
                ofType('PING'),
                map(() => {
                  return ({ /* you shouldn't do this */ type: 'PONG' })
                }),
              ),
            { 'dispatch': true },
          )

          constructor(private actions: Actions, private customName: Store) {}
        }`,
      },
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK3 = createEffect(
          () =>
            this.actions.pipe(
              ofType('PING'),
              tap(() => {
                this.store$.dispatch(someAction());// you shouldn't do this
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects}]
                return somethingElse()
              }),
            ),
          // Note that it's correct to suggest, instead of fix, here, because although it doesn't have dispatch: fase explicitly, it may have implicitly through options
          { dispatch: true, useEffectsErrorHandler: false, ...options },
        )

        constructor(private actions: Actions, private readonly store$: Store) {}
      }`,
      {
        suggestions: [
          {
            messageId: noDispatchInEffectsSuggest,
            output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              effectNOK3 = createEffect(
                () =>
                  this.actions.pipe(
                    ofType('PING'),
                    tap(() => {
                      ;// you shouldn't do this
                      return somethingElse()
                    }),
                  ),
                { dispatch: true, useEffectsErrorHandler: false, ...options },
              )

              constructor(private actions: Actions, private readonly store$: Store) {}
            }`,
          },
        ],
      },
    ),
  ],
})
