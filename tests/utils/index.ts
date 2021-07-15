import { resolve } from 'path'
import { TSESLint } from '@typescript-eslint/experimental-utils'

export function ruleTester() {
  return new TSESLint.RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      project: resolve('./tests/tsconfig.json'),
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  })
}
