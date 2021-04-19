# no-duplicate-action-in-reducer

> This rule disallows duplicating action handlers in reducer functions

## Rule Details

An actions is a unique event in the NgRx system, and represents one concrete transition from one value of the application state to another. Per that definition, it does not make sense to have multiple handlers of the same action in a reducer function, even if that represents changes in different, sometimes nested parts of the state. We can use one handler to determine entirely how the state will look after the action has been dispatched.

Examples of **incorrect** code for this rule:

```ts
const reducer = createReducer(
  on(someAction, (state, action) => ({...state, data: payload})),
  on(anotherAction, (state, action) => ({...state, otherData: payload})),
  // handling the same action again to modify some other state
  on(someAction, (state, action) => ({...state, loading: {...state.loading, data: false}})),
);
```

Examples of **correct** code for this rule:

```ts
const reducer = createReducer(
  // handling all data state changes in a single handler
  on(someAction, (state, action) => ({
    ...state,
    data: payload,
    loading: {...state.loading, data: false},
  })),
  on(anotherAction, (state, action) => ({...state, otherData: payload})),
);
```
