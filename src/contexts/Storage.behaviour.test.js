import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomThemeProvider, useThemeMode } from './ThemeContext';
import { LanguageProvider, useLanguage } from './LanguageContext';

const Preferences = () => {
  const { mode, toggleMode } = useThemeMode();
  const { language, changeLanguage } = useLanguage();
  return (
    <>
      <button onClick={toggleMode}>Theme: {mode}</button>
      <button onClick={() => changeLanguage('fr')}>Language: {language}</button>
    </>
  );
};

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.matchMedia = jest.fn(() => ({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError');
  });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

it('loads preferences and supports session changes when storage is blocked', () => {
  render(
    <LanguageProvider>
      <CustomThemeProvider><Preferences /></CustomThemeProvider>
    </LanguageProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Theme: dark' }));
  expect(screen.getByRole('button', { name: 'Theme: light' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Language:/ }));
  expect(screen.getByRole('button', { name: 'Language: fr' })).toBeInTheDocument();
});

it('uses the language from the URL even when saving it is blocked', () => {
  window.history.replaceState({}, '', '/?lang=de');
  const Language = () => <span>{useLanguage().language}</span>;
  render(<LanguageProvider><Language /></LanguageProvider>);
  expect(screen.getByText('de')).toBeInTheDocument();
});
