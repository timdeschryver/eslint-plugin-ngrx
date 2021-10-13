import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, { messageId } from '../../src/rules/store/prefer-action-creator'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: RunTests['valid'] = [
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
]

const invalid: RunTests['invalid'] = [
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
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, { valid, invalid })
})
test.run()
