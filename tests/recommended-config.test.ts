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

  expect(recommmendedRules).toEqual(recommended.rules)
})
