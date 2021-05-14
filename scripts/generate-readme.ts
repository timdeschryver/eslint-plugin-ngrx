import { writeFileSync, readFileSync } from 'fs'
import { EOL } from 'os'
import { format, resolveConfig } from 'prettier'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)

const moduleRules = Object.entries(rules).reduce((all, [ruleName, rule]) => {
  all[rule.meta.module] = (all[rule.meta.module] || []).concat([
    [
      `[ngrx/${ruleName}](${rule.meta.docs?.url})`,
      rule.meta.docs?.description ?? 'TODO',
      rule.meta.type,
      `${rule.meta.docs?.recommended} (${rule.meta.docs?.category})`,
      rule.meta.fixable ? 'Yes' : 'No',
      rule.meta.schema.length ? 'Yes' : 'No',
    ],
  ])
  return all
}, {} as Record<string, string[][]>)

moduleRules['effects'] = moduleRules['effects'].concat([
  [
    '[rxjs/no-unsafe-catch](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-catch.md)',
    'Forbids unsafe `catchError` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
    'No',
  ],
  [
    '[rxjs/no-unsafe-first](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-first.md)',
    'Forbids unsafe `first`/`take` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
    'No',
  ],
  [
    '[rxjs/no-unsafe-switchmap](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-switchmap.md)',
    'Forbids unsafe `switchMap` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
    'No',
  ],
])

const tableHeader = `| Name | Description | Recommended | Category | Fixable | Configurable |
| --- | --- | --- | --- | --- | --- |`

const config = Object.entries(moduleRules).map(([module, pluginRules]) => {
  const tableBody = pluginRules.map((rule) => `|${rule.join('|')}|`).join(EOL)
  const table = [tableHeader, tableBody].join(EOL)

  return [`### ${module}`, table].join(EOL)
})

const readme = readFileSync('README.md', 'utf-8')
const start = readme.indexOf('<!-- RULES-CONFIG:START -->')
const end = readme.indexOf('<!-- RULES-CONFIG:END -->')

const newReadme = format(
  `${readme.substring(0, start + '<!-- RULES-CONFIG:START -->'.length)}
${config.join(EOL)}
${readme.substring(end)}`,
  {
    parser: 'markdown',
    ...prettierConfig,
  },
)

writeFileSync('README.md', newReadme)
