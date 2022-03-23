module.exports = {
  '*.{js,ts,json,md}': ['prettier --write'],
  '*.{js,ts}': ['eslint --fix', 'prettier --write'],
}
