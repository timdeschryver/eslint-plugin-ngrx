import { writeFileSync, readFileSync } from 'fs'
import { EOL } from 'os'
import { format, resolveConfig } from 'prettier'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)

const ngrxRules = Object.entries(rules).map(([ruleName, rule]) => [
  `[ngrx/${ruleName}](${rule.meta.docs?.url})`,
  rule.meta.docs?.description,
  rule.meta.type,
  `${rule.meta.docs?.recommended} (${rule.meta.docs?.category})`,
  rule.meta.fixable ? 'Yes' : 'No',
])

const rxjsRules = [
  [
    '[rxjs/no-cyclic-action](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-cyclic-action.md)',
    'Forbids effects that re-emit filtered actions.',
    'problem',
    'error (Possible Errors)',
    'No',
  ],
  [
    '[rxjs/no-unsafe-catch](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-catch.md)',
    'Forbids unsafe `catchError` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
  ],
  [
    '[rxjs/no-unsafe-first](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-first.md)',
    'Forbids unsafe `first`/`take` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
  ],
  [
    '[rxjs/no-unsafe-switchmap](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-switchmap.md)',
    'Forbids unsafe `switchMap` usage in effects.',
    'problem',
    'error (Possible Errors)',
    'No',
  ],
]

const pluginRules = [...ngrxRules, ...rxjsRules]

const tableHeader = `| Name | Description | Recommended | Category | Fixable |
| --- | --- | --- | --- | --- |`
const tableBody = pluginRules.map((rule) => `|${rule.join('|')}|`).join(EOL)
const table = [tableHeader, tableBody].join(EOL)

const readme = readFileSync('README.md', 'utf-8')
const start = readme.indexOf('<!-- RULES-TABLE:START -->')
const end = readme.indexOf('<!-- RULES-TABLE:END -->')

const newReadme = format(
  `${readme.substring(0, start + '<!-- RULES-TABLE:START -->'.length)}
${table}
${readme.substring(end)}`,
  {
    parser: 'markdown',
    ...prettierConfig,
  },
)

writeFileSync('README.md', newReadme)
