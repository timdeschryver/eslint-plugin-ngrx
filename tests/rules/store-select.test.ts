import { stripIndent } from 'common-tags'
import rule, {
  METHOD,
  OPERATOR,
  operatorSelectMessageId,
  ruleName,
  methodSelectMessageId,
} from '../../src/rules/select-style'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `this.store.pipe(select(selector));`,
    {
      code: `this.store.pipe(select(selector));`,
      options: [{ mode: OPERATOR }],
    },
    {
      code: `this.store.select(selector);`,
      options: [{ mode: METHOD }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        this.store.select(selector);`,
      errors: [
        {
          messageId: operatorSelectMessageId,
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.pipe(select(selector));`,
      options: [{ mode: METHOD }],
      errors: [
        {
          messageId: methodSelectMessageId,
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 33,
        },
      ],
    },
    {
      code: stripIndent`
        this.store.select(selector);`,
      options: [{ mode: OPERATOR }],
      errors: [
        {
          messageId: operatorSelectMessageId,
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28,
        },
      ],
    },
  ],
})
