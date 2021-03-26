# no-dispatch-in-effects

> This rule disallows dispatching actions as side effects in NgRx Effects.

## Rule Details

An effect should handle actions and map it to a singular action. Each effect should be clear and concise and must be readily understandable as to what it does affect. Dispatching from inside an effect instead (or together with) mapping it to a new a action can result in painfully hard-to-find bugs and is generally considered a bad practice.

Examples of **incorrect** code for this rule:

```ts
export class Effects {

  loadData$ = createEffect(() => this.actions.pipe(
    ofType(loadData),
    exhaustMap(() => this.dataService.getData().pipe(
      tap(response => {
        // ⚠ dispatching another action from an effect
        if (response.condition) {
          this.store.dispatch(anotherAction());
        }
      }),
      map(response => loadDataSuccess(response)),
      catchError(error => loadDataError(error)),
    )),
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Effects {

  loadData$ = createEffect(() => this.actions.pipe(
    ofType(loadData),
    exhaustMap(() => this.dataService.getData().pipe(
      map(response => loadDataSuccess(response)),
      catchError(error => loadDataError(error)),
    )),
  ));

  handleCondition$ = createEffect(() => this.action.pipe(
    ofType(loadDataSuccess),
    filter(response => response.condition),
    exhaustMap(() => this.dataService.getOtherData(
      // handle response from a consequent request
    )),
  ));

  constructor(
    private readonly actions$: Actions,
  ) {}
}
```
