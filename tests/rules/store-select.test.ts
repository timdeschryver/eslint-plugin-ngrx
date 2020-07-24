import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
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
    fromFixture(
      stripIndent`
        this.store.select(selector);
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~         [${operatorSelectMessageId}]
      `,
    ),
    fromFixture(
      stripIndent`
        this.store.pipe(select(selector));
                        ~~~~~~~~~~~~~~~~   [${methodSelectMessageId}]
      `,
      {
        options: [{ mode: METHOD }],
      },
    ),
    fromFixture(
      stripIndent`
        this.store.select(selector);
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~         [${operatorSelectMessageId}]
      `,
      {
        options: [{ mode: OPERATOR }],
      },
    ),
  ],
})
