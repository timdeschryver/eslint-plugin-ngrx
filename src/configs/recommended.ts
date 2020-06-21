import { rules } from '../rules'

const recommendedRules = Object.entries(rules).reduce((rules, [key, rule]) => {
  if (rule.meta.docs.recommended !== false) {
    rules['ngrx/' + key] = rule.meta.docs.recommended
  }
  return rules
}, {})

export = {
  plugins: ['ngrx'],
  rules: recommendedRules,
}
