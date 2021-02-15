import { TSESLint } from '@typescript-eslint/experimental-utils'

export const DEFAULT_STORE_NAMES = ['store', 'store$']

const defaultStoreNamesRegexp = `/^(${DEFAULT_STORE_NAMES.join('|').replace(
  '$',
  '\\$',
)})$/`

export function readNgRxStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string {
  return (
    (context.settings.ngrxStoreName as string | undefined) ||
    defaultStoreNamesRegexp
  )
}
