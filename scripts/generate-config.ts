import { writeFileSync } from 'fs'
import { join } from 'path'
import { format, resolveConfig } from 'prettier'
import type { NgRxRuleModule } from '../src/rule-creator'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)

const RULE_NAME_PREFIX = 'ngrx/'
const CONFIG_DIRECTORY = './src/configs/'

const getRules = (
  predicate: (rule: NgRxRuleModule<[], string>) => boolean,
  setting = (rule: NgRxRuleModule<[], string>) =>
    rule.meta.docs?.recommended || 'warn',
) =>
  Object.entries(rules).reduce<Record<string, string>>(
    (rules, [ruleName, rule]) => {
      if (predicate(rule)) {
        rules[`${RULE_NAME_PREFIX}${ruleName}`] = setting(rule)
      }
      return rules
    },
    {},
  )

writeConfig('recommended', {
  ...getRules((rule) => !!rule.meta.docs?.recommended),
})

writeConfig('all', {
  ...getRules(() => true),
})

writeConfig(
  'store',
  {
    ...getRules((rule) => rule.meta.ngrxModule === 'store'),
  },
  ['ngrx'],
)

writeConfig(
  'effects',
  {
    ...getRules((rule) => rule.meta.ngrxModule === 'effects'),
  },
  ['ngrx'],
)

writeConfig(
  'component-store',
  {
    ...getRules((rule) => rule.meta.ngrxModule === 'component-store'),
  },
  ['ngrx'],
)

writeConfig('strict', {
  ...getRules(
    () => true,
    () => 'error',
  ),
})

writeConfig(
  'store-strict',
  {
    ...getRules(
      (rule) => rule.meta.ngrxModule === 'store',
      () => 'error',
    ),
  },
  ['ngrx'],
)

writeConfig(
  'effects-strict',
  {
    ...getRules(
      (rule) => rule.meta.ngrxModule === 'effects',
      () => 'error',
    ),
  },
  ['ngrx'],
)

writeConfig(
  'component-store-strict',
  {
    ...getRules(
      (rule) => rule.meta.ngrxModule === 'component-store',
      () => 'error',
    ),
  },
  ['ngrx'],
)

function writeConfig(
  configName:
    | 'recommended'
    | 'all'
    | 'store'
    | 'effects'
    | 'component-store'
    | 'strict'
    | 'store-strict'
    | 'effects-strict'
    | 'component-store-strict',
  configRules: Record<string, string>,
  plugins = ['ngrx'],
) {
  const code = `
/**
 * DO NOT EDIT
 *
 * This file is automatically generated (as a pre-commit step)
 */

export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: ${JSON.stringify(plugins)},
  rules: ${JSON.stringify(configRules)},
}
`
  const config = format(code, {
    parser: 'typescript',
    ...prettierConfig,
  })
  writeFileSync(join(CONFIG_DIRECTORY, `${configName}.ts`), config)
}
