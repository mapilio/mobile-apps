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
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.test.{js,ts,tsx}'],
      env: { jest: true },
    },
  ],
};
