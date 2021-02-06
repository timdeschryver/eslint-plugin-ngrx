import { stripIndent } from 'common-tags'
import rule, {
  noDispatchInEffects,
  noDispatchInEffectsSuggest,
  ruleName,
} from '../../src/rules/no-dispatch-in-effects'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
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
      @Injectable()
      export class FixtureEffects {
        effect = createEffect(() => this.actions.pipe(
          ofType('PING'),
          map(() => this.store.dispatch({ type: 'PONG' }))
        ), { dispatch: false })

        constructor(private actions: Actions, private store: Store) {}
      }`,
      errors: [
        {
          column: 15,
          endColumn: 34,
          line: 5,
          messageId: noDispatchInEffects,
          suggestions: [
            {
              messageId: noDispatchInEffectsSuggest,
              output: stripIndent`
              @Injectable()
              export class FixtureEffects {
                effect = createEffect(() => this.actions.pipe(
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
  ],
})
