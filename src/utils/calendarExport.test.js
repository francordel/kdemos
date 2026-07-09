import { buildIcs, googleCalendarUrl, buildAvailabilityCsv } from './calendarExport';

const LABELS = {
  participant: 'Participante',
  available: 'Disponible',
  maybe: 'Quizás',
  notAvailable: 'No disponible',
  slot_morning: 'Por la mañana',
  slot_night: 'Por la noche',
};

describe('buildIcs', () => {
  it('genera un evento de día completo con DTSTART/DTEND correctos', () => {
    const ics = buildIcs({ title: 'Cena del grupo', dateStr: 'Thu Jul 16 2026' });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260716');
    expect(ics).toContain('DTEND;VALUE=DATE:20260717'); // día siguiente (evento all-day)
    expect(ics).toContain('SUMMARY:Cena del grupo');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('cruza fin de mes correctamente en DTEND', () => {
    const ics = buildIcs({ title: 'X', dateStr: 'Fri Jul 31 2026' });
    expect(ics).toContain('DTSTART;VALUE=DATE:20260731');
    expect(ics).toContain('DTEND;VALUE=DATE:20260801');
  });

  it('incluye la URL del calendario si se pasa', () => {
    const ics = buildIcs({ title: 'X', dateStr: 'Thu Jul 16 2026', url: 'https://kdemos.com/abc' });
    expect(ics).toContain('URL:https://kdemos.com/abc');
  });
});

describe('googleCalendarUrl', () => {
  it('genera el enlace de plantilla con el rango de fechas', () => {
    const url = googleCalendarUrl({ title: 'Cena del grupo', dateStr: 'Thu Jul 16 2026' });
    expect(url).toContain('calendar.google.com/calendar/render');
    expect(url).toContain('dates=20260716%2F20260717');
    expect(url).toContain('text=Cena+del+grupo');
  });
});

describe('buildAvailabilityCsv', () => {
  const users = [
    {
      userId: 'Ana',
      selectedDays: {
        green: ['Thu Jul 16 2026'],
        orange: ['Fri Jul 17 2026'],
        red: [],
        timeSlots: { 'Thu Jul 16 2026': ['morning', 'night'] },
      },
    },
    {
      userId: 'Luis',
      selectedDays: { green: [], orange: [], red: ['Thu Jul 16 2026'] },
    },
  ];

  it('crea cabecera con las fechas ordenadas y una fila por participante', () => {
    const csv = buildAvailabilityCsv(users, LABELS);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('"Participante","Thu Jul 16 2026","Fri Jul 17 2026"');
    expect(lines[1]).toContain('"Ana"');
    expect(lines[2]).toContain('"Luis"');
  });

  it('refleja el tipo de voto y las franjas', () => {
    const csv = buildAvailabilityCsv(users, LABELS);
    const ana = csv.split('\n')[1];
    expect(ana).toContain('Disponible (Por la mañana, Por la noche)');
    expect(ana).toContain('"Quizás"');
    const luis = csv.split('\n')[2];
    expect(luis).toContain('"No disponible"');
  });

  it('neutraliza formulas de Excel (CSV injection)', () => {
    const csv = buildAvailabilityCsv(
      [{ userId: '=HYPERLINK("http://evil")', selectedDays: { green: [], orange: [], red: [] } }],
      LABELS
    );
    expect(csv.split('\n')[1].startsWith('"\'=HYPERLINK')).toBe(true);
  });

  it('escapa comillas dobles en nombres', () => {
    const csv = buildAvailabilityCsv(
      [{ userId: 'El "Rubio"', selectedDays: { green: [], orange: [], red: [] } }],
      LABELS
    );
    expect(csv.split('\n')[1]).toBe('"El ""Rubio"""');
  });
});
