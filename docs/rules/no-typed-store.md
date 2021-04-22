# no-typed-store

> This rule disallows providing typings to the generic Store type.

## Rule Details

Typing the global `Store` is redundant, and selectors are type safe, so mentioning the state interface while injecting the store is unnecessary.
Providing the wrong type can also result in unexpected type-related problems. 

To prevent a misconception that that are multiple stores (and even that multiple stores are injected into the same component), we only want to inject 1 global store into components, effects, and services.

Examples of **incorrect** code for this rule:

```ts
export class Component {

  data$ = this.store.select(data);

  constructor(
    private readonly store: Store<{data: Data}>,
  ) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Component {

  data$ = this.store.select(data);

  constructor(
    private readonly store: Store,
  ) {}
}
```
