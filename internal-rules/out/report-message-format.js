'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.messageId = void 0
const experimental_utils_1 = require('@typescript-eslint/experimental-utils')
const path_1 = __importDefault(require('path'))
exports.messageId = 'reportMessageFormat'
exports.default = experimental_utils_1.ESLintUtils.RuleCreator(() => '')({
  name: path_1.default.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'Ensures a consistent format for rule report messages.',
      recommended: 'error',
    },
    schema: [
      {
        type: 'string',
        additionalProperties: false,
      },
    ],
    messages: {
      [exports.messageId]:
        'Report message does not match the pattern `{{pattern}}`.',
    },
  },
  defaultOptions: ['^[A-Z].+\\.$'],
  create: (context, [format]) => {
    const pattern = RegExp(format)
    return {
      [`CallExpression[callee.callee.object.name='ESLintUtils'][callee.callee.property.name='RuleCreator'] Property[key.name='meta'] Property[key.name='messages'] :matches(Literal[value!=${pattern}], TemplateLiteral[quasis.length=1][quasis.0.value.raw!=${pattern}])`](
        node,
      ) {
        context.report({
          node,
          messageId: exports.messageId,
          data: {
            pattern,
          },
        })
      },
    }
  },
})
