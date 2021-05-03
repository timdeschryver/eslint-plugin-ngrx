import { rules } from '../src/rules'
import plugin from '../src'
import recommended from '../src/configs/recommended'

test('exports recommended rules', () => {
  const recommmendedRules = Object.keys(rules)
    .filter((ruleName) => rules[ruleName].meta.docs?.recommended)
    .reduce((acc, ruleName) => {
      acc[`ngrx/${ruleName}`] = rules[ruleName].meta.docs?.recommended
      return acc
    }, {})
  const keyNames = Object.keys(recommended.rules)
  const ngrxRules = keyNames
    .filter((p) => p.startsWith('ngrx'))
    .reduce((acc, key) => {
      acc[key] = recommended.rules[key]
      return acc
    }, {})
  const rxjsRules = keyNames.filter((p) => p.startsWith('rxjs'))

  expect(recommmendedRules).toEqual(ngrxRules)
  expect(rxjsRules).toHaveLength(4)
})

test('exports recommended config', () => {
  expect(Object.keys(plugin.configs)).toEqual(['recommended'])
})
