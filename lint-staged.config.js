module.exports = {
  '*.{js,ts}': ['eslint --fix', 'prettier --write', 'git add'],
  '*.{json,md}': ['prettier --write', 'git add'],
}
