import * as semver from 'semver'

let ngrxEffectsVersion: string | undefined
function getNgrxEffectsVersion(): string {
  if (ngrxEffectsVersion) return ngrxEffectsVersion

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const effects = require('@ngrx/effects/schematics-core') as {
      platformVersion: string
    }
    // version in file is ^x.x.x, but this isn't valid for semver
    ngrxEffectsVersion = effects.platformVersion?.substr(1)
  } catch (err) {
    ngrxEffectsVersion = '0.0.0'
  }

  return ngrxEffectsVersion ?? '0.0.0'
}

export function ngrxEffectsVersionSatisfies(version: string) {
  return semver.satisfies(getNgrxEffectsVersion(), version)
}
