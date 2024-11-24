/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-single'],
      'linebreak-style': ['error', 'unix'],
      'no-undef': 'off',
      'no-console': 'warn',
      'comma-dangle': ['error', 'never'],
      'no-unused-expressions': 'error',
      'no-constant-binary-expression': 'error'
    }
  }
];
