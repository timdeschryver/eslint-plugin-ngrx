import { stripIndent } from 'common-tags'
import rule, { ruleName, messageId } from '../../src/rules/no-effect-decorator'
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

  constructor(private actions: Actions){}
}`,
  ],
  invalid: [
    {
      code: stripIndent`
      @Injectable()
      export class FixtureEffects {
        @Effect()
        effectNOK =  this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )

        constructor(private actions: Actions){}
      }`,
      errors: [
        {
          messageId,
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 12,
        },
      ],
    },
    {
      code: stripIndent`
      @Injectable()
      export class FixtureEffects {
        @Effect({ dispatch: false })
        effectNOK2 = this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )

        constructor(private actions: Actions){}
      }`,
      errors: [
        {
          messageId,
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 31,
        },
      ],
    },
  ],
})
