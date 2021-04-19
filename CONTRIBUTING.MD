# Contributing

Thanks for being willing to contribute!

Working on your first Pull Request? You can learn how from this free series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## Project setup

1. Fork this repository
2. Clone your forked repository
3. Run `npm ci` to install corresponding dependencies
4. Create a branch for your PR named like `pr/your-branch-name` (you can do this through git CLI with `git checkout -b pr/your-branch-name`)

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```bash
> git remote add upstream https://github.com/timdeschryver/eslint-plugin-ngrx.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Committing and Pushing changes

Git hooks are configured on this project when you install dependencies.
The following will be run on every commit:

- Format files automatically (using prettier)
- The recommended configuration will be generated (this is important for when a new rule is added)

## Rule naming conventions

Based on [ESLint's Rule Naming Conventions](https://eslint.org/docs/developer-guide/working-with-rules#rule-naming-conventions), you must follow these rules:

- Use dashes between words;
- Try to keep the name simple and clear;
- If the rule is disallowing something, prefix it with `no-`, for example `no-dispatch-in-effects`;
- If the rule is suggesting to prefer a way of doing something, among other ways, you can **optionally** prefix it with
  `prefer-`, for example `prefer-selector-in-select`;
- If the rule is enforcing the inclusion of something, use a short name without a special prefix, for example,
  `avoid-dispatching-multiple-actions-sequentially`.

## Adding new rules

In the [same way as ESLint](https://eslint.org/docs/developer-guide/working-with-rules),
each rule has three files named with its identifie:

- in the `src/rules` directory: a source file
- in the `tests/rules` directory: a test file
- in the `docs/rules` directory: a Markdown documentation file
- run `npm run g:all` to add the rule to the [README.md](./README.md) and additionally to the needed configuration files

## Modifying rules

A couple of things you need to remember when editing already existing rules:

- If renaming a rule, make sure to update all points mentioned in the
  ["Adding new rules"](#adding-new-rules) section.
- Add tests to cover the changes introduced, no matter if that's
  a bug fix or a new feature.
- While fixing a bug, add a link to the issue above the test case

## Help needed

Please check the [the open issues](https://github.com/timdeschryver/eslint-plugin-ngrx/issues)

Also, please watch the repo and respond to questions/bug reports/feature requests!
Thanks!
