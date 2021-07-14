# Prefer One Generic In `createForFeatureSelector`

> Prefer using a single generic to define the feature state.

## Rule Details

`createFeatureSelector` is typically used with `forFeature`, which should not be aware about the shape of the Global Store. Most of the time, feature states are lazy-loaded. As such, they only need to know (and care) about their own shape.

Examples of **incorrect** code for this rule:

```ts
const customersFeatureState = createFeatureSelector<
  GlobalStore,
  CustomersFeatureState
>('customers')
```

Examples of **correct** code for this rule:

```ts
const customersFeatureState = createFeatureSelector<CustomersFeatureState>(
  'customers',
)
```
