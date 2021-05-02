import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-effect-callback-in-block-statement'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      class Effect {
        effectOK = createEffect(() => {
          return this.actions.pipe(
            ofType('PING'),
            map(() => ({ type: 'PONG' }))
          )
        })
      }
    `,
    `
      class Effect {
        effectOK = createEffect(() => {
          return this.actions.pipe(
            ofType('PING'),
            tap(() => doSomething())
          )
        }, {dispatch: false})
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        class Effect {
          effectNOK = createEffect(() => this.actions.pipe(ofType('PING'),map(() => ({ type: 'PONG' }))))
                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      `,
      {
        output: stripIndent`
        class Effect {
          effectNOK = createEffect(() => { return this.actions.pipe(ofType('PING'),map(() => ({ type: 'PONG' }))) })
        }
      `,
      },
    ),
    fromFixture(
      stripIndent`
        class Effect {
          effectNOK = createEffect(() => this.actions.pipe(ofType('PING'),tap(() => doSomething())), {dispatch: false})
                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      `,
      {
        output: stripIndent`
        class Effect {
          effectNOK = createEffect(() => { return this.actions.pipe(ofType('PING'),tap(() => doSomething())) }, {dispatch: false})
        }
      `,
      },
    ),
  ],
})
