# eslint-plugin-ngrx

## Installation

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

| Name                                                                                                                                                                                  | Description                                                                                                                                                                   | Recommended                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [ngrx/avoid-combining-selectors](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/avoid-combining-selectors.md)                                             | Prefer combining selectors at the selector level with `createSelector`                                                                                                        | :heavy_check_mark:                                  |
| [ngrx/avoid-dispatching-multiple-actions-sequentially](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/avoid-dispatching-multiple-actions-sequentially.md) | It is recommended to only dispatch one action at a time                                                                                                                       | :heavy_check_mark:                                  |
| [ngrx/avoid-mapping-selectors](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/avoid-mapping-selectors.md)                                                 | Prefer mapping a selector at the selector level, in the projector method of `createSelector`                                                                                  | :heavy_check_mark:                                  |
| [ngrx/good-action-hygiene](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/good-action-hygiene.md)                                                         | Enforces the use of good action hygiene                                                                                                                                       | :heavy_check_mark:                                  |
| [ngrx/no-dispatch-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-dispatch-in-effects.md)                                                   | An Effect should not call `store.dispatch`                                                                                                                                    | :heavy_check_mark:                                  |
| [ngrx/no-effect-decorator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effect-decorator.md)                                                         | The createEffect creator function is preferred                                                                                                                                | :heavy_check_mark:                                  |
| [ngrx/no-effect-decorator-and-creator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effect-decorator-and-creator.md)                                 | An Effect should only use the effect creator (`createEffect`) or the effect decorator (`@Effect`), but not both simultaneously                                                | :heavy_check_mark:                                  |
| [ngrx/no-effects-in-providers](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effects-in-providers.md)                                                 | An Effect should not be listed as a provider if it is added to the EffectsModule                                                                                              | :heavy_check_mark:                                  |
| [ngrx/no-multiple-actions-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-multiple-actions-in-effects.md)                                   | An Effect should not return multiple actions                                                                                                                                  | :heavy_check_mark:                                  |
| [ngrx/no-multiple-stores](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-multiple-stores.md)                                                           | There should only be one store injected                                                                                                                                       | :heavy_check_mark:                                  |
| [ngrx/no-reducer-in-key-names](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-reducer-in-key-names.md)                                                 | Avoid the word "reducer" in the reducer key names                                                                                                                             | :heavy_check_mark:                                  |
| [ngrx/no-typed-store](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-typed-store.md)                                                                   | Store should not be typed                                                                                                                                                     | :heavy_check_mark:                                  |
| [ngrx/on-function-explicit-return-type](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/on-function-explicit-return-type.md)                               | On function should have an explicit return type                                                                                                                               | :heavy_check_mark:                                  |
| [ngrx/prefer-inline-action-props](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/prefer-inline-action-props.md)                                           | Prefer using inline types instead of interfaces/classes                                                                                                                       | :heavy_check_mark:                                  |
| [ngrx/select-style](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/select-style.md)                                                                       | Selectors can be used either with 'select' as a pipeable operator or as a method                                                                                              |                                                     |
| [ngrx/use-lifecycle-interface](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/use-lifecycle-interface.md)                                                 | Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods                                                                                | :heavy_check_mark:                                  |
| [ngrx/use-selector-in-select](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/use-selector-in-select.md)                                                   | Using a selector in a select function is preferred in favor of strings/props drilling                                                                                         | :heavy_check_mark:                                  |
| [rxjs/no-cyclic-action](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-cyclic-action.md)                                                                       | This rule effects failures for effects that emit actions that would pass their `ofType` filter. Such actions are cyclic and, upon emission, immediately re-trigger the effect | :heavy_check_mark: (export from eslint-plugin-rxjs) |
| [rxjs/no-unsafe-catch](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-catch.md)                                                                         | Forbids unsafe `catchError` usage in effects                                                                                                                                  | :heavy_check_mark: (export from eslint-plugin-rxjs) |
| [rxjs/no-unsafe-first](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-first.md)                                                                         | Forbids unsafe `first`/`take` usage in effects                                                                                                                                | :heavy_check_mark: (export from eslint-plugin-rxjs) |
| [rxjs/no-unsafe-switchmap](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-switchmap.md)                                                                 | Forbids unsafe `switchMap` usage in effects                                                                                                                                   | :heavy_check_mark: (export from eslint-plugin-rxjs) |

## Migrating from ngrx-tslint-rules

If you were previously using TSLint for your project and especially the `ngrx-tslint-rules` package, you should check out [the migration guide](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/migrating-from-ngrx-tslint-rules.md).
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
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
