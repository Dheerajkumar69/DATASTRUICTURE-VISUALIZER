const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  // Base configuration
  js.configs.recommended,
  
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
        ...require('globals').es2021
      },
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',
      // '@typescript-eslint/ban-types': 'warn', // Removed deprecated rule
      
      // React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      
      // General rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-restricted-globals': 'off',
      'no-loop-func': 'warn',
      'no-constant-condition': 'warn',
      'prefer-const': 'warn',
    },
  },
  
  // JavaScript files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
        ...require('globals').es2021
      },
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-restricted-globals': 'off',
      'no-loop-func': 'warn',
      'no-constant-condition': 'warn',
      'prefer-const': 'warn',
    },
  },
  
  // Test files
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**'],
    languageOptions: {
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
        ...require('globals').jest
      }
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Web Worker files
  {
    files: ['**/*.worker.{ts,js}'],
    languageOptions: {
      globals: {
        ...require('globals').worker,
        self: 'readonly',
        MessageEvent: 'readonly',
        Worker: 'readonly'
      }
    },
    rules: {
      'no-restricted-globals': 'off',
      'no-case-declarations': 'off',
    },
  },
];
