import { stripIndent, stripIndents } from 'common-tags'
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
  ],
  invalid: [
    {
      code: stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(() => this.actions.pipe(
          ofType('PING'),
          map(() => this.store.dispatch({ type: 'PONG' }))
        ), { dispatch: false })

        constructor(private actions: Actions, private store: Store) {}
      }`,
      errors: [
        {
          column: 15,
          endColumn: 34,
          line: 6,
          messageId: noDispatchInEffects,
          suggestions: [
            {
              messageId: noDispatchInEffectsSuggest,
              output: stripIndent`
            import { Store } from '@ngrx/store'
            @Injectable()
            export class FixtureEffects {
              effectNOK = createEffect(() => this.actions.pipe(
                ofType('PING'),
                map(() => ({ type: 'PONG' }))
              ), { dispatch: false })

              constructor(private actions: Actions, private store: Store) {}
            }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(
          () =>
            this.actions.pipe(
              ofType('PING'),
              map(() => {
                return this.customName.dispatch({ /* you shouldn't do this */ type: 'PONG' })
              }),
            ),
          { dispatch: false },
        )

        constructor(private actions: Actions, private customName: Store) {}
      }`,
      errors: [
        {
          column: 18,
          endColumn: 42,
          line: 9,
          messageId: noDispatchInEffects,
          suggestions: [
            {
              messageId: noDispatchInEffectsSuggest,
              output: stripIndent`
              import { Store } from '@ngrx/store'
              @Injectable()
              export class FixtureEffects {
                effectNOK = createEffect(
                  () =>
                    this.actions.pipe(
                      ofType('PING'),
                      map(() => {
                        return ({ /* you shouldn't do this */ type: 'PONG' })
                      }),
                    ),
                  { dispatch: false },
                )

                constructor(private actions: Actions, private customName: Store) {}
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndents`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(
          () =>
            this.actions.pipe(
              ofType('PING'),
              map(() => {
                this.store$.dispatch(someAction())// you shouldn't do this
                return anotherAction()
              }),
            ),
          { dispatch: false },
        )

        constructor(private actions: Actions, private readonly store$: Store) {}
      }`,
      errors: [
        {
          column: 1,
          endColumn: 21,
          line: 9,
          messageId: noDispatchInEffects,
          suggestions: [
            {
              messageId: noDispatchInEffectsSuggest,
              output: stripIndents`
              import { Store } from '@ngrx/store'
              @Injectable()
              export class FixtureEffects {
                effectNOK = createEffect(
                  () =>
                    this.actions.pipe(
                      ofType('PING'),
                      map(() => {
                        // you shouldn't do this
                        return anotherAction()
                      }),
                    ),
                  { dispatch: false },
                )

                constructor(private actions: Actions, private readonly store$: Store) {}
              }`,
            },
          ],
        },
      ],
    },
  ],
})
