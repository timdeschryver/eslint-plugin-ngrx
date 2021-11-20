module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-plugin/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    extraFileExtensions: ['.json'],
  },
  ignorePatterns: ['.eslintrc.js', 'coverage'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    // TODO: Use `@typescript-eslint/no-restricted-imports` once https://github.com/typescript-eslint/typescript-eslint/pull/3996 is available.
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@typescript-eslint/experimental-utils/dist/*'],
      },
    ],
    curly: 'error',
  },
}
