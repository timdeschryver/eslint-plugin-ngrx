# no-typed-store

> This rule disallows providing typings to the generic Store type.

## Rule Details

Typing the `Store` is redundant, and selectors are type safe, so mentioning the `AppState` type when injecting the store is unnecessary,
and if provided wrong can result in unexpected type-related problems. It can also cause a misconception that that are multiple stores, and even that multiple stores are injected into the same component.

Examples of **incorrect** code for this rule:

```ts
export class SomeComponent {

  data$ = this.store.select(data);

  constructor(
    private readonly store: Store<{data: Data}>,
  ) {}
}
```

Examples of **correct** code for this rule:

```ts
export class SomeComponent {

  data$ = this.store.select(data);

  constructor(
    private readonly store: Store,
  ) {}
}
```
