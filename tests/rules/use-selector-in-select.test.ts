import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/use-selector-in-select'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `store.pipe(select(selectCustomers))`,
    `store.pipe(select(selectorsObj.selectCustomers))`,
    `store.select(selectCustomers)`,
    `store.select(selectorsObj.selectCustomers)`,
  ],
  invalid: [
    {
      code: stripIndent`
        store.pipe(select('customers'))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 30,
        },
      ],
    },
    {
      code: stripIndent`
        store.select('customers')`,
      errors: [
        {
          messageId,
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 25,
        },
      ],
    },
    {
      code: stripIndent`
        store.pipe(select('customers', 'orders'))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 30,
        },
        {
          messageId,
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 40,
        },
      ],
    },
    {
      code: stripIndent`
        store.select('customers', 'orders')`,
      errors: [
        {
          messageId,
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 25,
        },
        {
          messageId,
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 35,
        },
      ],
    },
    {
      code: stripIndent`
        store.pipe(select(state => state.customers))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 43,
        },
      ],
    },
    {
      code: stripIndent`
        store.select(state => state.customers)`,
      errors: [
        {
          messageId,
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 38,
        },
      ],
    },
    {
      code: stripIndent`
        store.pipe(select(state => state.customers.orders))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 50,
        },
      ],
    },
    {
      code: stripIndent`
        store.select(state => state.customers.orders)`,
      errors: [
        {
          messageId,
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 45,
        },
      ],
    },
  ],
})
