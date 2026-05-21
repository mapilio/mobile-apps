module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier',
  ],
  globals: {
    // toast is injected as an app-level global via react-native-toast-message
    toast: 'readonly',
  },
  rules: {
    'no-console': 'warn',
    // React 17+ new JSX transform — importing React is not required
    'react/react-in-jsx-scope': 'off',
    // Downgraded from error: fixing missing effect deps requires careful per-case
    // review to avoid regressions; tracked as Phase 3 cleanup work
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.test.{js,ts,tsx}'],
      env: { jest: true },
    },
  ],
};
