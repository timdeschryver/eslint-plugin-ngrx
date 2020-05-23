import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
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

    constructor(private actions: Actions, private store: Store<{}>){}
    }`,
  ],
  invalid: [
    {
      code: stripIndent`
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(() => this.actions.pipe(
          ofType('PING'),
          map(() => this.store.dispatch({ type: 'PONG' }))
        ), { dispatch: false })

        constructor(private actions: Actions, private store: Store<{}>){}
      }`,
      errors: [
        {
          messageId,
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 34,
        },
      ],
    },
  ],
})
