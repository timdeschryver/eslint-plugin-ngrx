const defaultStoreName = '/^(store|store\\$)?$/'

export function readNgRxStoreNameFromSettings(
  settings: Record<string, unknown>,
): string {
  return (settings.ngrxStoreName as string | undefined) || defaultStoreName
}
