# No Multiple Actions In Effects

> This rule disallows mapping to multiple actions in a single Effect.

## Rule Details

An Effect should map one event (action) to a single other action.
An action can result in several other Effects being triggered, or multiple changes in the reducer, in which case the developer might be tempted to map an Effect to several actions. A more understandable approach is to dispatch one "combining" action that describes what happened (a unique event), rather than multiple actions.

Examples of **incorrect** code for this rule:

```ts
export class Effects {
  loadEmployeeList$ = createEffect(() =>
    this.actions.pipe(
      ofType(componentLoaded),
      exhaustMap(() =>
        this.dataService.loadEmployeeList().pipe(
          switchMap((response) => [
            loadEmployeeListSuccess(response),
            loadCompanyList(),
            cleanData(),
          ]),
          catchError((error) => loadEmployeeListError(error)),
        ),
      ),
    ),
  )

  loadCompanyList$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadCompanyList),
      // handle loadCompanyList
    ),
  )

  cleanData$ = createEffect(() =>
    this.actions.pipe(
      ofType(cleanData),
      // handle cleanData
    ),
  )

  constructor(private readonly actions$: Actions) {}
}
```

Examples of **correct** code for this rule:

```ts
// in effect:
export class Effects {
  loadEmployeeList$ = createEffect(() =>
    this.actions.pipe(
      ofType(componentLoaded),
      exhaustMap(() =>
        this.dataService.loadEmployeeList().pipe(
          map((response) => loadEmployeeListSuccess(response)),
          catchError((error) => loadEmployeeListError(error)),
        ),
      ),
    ),
  )

  // use the one dispatched action

  loadCompanyList$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadEmployeeListSuccess),
      // handle loadCompanyList
    ),
  )

  //use the one dispatched action

  cleanData$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadEmployeeListSuccess),
      // handle cleanData
    ),
  )

  constructor(private readonly actions$: Actions) {}
}
```
