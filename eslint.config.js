import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Base configuration
  js.configs.recommended,
  
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
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
      '@typescript-eslint/ban-types': 'warn',
      
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
    rules: {
      'no-console': 'off',
    },
  },
];
