import { writeFileSync } from 'fs'
import { join } from 'path'
import { format, resolveConfig } from 'prettier'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)

const RULE_NAME_PREFIX = 'ngrx/'
const CONFIG_DIRECTORY = './src/configs/'

const recommendedRules = Object.entries(rules).reduce(
  (rules, [ruleName, rule]) => {
    if (rule.meta.docs?.recommended) {
      rules[`${RULE_NAME_PREFIX}${ruleName}`] = rule.meta.docs.recommended
    }
    return rules
  },
  {},
)

const rxjsRules = {
  'rxjs/no-cyclic-action': 'warn',
  'rxjs/no-unsafe-catch': 'error',
  'rxjs/no-unsafe-first': 'error',
  'rxjs/no-unsafe-switchmap': 'error',
}

const configRules = {
  ...recommendedRules,
  ...rxjsRules,
}

const code = `export = {
  plugins: ['ngrx', 'rxjs'],
  rules: ${JSON.stringify(configRules)},
}
`
const config = format(code, {
  parser: 'typescript',
  ...prettierConfig,
})
writeFileSync(join(CONFIG_DIRECTORY, 'recommended.ts'), config)
