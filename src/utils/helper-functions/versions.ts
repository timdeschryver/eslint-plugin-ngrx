import semver from 'semver'

const noopVersion = '0.0.0'
const versionsCache = new Map<string, string>()
const satisfiesCache = new Map<string, boolean>()

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
    return ngrxVersion.platformVersion?.replace(/[^\d\.]/g, '')
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
