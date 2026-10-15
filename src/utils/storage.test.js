import { safeGet, safeSet } from './storage';

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

it('reads and saves preferences when storage is available', () => {
  expect(safeGet('theme')).toBeNull();
  safeSet('theme', 'dark');
  expect(safeGet('theme')).toBe('dark');
});

it('ignores errors from storage methods', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError');
  });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError');
  });
  expect(safeGet('theme')).toBeNull();
  expect(() => safeSet('theme', 'dark')).not.toThrow();
});

it('ignores errors when accessing localStorage itself', () => {
  jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError');
  });
  expect(safeGet('theme')).toBeNull();
  expect(() => safeSet('theme', 'dark')).not.toThrow();
});
