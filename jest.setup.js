// Global test setup — runs before every test file

// Global toast mock (used imperatively across the codebase)
global.toast = {
  show: jest.fn(),
  hide: jest.fn(),
  hideAll: jest.fn(),
};

// Silence noisy console.error output from React internals during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('act('))
  ) {
    return;
  }
  originalConsoleError(...args);
};
