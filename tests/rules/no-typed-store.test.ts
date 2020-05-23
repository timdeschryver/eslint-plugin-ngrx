import { stripIndent } from 'common-tags'
import rule, { ruleName, messageId } from '../../src/rules/no-typed-store'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
    export class Ok {
      constructor(store: Store)
    }`,
  ],
  invalid: [
    {
      code: stripIndent`
        export class NotOk {
          constructor(store: Store<PersonsState>){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 22,
          endLine: 2,
          endColumn: 41,
        },
      ],
    },
    {
      code: stripIndent`
        export class NotOk2 {
          constructor(cdr: ChangeDetectionRef, private store: Store<CustomersState>){}
        }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 55,
          endLine: 2,
          endColumn: 76,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk3 {
        constructor(private store: Store<any>, private personsService: PersonsService){}
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 40,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk4 {
        constructor(store: Store<{}>)
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 22,
          endLine: 2,
          endColumn: 31,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOk5 {
          constructor(store: Store<object>)
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 37,
        },
      ],
    },
  ],
})
