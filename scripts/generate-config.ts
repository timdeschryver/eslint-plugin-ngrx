import fs from 'fs'
import path from 'path'
import { format, resolveConfig } from 'prettier'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)

const RULE_NAME_PREFIX = 'ngrx/'
const CONFIG_DIRECTORY = './src/configs/'

const recommendedRules = Object.entries(rules).reduce(
  (rules, [ruleName, rule]) => {
    if (rule.meta.docs.recommended) {
      rules[`${RULE_NAME_PREFIX}${ruleName}`] = rule.meta.docs.recommended
    }
    return rules
  },
  {},
)

const code = `export = {
  plugins: ['ngrx'],
  rules: ${JSON.stringify(recommendedRules)},
}
`
const config = format(code, {
  parser: 'typescript',
  ...prettierConfig,
})
fs.writeFileSync(path.join(CONFIG_DIRECTORY, 'recommended.ts'), config)
