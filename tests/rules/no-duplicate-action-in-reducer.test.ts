import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-duplicate-action-in-reducer'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
    export const reducer = createReducer(
      {},
      on(abc, state => state),
      on(def, state => state),
      on(ghi, state => state),
    )`,
  ],
  invalid: [
    {
      code: stripIndent`
        export const reducer = createReducer(
          {},
          on(abc, state => state),
          on(def, state => state),
          on(abc, (state, props) => state),
        )`,
      errors: [
        {
          messageId,
          line: 3,
          column: 6,
          endLine: 3,
          endColumn: 9,
          data: {
            actionName: 'abc',
          },
        },
        {
          messageId,
          line: 5,
          column: 6,
          endLine: 5,
          endColumn: 9,
          data: {
            actionName: 'abc',
          },
        },
      ],
    },
    {
      code: stripIndent`
        export const reducer = createReducer(
          {},
          on(foo1, state => state),
          on(foo2, state => state),
          on(foo1, (state, props) => state),
          on(foo1, state => state),
          on(foo3, state => state),
        )`,
      errors: [
        {
          messageId,
          line: 3,
          column: 6,
          endLine: 3,
          endColumn: 10,
          data: {
            actionName: 'foo1',
          },
        },
        {
          messageId,
          line: 5,
          column: 6,
          endLine: 5,
          endColumn: 10,
          data: {
            actionName: 'foo1',
          },
        },
        {
          messageId,
          line: 6,
          column: 6,
          endLine: 6,
          endColumn: 10,
          data: {
            actionName: 'foo1',
          },
        },
      ],
    },
  ],
})
