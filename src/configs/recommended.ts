export = {
  plugins: ['ngrx'],
  rules: {
    'ngrx/action-hygiene': 'error',
    'ngrx/avoid-dispatching-multiple-actions-sequentially': 'error',
    'ngrx/no-dispatch-in-effects': 'error',
    'ngrx/no-effect-decorator-and-creator': 'error',
    'ngrx/no-effect-decorator': 'error',
    'ngrx/no-effects-in-providers': 'error',
    'ngrx/no-multiple-actions-in-effects': 'error',
    'ngrx/no-multiple-stores': 'error',
    'ngrx/no-reducer-in-key-names': 'error',
    'ngrx/no-typed-store': 'error',
    'ngrx/on-function-explicit-return-type': 'error',
    'ngrx/use-selector-in-select': 'error',
  },
}
