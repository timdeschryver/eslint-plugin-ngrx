# Avoid Combining Selectors

> Prefer combining selectors at the selector level with `createSelector`

## Rule Details

A selector is a pure function that is used to derive state.
Because a selector is a pure function (and a synchronous function), a selector is easy to test.

That's why it's recommended to build a view model by composing multiple selectors into one selector, instead of consuming multiple selector observable streams to create a view model in the component.

Examples of **incorrect** code for this rule:

```ts
export class Component {
  vm$ = combineLatest(
    this.store.select(selectCustomers),
    this.store.select(selectOrders),
  )
}
```

Examples of **correct** code for this rule:

```ts
// in selectors.ts:
export selectCustomersAndOrders = createSelector(
  selectCustomers,
  selectOrders,
  (customers, orders) => [customers, orders] // or some other combining logic
)

// in component:
export class Component {
  vm$ = this.store.select(selectCustomersAndOrders);
}
```

## Further reading

- [Maximizing and Simplifying Component Views with NgRx Selectors - by Brandon Roberts](https://brandonroberts.dev/blog/posts/2020-12-14-maximizing-simplifying-component-views-ngrx-selectors/#building-view-models)
