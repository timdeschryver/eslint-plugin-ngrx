# avoid-dispatching-multiple-actions-sequentially

> This rule promotes disallows dispatching multiple actions one after another.

## Rule Details

An action should be an event which abstracts away the details of store internals.
An action can be a composition of several events, in which case the developer might be tempted to dispatch several actions in sequence. But a better approach is t dispatch one "combining" action, which exactly describes what that event entails, and then map it to several other actions in an Effect

Examples of **incorrect** code for this rule:

```ts
export class Component implement OnInit {
  constructor(
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.store.dispatch(loadEmployeeList());
    this.store.dispatch(loadCompanyList());
    this.store.dispatch(cleanData());
  }
}
```

Examples of **correct** code for this rule:

```ts
// in component code:
export class Component implement OnInit {
  constructor(
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.store.dispatch(componentLoaded());
  }
}

// in effect:
export class Effects {

  loadInitialDataForComponent$ = createEffect(() => this.actions.pipe(
    ofType(componentLoaded),
    switchMap(() => [
      loadEmployeeList();
      loadCompanyList();
      cleanData();
    ]),
  ));

  constructor(
    private readonly actions$: Actions,
  ) {}
}
```

## Further reading

- [Good Action Hygiene with NgRx Mike Ryan](https://www.youtube.com/watch?v=JmnsEvoy-gY)
