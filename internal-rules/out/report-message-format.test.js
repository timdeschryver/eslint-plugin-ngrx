'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          },
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
const experimental_utils_1 = require('@typescript-eslint/experimental-utils')
const common_tags_1 = require('common-tags')
const eslint_etc_1 = require('eslint-etc')
const path_1 = __importStar(require('path'))
const report_message_format_1 = __importStar(require('./report-message-format'))
function ruleTester() {
  return new experimental_utils_1.TSESLint.RuleTester({
    parser: (0, path_1.resolve)('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      project: (0, path_1.resolve)('./tests/tsconfig.json'),
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  })
}
ruleTester().run(
  path_1.default.parse(__filename).name,
  report_message_format_1.default,
  {
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
      (0, eslint_etc_1.fromFixture)((0, common_tags_1.stripIndent)`
      export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
        meta: {
          messages: {
            [messageId]: 'starting with lowercase',
                         ~~~~~~~~~~~~~~~~~~~~~~~~~ [${report_message_format_1.messageId} { "pattern": "/^[A-Z].+\\\\.$/" }]
          },
        },
      })
      `),
      (0, eslint_etc_1.fromFixture)(
        (0, common_tags_1.stripIndent)`
      export default ESLintUtils.RuleCreator(() => '')<Options, MessageIds>({
        meta: {
          messages: {
            [messageId]: \`rxjs must be used\`,
                         ~~~~~~~~~~~~~~~~~~~ [${report_message_format_1.messageId} { "pattern": "/^RXJS/" }]
          },
        },
      })
      `,
        {
          options: ['^RXJS'],
        },
      ),
    ],
  },
)
