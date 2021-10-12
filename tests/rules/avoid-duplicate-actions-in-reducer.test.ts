import type { InvalidTestCase } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { stripIndents } from 'common-tags'
import path from 'path'
import { test } from 'uvu'
import type { MessageIds } from '../../src/rules/store/avoid-duplicate-actions-in-reducer'
import rule, {
  avoidDuplicateActionsInReducer,
  avoidDuplicateActionsInReducerSuggest,
} from '../../src/rules/store/avoid-duplicate-actions-in-reducer'
import { ruleTester } from '../utils'

const valid = [
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
]

const invalid: InvalidTestCase<MessageIds, []>[] = [
  {
    code: stripIndents`
    export const reducer = createReducer(
      {},
      on(abc, state => state),
      on(def, state => state),
      on(abc, (state, props) => state),
    )`,
    errors: [
      {
        column: 4,
        endColumn: 7,
        line: 3,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'abc',
            },
            output: stripIndents`
            export const reducer = createReducer(
              {},

              on(def, state => state),
              on(abc, (state, props) => state),
            )`,
          },
        ],
      },
      {
        column: 4,
        endColumn: 7,
        line: 5,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'abc',
            },
            output: stripIndents`
            export const reducer = createReducer(
              {},
              on(abc, state => state),
              on(def, state => state),

            )`,
          },
        ],
      },
    ],
  },
  {
    code: stripIndents`
    export const reducer = createReducer(
      {},
      on(foo, state => state),
      on(foo2, state => state),
      on(foo, (state, props) => state),
      on(foo, state => state),
      on(foo3, state => state),
    )`,
    errors: [
      {
        column: 4,
        endColumn: 7,
        line: 3,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: stripIndents`
            export const reducer = createReducer(
              {},

              on(foo2, state => state),
              on(foo, (state, props) => state),
              on(foo, state => state),
              on(foo3, state => state),
            )`,
          },
        ],
      },
      {
        column: 4,
        endColumn: 7,
        line: 5,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: stripIndents`
            export const reducer = createReducer(
              {},
              on(foo, state => state),
              on(foo2, state => state),

              on(foo, state => state),
              on(foo3, state => state),
            )`,
          },
        ],
      },
      {
        column: 4,
        endColumn: 7,
        line: 6,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: stripIndents`
            export const reducer = createReducer(
              {},
              on(foo, state => state),
              on(foo2, state => state),
              on(foo, (state, props) => state),

              on(foo3, state => state),
            )`,
          },
        ],
      },
    ],
  },
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, { valid, invalid })
})
test.run()
