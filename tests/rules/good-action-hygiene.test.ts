import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  goodActionHygieneRuleName,
  messageId,
} from '../../src/rules/good-action-hygiene'
import { ruleTester } from '../utils'

ruleTester().run(goodActionHygieneRuleName, rule, {
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
