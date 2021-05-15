# No Typed Store

> The global store should not be typed.

## Rule Details

Typing the global `Store` is redundant because selectors are type-safe, so adding the generic state interface while injecting the store is unnecessary.
Providing the wrong type can also result in unexpected type-related problems.

To prevent a misconception that there are multiple stores (and even that multiple stores are injected into the same component, see [No Multiple Global Stores](./no-multiple-global-stores.md)), we only want to inject 1 global store into components, effects, and services.

Examples of **incorrect** code for this rule:

```ts
export class Component {
  data$ = this.store.select(data)

  constructor(private readonly store: Store<{ data: Data }>) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Component {
  data$ = this.store.select(data)

  constructor(private readonly store: Store) {}
}
```
