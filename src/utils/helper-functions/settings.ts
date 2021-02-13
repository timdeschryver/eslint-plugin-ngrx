export const DEFAULT_STORE_NAMES = ['store', 'store$']

const defaultStoreNamesRegexp = `/^(${DEFAULT_STORE_NAMES.join('|').replace(
  '$',
  '\\$',
)})$/`

export function readNgRxStoreNameFromSettings(
  settings: Record<string, unknown>,
): string {
  return (
    (settings.ngrxStoreName as string | undefined) || defaultStoreNamesRegexp
  )
}
