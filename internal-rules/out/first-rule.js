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
exports.messageId = 'messageId'
const triggerInternal = 'ss'
module.exports = experimental_utils_1.ESLintUtils.RuleCreator(() => '')({
  name: path_1.default.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'first rule',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [exports.messageId]: 'first rule',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ['Identifier[name="triggerInternal"]'](node) {
        context.report({
          node,
          messageId: exports.messageId,
        })
      },
    }
  },
})
