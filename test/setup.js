// Test setup file for Vitest
import { vi } from 'vitest';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock document methods that might be used
Object.defineProperty(document, 'getElementById', {
  value: vi.fn(() => null)
});

Object.defineProperty(document, 'querySelector', {
  value: vi.fn(() => null)
});

Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn(() => [])
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}; 