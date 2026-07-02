import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Recommendation from './Recommendation';

// Mock del acceso a datos (sin red)
const mockFetch = jest.fn();
jest.mock('../services', () => ({
  fetchCalendarSelections: (...args) => mockFetch(...args)
}));

const D15 = new Date(2026, 6, 15).toDateString(); // fecha válida y estable

const renderRec = (props) =>
  render(
    <LanguageProvider>
      <Recommendation calendarId="cal" onClose={() => {}} {...props} />
    </LanguageProvider>
  );

beforeEach(() => {
  localStorage.setItem('calendar-language', 'es'); // etiquetas deterministas
  jest.clearAllMocks();
});

describe('Recommendation (BDD)', () => {
  it('dado que hay disponibilidad con franjas, muestra la fecha, la mejor franja y el desglose', async () => {
    // Given: otro usuario y el actual disponibles ese día, ambos por la tarde
    mockFetch.mockResolvedValue([
      { userId: 'Ben', selectedDays: { green: [D15], red: [], orange: [], timeSlots: { [D15]: ['afternoon'] } } }
    ]);

    // When: se abre la recomendación
    renderRec({
      currentUserName: 'Ana',
      currentUserSelections: { green: [D15], red: [], orange: [], timeSlots: { [D15]: ['afternoon'] } }
    });

    // Then: aparece la mejor franja y el desglose "Por la tarde · 2"
    expect(await screen.findByText(/Mejor franja/)).toBeInTheDocument();
    expect(screen.getAllByText(/Por la tarde/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Por la tarde · 2/)).toBeInTheDocument();
  });

  it('dado que nadie tiene disponibilidad positiva, muestra el estado vacío', async () => {
    // Given: solo un "no disponible"
    mockFetch.mockResolvedValue([]);

    // When
    renderRec({
      currentUserName: 'Ana',
      currentUserSelections: { green: [], red: [D15], orange: [] }
    });

    // Then
    expect(await screen.findByText('No hay fechas disponibles')).toBeInTheDocument();
  });
});
