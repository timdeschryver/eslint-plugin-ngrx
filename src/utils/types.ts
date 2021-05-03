import { TSESLint } from '@typescript-eslint/experimental-utils'

export type RuleModule = TSESLint.RuleModule<string, unknown[]> & {
  meta: { module: string }
}
