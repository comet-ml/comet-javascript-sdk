import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  { ignores: ['build/', 'lib/', 'coverage/', 'docs/'] },
  js.configs.recommended,
  prettierRecommended,
  {
    files: ['src/**/*.js', 'test/**/*.js', 'examples/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-unused-vars': ['error', { args: 'none' }]
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: globals.mocha }
  },
  {
    files: ['webpack/**/*.js', 'scripts/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node }
  }
];
