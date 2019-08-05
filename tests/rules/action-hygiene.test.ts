import rule, { ruleName, messageId } from '../../src/rules/action-hygiene'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `export const loadCustomer = createAction('[Customer Page] Load Customer')`,
    `export const loadCustomer = createAction('[Customer API] Load Customer Success, props<{ customer: Customer }>()')`,
    `export const loadCustomer = createAction('[Customer API] Load Customer Failed, (error: string) => ({ error, timestamp: +Date.now()})')`,
    `export const loadCustomer = createAction(iDoNotCrash)`,
  ],
  invalid: [
    {
      code: `export const loadCustomer = createAction('Load Customer')`,
      errors: [
        {
          messageId,
          line: 1,
          column: 42,
          endLine: 1,
          endColumn: 57,
          data: {
            actionType: 'Load Customer',
          },
        },
      ],
    },
  ],
})
