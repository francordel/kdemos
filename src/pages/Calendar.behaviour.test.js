import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import Calendar from './Calendar';

// Mock del acceso a datos (sin red). Prefijo "mock" para que jest permita usarlos en la factory.
const mockSave = jest.fn();
const mockGetUser = jest.fn();
const mockFetch = jest.fn();
jest.mock('../services', () => ({
  saveUserSelections: (...a) => mockSave(...a),
  getUserFromCalendar: (...a) => mockGetUser(...a),
  fetchCalendarSelections: (...a) => mockFetch(...a)
}));

const renderCalendar = (entry = '/mycal?name=Ana') =>
  render(
    <LanguageProvider>
      <CustomThemeProvider>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/:calendarId" element={<Calendar />} />
          </Routes>
        </MemoryRouter>
      </CustomThemeProvider>
    </LanguageProvider>
  );

beforeEach(() => {
  localStorage.setItem('calendar-language', 'es');
  jest.clearAllMocks();
  mockFetch.mockResolvedValue([]);
  mockGetUser.mockResolvedValue(null);
  mockSave.mockResolvedValue(true);
});

describe('Calendar — flujo de franjas horarias (BDD)', () => {
  it('marca un día como disponible, elige una franja y la persiste al finalizar', async () => {
    renderCalendar();

    // Vamos al mes siguiente para asegurar que todos los días son futuros (seleccionables)
    const nextBtn = (await screen.findByTestId('NavigateNextIcon')).closest('button');
    fireEvent.click(nextBtn);

    // When: el usuario pulsa el día 15 (mes siguiente => futuro)
    fireEvent.mouseDown(await screen.findByText('15'));

    // And: elige "Disponible"
    fireEvent.click(await screen.findByRole('button', { name: 'Disponible' }));

    // Then: aparecen las franjas -> marca "Por la mañana"
    fireEvent.click(await screen.findByText('Por la mañana'));

    // And: guarda la selección del día
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    // El día muestra el indicador de franjas (🕐 1)
    expect(await screen.findByText(/🕐/)).toBeInTheDocument();

    // When: finaliza -> se persiste (findByRole espera a que el diálogo cierre
    // y MUI quite el aria-hidden del resto de la app)
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar' }));

    await waitFor(() => expect(mockSave).toHaveBeenCalled());
    const [uid, cid, payload] = mockSave.mock.calls[0];
    expect(uid).toBe('Ana');
    expect(cid).toBe('mycal');
    expect(payload.green).toHaveLength(1);
    // La franja "morning" se guarda asociada a ese día
    expect(Object.values(payload.timeSlots)[0]).toEqual(['morning']);
  });

  it('un día "No disponible" no guarda franjas', async () => {
    renderCalendar();

    const nextBtn = (await screen.findByTestId('NavigateNextIcon')).closest('button');
    fireEvent.click(nextBtn);

    fireEvent.mouseDown(await screen.findByText('16'));

    // "No disponible" cierra el diálogo al instante (sin franjas)
    fireEvent.click(await screen.findByRole('button', { name: 'No disponible' }));

    // No debe haber botón Guardar visible tras cerrar
    expect(screen.queryByRole('button', { name: 'Guardar' })).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar' }));

    await waitFor(() => expect(mockSave).toHaveBeenCalled());
    const [, , payload] = mockSave.mock.calls[0];
    expect(payload.red).toHaveLength(1);
    expect(payload.timeSlots).toEqual({});
  });

  it('sin ?name en la URL, pide el nombre antes de continuar', async () => {
    renderCalendar('/mycal');

    // Given: diálogo de bienvenida con "Continuar" deshabilitado
    const continuar = await screen.findByRole('button', { name: 'Continuar' });
    expect(continuar).toBeDisabled();

    // When: escribe su nombre
    fireEvent.change(screen.getByLabelText('Tu nombre'), { target: { value: 'Bob' } });
    expect(continuar).toBeEnabled();

    // And: continúa
    fireEvent.click(continuar);

    // Then: se comprueba el usuario en ese calendario
    await waitFor(() => expect(mockGetUser).toHaveBeenCalledWith('mycal', 'Bob'));
  });
});
