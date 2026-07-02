// Matchers de jest-dom (toBeInTheDocument, etc.). CRA lo carga automáticamente.
import '@testing-library/jest-dom';

// jsdom no implementa matchMedia (lo usa ThemeContext para el modo oscuro).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
