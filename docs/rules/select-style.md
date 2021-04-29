# select-style

> This rule enforces consistent usage of `select` method or `select` operator on the store.

## Rule Details

There are two ways of selecting data from the store, either by using the `this.store.select(selectorFn)` method, or by using the `this.store.pipe(select(selectorFn))` operator. Either way is considered correct , although the first way is preferred as it requires less code and it doesn't require the need to import the `selector` operator. 

Because it's important to keep things consistent, this rule disallows using both across the same codebase.

Examples of **incorrect** code for this rule:

```ts
export class Component {
  someData$ = this.store.select(someData);
  otherData$ = this.store.pipe(select(otherData));
}
```

Examples of **correct** code for this rule:

```ts
export class Component {
  someData$ = this.store.select(someData);
  otherData$ = this.store.select(otherData);
}
```
