import { TSESLint } from '@typescript-eslint/experimental-utils'
import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path, { resolve } from 'path'
import rule, { messageId } from './report-message-format'

function ruleTester() {
  return new TSESLint.RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      project: resolve('./tests/tsconfig.json'),
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  })
}

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
      meta: {
        messages: {
          [messageId]: 'Test.',
        },
      },
    })
    `,
    `
    export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
      meta: {
        messages: {
          [messageId]: \`\${test}let's ignore if there are interpolations\`,
        },
      },
    })
    `,
    {
      code: `
      export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
        meta: {
          messages: {
            [messageId]: \'ngrx is awesome\',
          },
        },
      })
      `,
      options: ['^ngrx'],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
      export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
        meta: {
          messages: {
            [messageId]: 'starting with lowercase',
                         ~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "pattern": "/^[A-Z].+\\\\.$/" }]
          },
        },
      })
      `,
    ),
    fromFixture(
      stripIndent`
      export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
        meta: {
          messages: {
            [messageId]: \`rxjs must be used\`,
                         ~~~~~~~~~~~~~~~~~~~ [${messageId} { "pattern": "/^RXJS/" }]
          },
        },
      })
      `,
      {
        options: ['^RXJS'],
      },
    ),
  ],
})
