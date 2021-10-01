import semver from 'semver'

const noopVersion = '0.0.0'
const versionsCache: Map<string, string> = new Map()
const satisfiesCache: Map<string, boolean> = new Map()

function getNgrxVersion(pkg: string): string {
  if (!versionsCache.has(pkg)) {
    const version = readPlatformVersion(pkg)
    versionsCache.set(pkg, version ?? noopVersion)
  }

  return versionsCache.get(pkg) as string
}

function readPlatformVersion(pkg: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ngrxVersion = require(`${pkg}/schematics-core`) as {
      platformVersion?: string
    }
    const version = ngrxVersion.platformVersion
      ?.split('')
      .filter((c) => (c >= '0' && c <= '9') || c === '.')
      .join('')
    return version
  } catch {
    return null
  }
}

// @internal for testing purposes
export function setNgrxVersion(pkg: string, version: string): void {
  versionsCache.set(pkg, version)
}

// @internal for testing purposes
export function clearCache() {
  versionsCache.clear()
  satisfiesCache.clear()
}

function versionSatisfies(pkg: string, version: string) {
  const key = `${pkg}@${version}`

  if (!satisfiesCache.has(key)) {
    satisfiesCache.set(key, semver.satisfies(getNgrxVersion(pkg), version))
  }

  return satisfiesCache.get(key) as boolean
}

export function ngrxVersionSatisfies(pkg: string, version: string): boolean {
  return versionSatisfies(pkg, version)
}
