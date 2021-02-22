import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-dispatch-in-effects'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
    import { Store } from '@ngrx/store'
    @Injectable()
    export class FixtureEffects {

    effectOK = createEffect(() => this.actions.pipe(
      ofType('PING'),
      map(() => ({ type: 'PONG' }))
    ))

    constructor(private actions: Actions, private store: Store){}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(() => this.actions.pipe(
          ofType('PING'),
          map(() => this.store.dispatch({ type: 'PONG' }))
                    ~~~~~~~~~~~~~~~~~~~ [${messageId}]
          ), { dispatch: false })

        constructor(private actions: Actions, private store: Store){}
      }`,
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'
      @Injectable()
      export class FixtureEffects {
        effectNOK = createEffect(() => this.actions.pipe(
          ofType('PING'),
          map(() => this.customName.dispatch({ type: 'PONG' }))
                    ~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          ), { dispatch: false })

        constructor(private actions: Actions, private customName: Store){}
      }`,
    ),
  ],
})
