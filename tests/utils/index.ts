import { resolve } from 'path'
import { RuleTester } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

export function ruleTester() {
  return new RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
  })
}
