# Prefer Action Creator In Of Type

> Using an `action creator` in `ofType` is preferred over `string`.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
effectNOK = createEffect(() => this.actions$.pipe(ofType('PING')))

effectNOK1 = createEffect(() =>
  this.actions$.pipe(ofType(BookActions.load, 'PONG')),
)
```

Examples of **correct** code for this rule:

```ts
effectOK = createEffect(() => this.actions$.pipe(ofType(userActions.ping)))

effectOK1 = createEffect(() =>
  this.actions$.pipe(ofType(userActions.ping.type)),
)
```
