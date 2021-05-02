import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/store/good-action-hygiene'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `export const loadCustomer = createAction('[Customer Page] Load Customer')`,
    `export const loadCustomer = createAction('[Customer API] Load Customer Success, props<{ customer: Customer }>()')`,
    `export const loadCustomer = createAction('[Customer API] Load Customer Failed, (error: string) => ({ error, timestamp: +Date.now()})')`,
    `export const loadCustomer = createAction(iDoNotCrash)`,
    `export const loadCustomer = createActionType('Just testing')`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export const loadCustomer = createAction('Load Customer')
                                                 ~~~~~~~~~~~~~~~ [${messageId} { "actionType": "Load Customer" }]
      `,
    ),
  ],
})
