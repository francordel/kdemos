import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { CustomThemeProvider, useThemeMode } from './ThemeContext';

// WCAG relative luminance & contrast ratio calculation
function parseHex(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16) / 255,
    g: parseInt(clean.substring(2, 4), 16) / 255,
    b: parseInt(clean.substring(4, 6), 16) / 255,
  };
}

function getLuminance(hex) {
  const { r, g, b } = parseHex(hex);
  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('ThemeContext - Disabled button contrast', () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('provides accessible disabled action button contrast (>= 3:1) in both light and dark modes', () => {
    const TestConsumer = () => {
      const { theme, toggleMode, mode } = useThemeMode();
      return (
        <div>
          <span data-testid="mode">{mode}</span>
          <span data-testid="disabled-text">{theme.palette.action.disabled}</span>
          <span data-testid="disabled-bg">{theme.palette.action.disabledBackground}</span>
          <button onClick={toggleMode}>toggle</button>
        </div>
      );
    };

    // 1. Test Light Mode
    localStorage.setItem('calendar-theme-mode', 'light');
    const { unmount } = render(
      <CustomThemeProvider>
        <TestConsumer />
      </CustomThemeProvider>
    );

    const lightTextColor = screen.getByTestId('disabled-text').textContent;
    const lightBgColor = screen.getByTestId('disabled-bg').textContent;
    const lightRatio = getContrastRatio(lightTextColor, lightBgColor);

    expect(lightRatio).toBeGreaterThanOrEqual(3.0);
    unmount();

    // 2. Test Dark Mode
    localStorage.setItem('calendar-theme-mode', 'dark');
    render(
      <CustomThemeProvider>
        <TestConsumer />
      </CustomThemeProvider>
    );

    const darkTextColor = screen.getByTestId('disabled-text').textContent;
    const darkBgColor = screen.getByTestId('disabled-bg').textContent;
    const darkRatio = getContrastRatio(darkTextColor, darkBgColor);

    expect(darkRatio).toBeGreaterThanOrEqual(3.0);
    // Button background in dark mode must be clearly distinguished from dark paper background (#1E1E1E)
    const darkDialogPaper = '#1E1E1E';
    const darkBgAgainstPaperRatio = getContrastRatio(darkBgColor, darkDialogPaper);
    expect(darkBgAgainstPaperRatio).toBeGreaterThan(1.2);
  });

  it('renders a disabled contained button with theme action styling in dark mode', () => {
    localStorage.setItem('calendar-theme-mode', 'dark');

    const TestButton = () => {
      const { theme } = useThemeMode();
      return (
        <MuiThemeProvider theme={theme}>
          <Button
            variant="contained"
            disabled
            sx={{
              backgroundColor: '#007AFF',
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            Crear
          </Button>
        </MuiThemeProvider>
      );
    };

    render(
      <CustomThemeProvider>
        <TestButton />
      </CustomThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Crear' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('Mui-disabled');
  });
});
