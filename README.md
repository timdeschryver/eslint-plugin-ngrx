# eslint-plugin-ngrx

## Installation

### With ng-add

Install and configure the ESLint NgRx Plugin with the `ng-add` command.
This command:

- adds `eslint-plugin-ngrx` as a dev dependency;
- adds the plugin to the ESLint plugins property;
- adds the recommended config to the `extends` property of ESLint;

```bash
ng add eslint-plugin-ngrx
```

### Manual

Install ESLint TypeScript parser

```bash
npm install @typescript-eslint/parser --save-dev
```

Install eslint-plugin-ngrx package

```bash
npm install eslint-plugin-ngrx --save-dev
```

Next, add `eslint-plugin-ngrx` to your ESLint config (for example in `.eslintrc.js`) and configure `parser` and `parserOptions`.

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2019,
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": ["ngrx"],
  "rules": {
    "ngrx/select-style": "error"
  }
}
```

To enable the recommended configuration, add it to your ESLint configuration file.

```json
{
  "extends": ["plugin:ngrx/recommended"]
}
```

## Rules

<!-- DO NOT EDIT, This table is automatically generated (as a pre-commit step) -->
<!-- RULES-CONFIG:START -->

### component-store

| Name                                                                                                                                          | Description                                    | Recommended | Category               | Fixable | Has suggestions | Configurable | Requires type information |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- | ---------------------- | ------- | --------------- | ------------ | ------------------------- |
| [ngrx/updater-explicit-return-type](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/updater-explicit-return-type.md) | `Updater` should have an explicit return type. | problem     | warn (Possible Errors) | No      | No              | No           | No                        |

### effects

| Name                                                                                                                                                                    | Description                                                                                                                       | Recommended | Category                | Fixable | Has suggestions | Configurable | Requires type information |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------- | ------- | --------------- | ------------ | ------------------------- |
| [ngrx/avoid-cyclic-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/avoid-cyclic-effects.md)                                           | Avoid effects that re-emit filtered actions.                                                                                      | suggestion  | error (Possible Errors) | No      | No              | No           | Yes                       |
| [ngrx/no-dispatch-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-dispatch-in-effects.md)                                       | An `Effect` should not call `store.dispatch`.                                                                                     | suggestion  | warn (Possible Errors)  | No      | Yes             | No           | No                        |
| [ngrx/no-effect-decorator-and-creator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-effect-decorator-and-creator.md)                     | An `Effect` should only use the effect creator (`createEffect`) or the effect decorator (`@Effect`), but not both simultaneously. | problem     | error (Possible Errors) | Yes     | Yes             | No           | No                        |
| [ngrx/no-effect-decorator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-effect-decorator.md)                                             | The `createEffect` creator function is preferred.                                                                                 | problem     | warn (Best Practices)   | Yes     | Yes             | No           | No                        |
| [ngrx/no-effects-in-providers](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-effects-in-providers.md)                                     | An `Effect` should not be listed as a provider if it is added to the `EffectsModule`.                                             | problem     | error (Possible Errors) | Yes     | No              | No           | No                        |
| [ngrx/no-multiple-actions-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-multiple-actions-in-effects.md)                       | An `Effect` should not return multiple actions.                                                                                   | problem     | warn (Best Practices)   | No      | No              | No           | Yes                       |
| [ngrx/prefer-action-creator-in-of-type](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-action-creator-in-of-type.md)                   | Using an `action creator` in `ofType` is preferred over `string`.                                                                 | problem     | warn (Best Practices)   | No      | No              | No           | No                        |
| [ngrx/prefer-concat-latest-from](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-concat-latest-from.md)                                 | Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct `Action` is dispatched.  | suggestion  | warn (Possible Errors)  | No      | Yes             | No           | No                        |
| [ngrx/prefer-effect-callback-in-block-statement](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-effect-callback-in-block-statement.md) | A block statement is easier to troubleshoot.                                                                                      | suggestion  | warn (Best Practices)   | Yes     | No              | No           | No                        |
| [ngrx/use-effects-lifecycle-interface](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/use-effects-lifecycle-interface.md)                     | Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.                                   | suggestion  | warn (Best Practices)   | Yes     | No              | No           | No                        |
| [rxjs/no-unsafe-catch](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-catch.md)                                                           | Forbids unsafe `catchError` usage in effects.                                                                                     | problem     | error (Possible Errors) | No      | No              |
| [rxjs/no-unsafe-first](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-first.md)                                                           | Forbids unsafe `first`/`take` usage in effects.                                                                                   | problem     | error (Possible Errors) | No      | No              |
| [rxjs/no-unsafe-switchmap](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-switchmap.md)                                                   | Forbids unsafe `switchMap` usage in effects.                                                                                      | problem     | error (Possible Errors) | No      | No              |

### store

| Name                                                                                                                                                                                    | Description                                                                                                       | Recommended | Category               | Fixable | Has suggestions | Configurable | Requires type information |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------- | ------- | --------------- | ------------ | ------------------------- |
| [ngrx/avoid-combining-selectors](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/avoid-combining-selectors.md)                                                 | Prefer combining selectors at the selector level with `createSelector`.                                           | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/avoid-dispatching-multiple-actions-sequentially](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/avoid-dispatching-multiple-actions-sequentially.md)     | It is recommended to only dispatch one `Action` at a time.                                                        | problem     | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/avoid-duplicate-actions-in-reducer](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/avoid-duplicate-actions-in-reducer.md)                               | A `Reducer` should handle an `Action` once.                                                                       | problem     | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/avoid-mapping-selectors](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/avoid-mapping-selectors.md)                                                     | Avoid to add mapping logic in the component, instead move that logic in the projector method of `createSelector`. | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/good-action-hygiene](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/good-action-hygiene.md)                                                             | Enforces the use of good action hygiene.                                                                          | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/no-multiple-global-stores](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-multiple-global-stores.md)                                                 | There should only be one global store injected.                                                                   | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/no-reducer-in-key-names](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-reducer-in-key-names.md)                                                     | Avoid the word "reducer" in the key names.                                                                        | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/no-store-subscription](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-store-subscription.md)                                                         | Don't create a store subscription, prefer to use the async pipe.                                                  | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/no-typed-global-store](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/no-typed-global-store.md)                                                         | The global store should not be typed.                                                                             | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/on-function-explicit-return-type](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/on-function-explicit-return-type.md)                                   | On function should have an explicit return type.                                                                  | problem     | warn (Possible Errors) | No      | Yes             | No           | No                        |
| [ngrx/prefer-action-creator-in-dispatch](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-action-creator-in-dispatch.md)                                 | Using an `action creator` in `dispatch` is preferred over `object` or old `Action`.                               | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/prefer-action-creator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-action-creator.md)                                                         | Using an `action creator` is preferred over `Action class`.                                                       | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |
| [ngrx/prefer-inline-action-props](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-inline-action-props.md)                                               | Prefer using inline types instead of interfaces/classes.                                                          | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/prefer-one-generic-in-create-for-feature-selector](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefer-one-generic-in-create-for-feature-selector.md) | Prefer using a single generic to define the feature state.                                                        | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/prefix-selectors-with-select](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/prefix-selectors-with-select.md)                                           | The selector should start with "select", for example "selectThing".                                               | suggestion  | warn (Best Practices)  | No      | Yes             | No           | No                        |
| [ngrx/select-style](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/select-style.md)                                                                           | Selectors can be used either with `select` as a pipeable operator or as a method.                                 | problem     | warn (Best Practices)  | Yes     | No              | Yes          | No                        |
| [ngrx/use-consistent-global-store-name](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/use-consistent-global-store-name.md)                                   | Use a consistent name for the global store.                                                                       | suggestion  | warn (Best Practices)  | No      | Yes             | Yes          | No                        |
| [ngrx/use-selector-in-select](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules/use-selector-in-select.md)                                                       | Using a selector in a `select` method is preferred over `string` or `props drilling`.                             | suggestion  | warn (Best Practices)  | No      | No              | No           | No                        |

<!-- RULES-CONFIG:END -->

## Configurations

| Name                                        | Description                              |
| ------------------------------------------- | ---------------------------------------- |
| [recommended](./src/configs/recommended.ts) | The recommended config                   |
| [store](./src/configs/store.ts)             | Only the recommended global store config |
| [effects](./src/configs/effects.ts)         | Only the recommended effects config      |
| [all](./src/configs/all.ts)                 | All rules are enabled                    |
| [strict](./src/configs/strict.ts)           | All rules are enable and give errors     |

## Migrating from ngrx-tslint-rules

If you were previously using TSLint for your project and especially the `ngrx-tslint-rules` package, you should check out [the migration guide](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/migrating-from-ngrx-tslint-rules.md).
You will find out how to replace the previous TSLint rule names by the new ESLint ones.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=timdeschryver" title="Code">💻</a> <a href="#ideas-timdeschryver" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-timdeschryver" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=timdeschryver" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jsaguet"><img src="https://avatars0.githubusercontent.com/u/49377434?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julien Saguet</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Code">💻</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Tests">⚠️</a> <a href="#ideas-jsaguet" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/StephenCooper"><img src="https://avatars0.githubusercontent.com/u/20125490?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stephen Cooper</b></sub></a><br /><a href="#ideas-StephenCooper" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/patoncrispy"><img src="https://avatars0.githubusercontent.com/u/2559414?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Paton</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=patoncrispy" title="Code">💻</a></td>
    <td align="center"><a href="https://www.semasquare.com/"><img src="https://avatars3.githubusercontent.com/u/7915599?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastian Weigel</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=Legiew" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rafaelss95"><img src="https://avatars0.githubusercontent.com/u/11965907?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rafael Santana</b></sub></a><br /><a href="#ideas-rafaelss95" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=rafaelss95" title="Code">💻</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=rafaelss95" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Armenvardanyan95"><img src="https://avatars.githubusercontent.com/u/20133025?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Armen Vardanyan</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=Armenvardanyan95" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=MichaelDeBoey" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/david-shortman"><img src="https://avatars.githubusercontent.com/u/25187726?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=david-shortman" title="Documentation">📖</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/pulls?q=is%3Apr+reviewed-by%3Adavid-shortman" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/qirex"><img src="https://avatars.githubusercontent.com/u/3652328?v=4?s=100" width="100px;" alt=""/><br /><sub><b>qirex</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=qirex" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Plondrein"><img src="https://avatars.githubusercontent.com/u/7114556?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dominik</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=Plondrein" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/dangrussell"><img src="https://avatars.githubusercontent.com/u/4387475?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dan Russell</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=dangrussell" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ValentinBossi"><img src="https://avatars.githubusercontent.com/u/19373754?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Valentin</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/pulls?q=is%3Apr+reviewed-by%3AValentinBossi" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/prince-chrismc"><img src="https://avatars.githubusercontent.com/u/16867443?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Mc</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=prince-chrismc" title="Code">💻</a> <a href="#ideas-prince-chrismc" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
