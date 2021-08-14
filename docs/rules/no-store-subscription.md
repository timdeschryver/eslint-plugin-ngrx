# No Store Subscription

> Don't create a store subscription, prefer to use the async pipe.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
ngOnInit() {
  this.store.select(selectedItems).subscribe(items => {
    this.items = items;
  })
}
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
// in code
selectedItems$ = this.store.select(selectedItems)

// in template
{{ selectedItems$ | async }}
```
