import { readFileSync, writeFileSync } from 'fs'
import { EOL } from 'os'
import { format, resolveConfig } from 'prettier'
import { rules } from '../src/rules'

const prettierConfig = resolveConfig.sync(__dirname)
const moduleRules = Object.entries(rules).reduce<Record<string, string[][]>>(
  (all, [ruleName, { meta }]) => {
    all[meta.module] = (all[meta.module] ?? []).concat([
      [
        `[ngrx/${ruleName}](${meta.docs?.url})`,
        meta.docs?.description ?? 'TODO',
        meta.type,
        `${meta.docs?.recommended} (${meta.docs?.category})`,
        meta.fixable ? 'Yes' : 'No',
        meta.docs?.suggestion ? 'Yes' : 'No',
        meta.schema.length ? 'Yes' : 'No',
        meta.docs?.requiresTypeChecking ? 'Yes' : 'No',
      ],
    ])
    return all
  },
  {},
)

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

const tableHeader = `| Name | Description | Recommended | Category | Fixable | Has suggestions | Configurable | Requires type information
| --- | --- | --- | --- | --- | --- | --- | --- |`

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
