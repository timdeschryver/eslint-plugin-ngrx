import { readdirSync } from 'fs'
import { join, parse } from 'path'

import { TSESLint } from '@typescript-eslint/experimental-utils'

type RuleModule = TSESLint.RuleModule<string, unknown[]>

// Copied from https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interopRequireDefault = (obj: any): { default: unknown } =>
  obj?.__esModule ? obj : { default: obj }

const importDefault = (moduleName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interopRequireDefault(require(moduleName)).default

const rulesDir = __dirname
const excludedFiles = ['index']

export const rules = readdirSync(rulesDir)
  .map((rule) => parse(rule).name)
  .filter((ruleName) => !excludedFiles.includes(ruleName))
  .reduce(
    (allRules, ruleName) => ({
      ...allRules,
      [ruleName]: importDefault(join(rulesDir, ruleName)) as RuleModule,
    }),
    {} as Record<string, RuleModule>,
  )
