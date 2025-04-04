import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const config = [
  js.configs.recommended,
  ...compat.config({
    ignorePatterns: ['node_modules/**', 'public/**', 'build/**', 'dist/**'],
  }),
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-sort-props': ['warn', {
        callbacksLast: true,
        shorthandFirst: true,
        reservedFirst: true,
      }],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'off',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off', // TypeScript handles this
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2],
      'max-len': ['error', {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
  },
]

export default config
