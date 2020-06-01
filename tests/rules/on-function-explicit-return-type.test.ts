import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/on-function-explicit-return-type'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
      const reducer = createReducer(
        initialState,
        on(
          increment,
          (s): State => ({
            ...s,
            counter: s.counter + 1,
          }),
        ),
      )`,
    `
    const reducer = createReducer(
      initialState,
      on(increment, incrementFunc),
      on(increment, s => incrementFunc(s)),
      on(increment, (s): State => incrementFunc(s)),
    )`,
    `
    const reducer = createReducer(
      initialState,
      on(
        increment,
        produce((draft: State, action) => {
            draft.counter++;
        }),
      ),
    )`,
    // https://github.com/timdeschryver/ngrx-tslint-rules/pull/37
    `
    const reducer = createReducer(
      on(increment, (s): State => ({
        ...s,
        counter: (s => s.counter + 1)(s),
      })),
    )`,
  ],
  invalid: [
    {
      code: stripIndent`
        const reducer = createReducer(
          initialState,
          on(increment, s => ({
            ...s,
            counter: s.counter + 1,
          })),
        )`,
      errors: [
        {
          messageId,
          line: 3,
          column: 17,
          endLine: 6,
          endColumn: 5,
        },
      ],
    },
    {
      code: stripIndent`
        const reducer = createReducer(
          initialState,
          on(increase, (s, action) => ({
            ...s,
            counter: s.counter + action.value,
          })),
        )`,
      errors: [
        {
          messageId,
          line: 3,
          column: 16,
          endLine: 6,
          endColumn: 5,
        },
      ],
    },
    {
      code: stripIndent`
        const reducer = createReducer(
          initialState,
          on(increase, (s, { value }) => ({
            ...s,
            counter: s.counter + value,
          })),
        )`,
      errors: [
        {
          messageId,
          line: 3,
          column: 16,
          endLine: 6,
          endColumn: 5,
        },
      ],
    },
  ],
})
