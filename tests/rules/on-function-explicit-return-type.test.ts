import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/on-function-explicit-return-type'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
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
    fromFixture(
      stripIndent`
        const reducer = createReducer(
          initialState,
          on(increment, s => ({ ...s, counter: s.counter + 1 })),
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        )`,
    ),
    fromFixture(
      stripIndent`
        const reducer = createReducer(
          initialState,
          on(increase, (s, action) => ({ ...s, counter: s.counter + action.value })),
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        )`,
    ),
    fromFixture(
      stripIndent`
        const reducer = createReducer(
          initialState,
          on(increase, (s, { value }) => ({ ...s, counter: s.counter + value })),
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        )`,
    ),
  ],
})
