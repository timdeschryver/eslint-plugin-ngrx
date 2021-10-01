# Use Action Creator In Dispatch

> Using an `action creator` in `dispatch` is preferred over `object` or old `Action`.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
store$.dispatch(new CustomAction())

this.store$.dispatch({ type: 'custom' })
```

Examples of **correct** code for this rule:

```ts
store$.dispatch(action)

this.store$.dispatch(bookActions.load())
```
