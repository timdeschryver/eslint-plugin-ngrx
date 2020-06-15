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

<!-- begin base rule list -->

**Key**: :heavy_check_mark: = recommended

| Name                                                                                                                                                                             | Description                                                                                                                    | :heavy_check_mark: |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| [action-hygiene](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/action-hygiene.md)                                                                   | Enforces the use of good action hygiene.                                                                                       | :heavy_check_mark: |
| [avoid-dispatching-multiple-actions-sequentially](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/avoid-dispatching-multiple-actions-sequentially.md) | It is recommended to only dispatch one action at a time.                                                                       | :heavy_check_mark: |
| [no-dispatch-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-dispatch-in-effects.md)                                                   | An Effect should not call store.dispatch                                                                                       | :heavy_check_mark: |
| [no-effect-decorator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effect-decorator.md)                                                         | The createEffect creator function is preferred                                                                                 | :heavy_check_mark: |
| [no-effect-decorator-and-creator](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effect-decorator-and-creator.md)                                 | An Effect should only use the effect creator (`createEffect`) or the effect decorator (`@Effect`), but not both simultaneously | :heavy_check_mark: |
| [no-effects-in-providers](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-effects-in-providers.md)                                                 | An Effect should not be listed as a provider if it is added to the EffectsModule                                               | :heavy_check_mark: |
| [no-multiple-actions-in-effects](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-multiple-actions-in-effects.md)                                   | An Effect should not return multiple actions.                                                                                  | :heavy_check_mark: |
| [no-multiple-stores](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-multiple-stores.md)                                                           | There should only be one store injected                                                                                        | :heavy_check_mark: |
| [no-reducer-in-key-names](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-reducer-in-key-names.md)                                                 | Avoid the word "reducer" in the key names                                                                                      | :heavy_check_mark: |
| [no-typed-store](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/no-typed-store.md)                                                                   | Store should not be typed                                                                                                      | :heavy_check_mark: |
| [on-function-explicit-return-type](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/on-function-explicit-return-type.md)                               | On function should have an explicit return type                                                                                | :heavy_check_mark: |
| [select-style](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/select-style.md)                                                                       | Selectors can be used either with 'select' as a pipeable operator or as a method                                               |                    |
| [use-selector-in-select](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/use-selector-in-select.md)                                                   | Using a selector in a select function is preferred in favor of strings/props drilling                                          | :heavy_check_mark: |

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
    <td align="center"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;" alt=""/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=timdeschryver" title="Code">💻</a> <a href="#ideas-timdeschryver" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-timdeschryver" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=timdeschryver" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jsaguet"><img src="https://avatars0.githubusercontent.com/u/49377434?v=4" width="100px;" alt=""/><br /><sub><b>Julien Saguet</b></sub></a><br /><a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Code">💻</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Tests">⚠️</a> <a href="#ideas-jsaguet" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/timdeschryver/eslint-plugin-ngrx/commits?author=jsaguet" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/StephenCooper"><img src="https://avatars0.githubusercontent.com/u/20125490?v=4" width="100px;" alt=""/><br /><sub><b>Stephen Cooper</b></sub></a><br /><a href="#ideas-StephenCooper" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
