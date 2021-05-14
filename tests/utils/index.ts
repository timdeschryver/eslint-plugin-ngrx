import { resolve } from 'path'
import { RuleTester } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

export function ruleTester() {
  return new RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      project: resolve('./tests/tsconfig.json'),
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  })
}
