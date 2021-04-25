# Use Lifecycle Interface

> Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.

## Rule Details

If a class is using an effect lifecycle hook, it should implement the corresponding interface.
This prevents signature typos, and it's safer if the signature changes in the future.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  ngrxOnInitEffects(): Action {
    return { type: '[Effect] Init' }
  }
}
```

Examples of **correct** code for this rule:

```ts
class Effect implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[Effect] Init' }
  }
}
```

## Further reading

- [Effect lifecycle docs](https://ngrx.io/guide/effects/lifecycle#controlling-effects)
