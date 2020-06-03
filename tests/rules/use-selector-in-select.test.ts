import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/use-selector-in-select'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `this.store.pipe(select(selectCustomers))`,
    `this.store.pipe(select(selectorsObj.selectCustomers))`,
    `this.store.select(selectCustomers)`,
    `this.store.select(selectorsObj.selectCustomers)`,
  ],
  invalid: [
    {
      code: stripIndent`
        this.store.pipe(select('customers'))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.select('customers')`,
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
        this.store.pipe(select('customers', 'orders'))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35,
        },
        {
          messageId,
          line: 1,
          column: 37,
          endLine: 1,
          endColumn: 45,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.select('customers', 'orders')`,
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
        this.store.pipe(select(state => state.customers))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 48,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.select(state => state.customers)`,
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
        this.store.pipe(select(state => state.customers.orders))`,
      errors: [
        {
          messageId,
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 55,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.select(state => state.customers.orders)`,
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
  ],
})
