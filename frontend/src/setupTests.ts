import '@testing-library/jest-dom';

// Mock fetch globally for tests
Object.defineProperty(globalThis, 'fetch', {
  value: jest.fn(),
  writable: true,
});
