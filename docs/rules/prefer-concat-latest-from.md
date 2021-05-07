# Prefer concatLatestFrom

> Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct action is dispatched.

Using `concatLatestFrom` (a lazy version of `withLatestFrom`) ensures that the selector is only invoked when the effect receives the action.
In contrast to `withLatestFrom` that immediately subscribes whether the action is dispatched yet or not. If that state used by the selector is not initialized yet, you could get an error that you're not expecting.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  detail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ProductDetailPage.loaded),
      // ⚠
      withLatestFrom(this.store.select(selectProducts)),
      mergeMap(([action, products]) => {
        ...
      })
    )
  })
}
```

Examples of **correct** code for this rule:

```ts
class Effect {
  detail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ProductDetailPage.loaded),
      concatLatestFrom(() => this.store.select(selectProducts)),
      mergeMap(([action, products]) => {
        ...
      })
    )
  })
}
```

## Further reading

- [`concatLatestFrom` API](https://ngrx.io/api/effects/concatLatestFrom)
- [Incorporating State](https://ngrx.io/guide/effects#incorporating-state)
