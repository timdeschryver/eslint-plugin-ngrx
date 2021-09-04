import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/avoid-duplicate-actions-in-reducer'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    export const reducer = createReducer(
      {},
      on(abc, state => state),
      on(def, state => state),
      on(ghi, state => state),
    )`,
    `
    export const reducer = createReducer(
      {},
      on(abc, state => state),
      on(def, state => state),
      on(ghi, state => state),
    )

    export const reducerTwo = createReducer(
      {},
      on(abc, state => state),
      on(def, state => state),
      on(ghi, state => state),
    )`,
    // does not crash when no arguments present
    `
    export const reducer = createReducer(
      {},
      on(),
    )`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export const reducer = createReducer(
          {},
          on(abc, state => state),
             ~~~           [${messageId} { "actionName": "abc" }]
          on(def, state => state),
          on(abc, (state, props) => state),
             ~~~           [${messageId} { "actionName": "abc" }]

        )`,
    ),
    fromFixture(
      stripIndent`
        export const reducer = createReducer(
          {},
          on(foo1, state => state),
             ~~~~           [${messageId} { "actionName": "foo1" }]
          on(foo2, state => state),
          on(foo1, (state, props) => state),
             ~~~~           [${messageId} { "actionName": "foo1" }]
          on(foo1, state => state),
             ~~~~           [${messageId} { "actionName": "foo1" }]
          on(foo3, state => state),
        )`,
    ),
  ],
})
