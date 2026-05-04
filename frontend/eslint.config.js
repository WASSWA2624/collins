const { defineConfig } = require('eslint/config');
const globals = require('globals');

const coreConfig = require('eslint-config-expo/flat/utils/core');
const expoConfig = require('eslint-config-expo/flat/utils/expo');
const reactConfig = require('eslint-config-expo/flat/utils/react');
const { jsExtensions } = require('eslint-config-expo/flat/utils/extensions');

const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  // NOTE: We intentionally do NOT include eslint-config-expo's typescript flat config
  // because this project forbids TypeScript (and does not install `typescript`).
  ...coreConfig,
  ...reactConfig,
  ...expoConfig,

  // Align settings and globals for JS-only projects.
  {
    settings: {
      'import/extensions': jsExtensions,
      'import/resolver': {
        node: { extensions: jsExtensions },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
        ErrorUtils: false,
        FormData: false,
        XMLHttpRequest: false,
        alert: false,
        cancelAnimationFrame: false,
        cancelIdleCallback: false,
        clearImmediate: false,
        fetch: false,
        navigator: false,
        process: false,
        requestAnimationFrame: false,
        requestIdleCallback: false,
        setImmediate: false,
        window: false,
        'shared-node-browser': true,
      },
    },
  },

  // Keep formatting conflicts disabled; Prettier is run separately (no eslint-plugin-prettier).
  eslintConfigPrettier,

  // Jest globals for unit tests (avoid `no-undef` for describe/it/expect/jest).
  {
    files: ['src/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      // Test files commonly use anonymous mock components.
      'react/display-name': 'off',
    },
  },

  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // This is a web-HTML oriented rule and is noisy for React Native + mixed-platform JSX.
      'react/no-unescaped-entities': 'off',
      // We use Babel module-resolver aliases; ESLint import resolver isn't configured with those.
      'import/no-unresolved': 'off',
    },
  },
]);


