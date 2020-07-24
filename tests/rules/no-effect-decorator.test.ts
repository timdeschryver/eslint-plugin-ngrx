import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, { ruleName, messageId } from '../../src/rules/no-effect-decorator'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
      @Injectable()
      export class FixtureEffects {

      effectOK = createEffect(() => this.actions.pipe(
        ofType('PING'),
        map(() => ({ type: 'PONG' }))
      ))

      constructor(private actions: Actions){}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      @Injectable()
      export class FixtureEffects {
        @Effect()
        ~~~~~~~~~ [${messageId}]
        effectNOK =  this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )

        constructor(private actions: Actions){}
      }`,
    ),
    fromFixture(
      stripIndent`
      @Injectable()
      export class FixtureEffects {
        @Effect({ dispatch: false })
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        effectNOK2 = this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )

        constructor(private actions: Actions){}
      }`,
    ),
  ],
})
