const eslintPluginJs = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const { glob } = require('fs');
const { buffer } = require('stream/consumers');

/** @type {import("eslint").Linter.Config} */
module.exports = [
  eslintPluginJs.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        Buffer: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
];
