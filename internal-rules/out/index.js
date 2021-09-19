'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const report_message_format_1 = __importDefault(
  require('./report-message-format'),
)
module.exports = {
  rules: {
    'report-message-format': report_message_format_1.default,
  },
}
