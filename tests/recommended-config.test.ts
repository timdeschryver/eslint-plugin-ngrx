import { rules } from '../src/rules'
import recommended from '../src/configs/recommended'

it('should export recommended rules', () => {
  const recommmendedRules: { [name: string]: false | 'error' | 'warn' } = {}

  Object.keys(rules)
    .filter(
      (ruleName: string) => rules[ruleName].meta.docs.recommended !== false,
    )
    .forEach((ruleName) => {
      recommmendedRules[`ngrx/${ruleName}`] =
        rules[ruleName].meta.docs.recommended
    })

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
