// eslint.config.js  (recomendo renomear assim em vez de .eslintrc.js)
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  // JS/TS
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended, prettierConfig],
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['#src', './src']],
          extensions: ['.js', '.mjs', '.cjs', '.ts'],
        },
      },
    },
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'arrow-body-style': ['error', 'as-needed'],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          mjs: 'always',
          cjs: 'always',
          ts: 'never',
        },
      ],
      'import/no-relative-parent-imports': 'off',
      'import/no-unresolved': 'error',
      'import/no-named-as-default': 'off',
      camelcase: 'off',
    },
  },

  // Markdown
  {
    files: ['**/*.md'],
    plugins: { markdown },
    extends: [markdown.configs.recommended],
  },

  // CSS
  {
    files: ['**/*.css'],
    plugins: { css },
    extends: [css.configs.recommended],
  },
]);
