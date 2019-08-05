import * as path from 'path'
import { RuleTester } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

const parser = path.resolve(
  __dirname,
  '../../node_modules/@typescript-eslint/parser',
)

export function ruleTester() {
  const ruleTester = new RuleTester({
    parser,
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
  })

  return ruleTester
}
