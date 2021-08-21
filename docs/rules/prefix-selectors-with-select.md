# Prefix Selectors With Select

> The selector should start with "select", for example "selectThing"

It's recommended prefixing selector function names with the word `select` combined with a description of the value being selected.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
// ⚠ Usage of a selector without any prefix
export const feature = createSelector((state: AppState) => state.feature)

// ⚠ Usage of a selector with a `get` prefix
export const getFeature: MemoizedSelector<any, any> = (state: AppState) =>
  state.feature

// ⚠ Usage of a selector with improper casing
const selectfeature = createFeatureSelector<AppState, FeatureState>(featureKey)
```

Examples of **correct** code for this rule:

```ts
export const selectFeature = createSelector((state: AppState) => state.feature)
export const selectFeature: MemoizedSelector<any, any> = (state: AppState) =>
  state.feature
const selectFeature = createFeatureSelector<FeatureState>(featureKey)
```

## Further reading

- [Redux Style Guide](https://redux.js.org/style-guide/style-guide#name-selector-functions-as-selectthing)
