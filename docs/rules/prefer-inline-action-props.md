# prefer-inline-action-props

> This rule enforces using inline props when creating actions with the `createAction` function instead of named interfaces/types.

## Rule Details

Lots of actions in an NgRx codebase have props (the action `payload`), and we need to define its type when creating an action. It might seem better to use named interfaces or types when defining those types, but in reality it will obscure their meaning to the developer using them. Actions props are essentially like function arguments, and the function caller needs to know exactly what type of data to provide (which will result in better IDE experience).

Examples of **incorrect** code for this rule:

```ts
export interface User {
  id: number;
  fullName: string;
}
export const addName = createAction('[Users] Add User', props<User>());
```

Examples of **correct** code for this rule:

```ts
export const addName = createAction('[Users] Add User', props<{id: number, fullName: string}>());
```
