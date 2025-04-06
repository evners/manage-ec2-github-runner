import eslintPluginJs from '@eslint/js';

/** @type {import("eslint").Linter.Config} */
export default [
  eslintPluginJs.configs.recommended,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
      'no-undef': 'off',
    },
  },
];
