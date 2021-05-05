# Migrating from ngrx-tslint-rules

You will find here the equivalent rule names to ngrx-tslint-rules

## Migrated

| TSLint Rule                                          | ESLint Rule                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| ngrx-action-hygiene                                  | ngrx/good-action-hygiene                             |
| ngrx-avoid-dispatching-multiple-actions-sequentially | ngrx/avoid-dispatching-multiple-actions-sequentially |
| ngrx-effect-creator-and-decorator                    | ngrx/no-effect-decorator-and-creator                 |
| ngrx-no-dispatch-in-effects                          | ngrx/no-dispatch-in-effects                          |
| ngrx-no-effect-decorator                             | ngrx/no-effect-decorator                             |
| ngrx-no-effects-in-providers                         | ngrx/no-effects-in-providers                         |
| ngrx-no-multiple-actions-in-effects                  | ngrx/no-multiple-actions-in-effects                  |
| ngrx-no-multiple-stores                              | ngrx/no-multiple-global-stores                       |
| ngrx-no-reducer-in-key-names                         | ngrx/no-reducer-in-key-names                         |
| ngrx-no-typed-store                                  | ngrx/no-typed-global-store                           |
| ngrx-selector-for-select                             | ngrx/use-selector-in-select                          |
| ngrx-on-reducer-explicit-return-type                 | ngrx/on-function-explicit-return-type                |

## Not migrated

- `ngrx-no-duplicate-action-types` was not migrated and can be managed using `strictActionTypeUniqueness` runtime check in NgRx. See https://github.com/ngrx/platform/pull/2520.
