export const MODULE_PATHS = {
  ['component-store']: '@ngrx/component-store',
  effects: '@ngrx/effects',
  store: '@ngrx/store',
} as const

export type NGRX_MODULE = keyof typeof MODULE_PATHS
