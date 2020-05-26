import { stripIndent } from 'common-tags'
import rule, { ruleName, messageId } from '../../src/rules/no-multiple-stores'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `export class NoCtorOK {}`,
    `
    export class EmptyOk {
      constructor(){}
    }`,
    `
    export class OneWithVisibilityOk {
      constructor(private store: Store<{}>){}
    }`,
    `
    export class OneWithoutVisibilityOk {
      constructor(store: Store){}
    }`,
    `
    export class OnePlusExtraOk {
      constructor(private store: Store<{}>, data: Service){}
    }`,
  ],
  invalid: [
    {
      code: stripIndent`
      export class NotOkNoVisibility {
        constructor(store: Store<{}>, store2: Store<{}>){}
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 33,
          endLine: 2,
          endColumn: 50,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOkOneVisibility {
        constructor(store: Store<{}>, private store2: Store<{}>){}
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 41,
          endLine: 2,
          endColumn: 58,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOkBothVisibility {
        constructor(private readonly store: Store<{}>, private store2: Store<{}>){}
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 58,
          endLine: 2,
          endColumn: 75,
        },
      ],
    },
    {
      code: stripIndent`
      export class NotOkMultipleErrors {
        constructor(private readonly store: Store<{}>, private store2: Store<{}>, private store3: Store){}
      }`,
      errors: [
        {
          messageId,
          line: 2,
          column: 58,
          endLine: 2,
          endColumn: 75,
        },
        {
          messageId,
          line: 2,
          column: 85,
          endLine: 2,
          endColumn: 98,
        },
      ],
    },
  ],
})
