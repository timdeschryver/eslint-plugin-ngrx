import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/prefer-action-creator'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `const loadUser = createAction('[User Page] Load User')`,
    `
    class Test {
      type = '[Customer Page] Load Customer'
    }`,
    `
    class Test implements Action {
      member = '[Customer Page] Load Customer'
    }`,
    `
    class Test {
      readonly type = ActionTypes.success

      constructor(
        currentState: string,
        newState: string,
        params?: RawParams,
        options?: TransitionOptions
      ) {}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      class Test implements Action { type = '[Customer Page] Load Customer' }
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`,
    ),
    fromFixture(
      stripIndent`
      class Test implements ngrx.Action { type = ActionTypes.success; constructor(readonly payload: Payload) {} }
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`,
    ),
  ],
})
