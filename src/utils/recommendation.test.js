import {
  detailsForDate,
  scoreForDate,
  slotCountsForDate,
  buildRecommendations
} from './recommendation';

describe('detailsForDate', () => {
  const selections = [
    { userId: 'ana', selectedDays: { green: ['D1'], red: [], orange: ['D2'] } },
    { userId: 'ben', selectedDays: { green: [], red: ['D1'], orange: [] } },
    { userId: 'cid', selectedDays: null } // usuario sin datos: se ignora
  ];

  it('clasifica cada usuario por su voto en la fecha', () => {
    expect(detailsForDate('D1', selections)).toEqual({
      available: ['ana'],
      unavailable: ['ben'],
      maybe: []
    });
    expect(detailsForDate('D2', selections)).toEqual({
      available: [],
      unavailable: [],
      maybe: ['ana']
    });
  });
});

describe('scoreForDate', () => {
  it('pondera disponible=+2, quizás=+1, no disponible=-0.5', () => {
    expect(scoreForDate({ available: ['a', 'b'], maybe: ['c'], unavailable: ['d'] })).toBe(4.5);
    expect(scoreForDate({ available: [], maybe: [], unavailable: ['a'] })).toBe(-0.5);
    expect(scoreForDate({ available: [], maybe: [], unavailable: [] })).toBe(0);
  });
});

describe('slotCountsForDate', () => {
  it('cuenta solo usuarios disponibles/quizás que marcaron franjas', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1'], timeSlots: { D1: ['morning', 'afternoon'] } } },
      { userId: 'ben', selectedDays: { orange: ['D1'], timeSlots: { D1: ['afternoon'] } } },
      { userId: 'cid', selectedDays: { red: ['D1'], timeSlots: { D1: ['morning'] } } }, // rojo: se ignora
      { userId: 'dan', selectedDays: { green: ['D1'] } } // sin franjas: no suma
    ];
    const res = slotCountsForDate('D1', selections);
    expect(res.slotCounts.morning).toBe(1);
    expect(res.slotCounts.afternoon).toBe(2);
    expect(res.slotCounts.night).toBe(0);
    expect(res.bestSlot).toBe('afternoon');
    expect(res.bestSlotCount).toBe(2);
    expect(res.anySlots).toBe(true);
  });

  it('en empate elige la primera franja en el orden definido', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1'], timeSlots: { D1: ['afternoon'] } } },
      { userId: 'ben', selectedDays: { green: ['D1'], timeSlots: { D1: ['morning'] } } }
    ];
    // morning va antes que afternoon en TIME_SLOTS
    expect(slotCountsForDate('D1', selections).bestSlot).toBe('morning');
  });

  it('sin franjas marcadas: bestSlot null y anySlots false', () => {
    const selections = [{ userId: 'ana', selectedDays: { green: ['D1'] } }];
    const res = slotCountsForDate('D1', selections);
    expect(res.bestSlot).toBeNull();
    expect(res.bestSlotCount).toBe(0);
    expect(res.anySlots).toBe(false);
  });
});

describe('buildRecommendations', () => {
  it('filtra puntuaciones no positivas y ordena de mayor a menor', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1', 'D2'], red: ['D3'], orange: [] } },
      { userId: 'ben', selectedDays: { green: ['D1'], orange: ['D2'], red: [] } },
      { userId: 'cid', selectedDays: { green: [], orange: [], red: ['D1'] } }
    ];
    const rec = buildRecommendations(selections);
    // D1 = 2*2 - 0.5 = 3.5 ; D2 = 2 + 1 = 3 ; D3 = -0.5 (excluida)
    expect(rec.map((r) => r.date)).toEqual(['D1', 'D2']);
    expect(rec[0].score).toBe(3.5);
    expect(rec[1].score).toBe(3);
  });

  it('respeta el límite (top-N)', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'], red: [], orange: [] } }
    ];
    expect(buildRecommendations(selections)).toHaveLength(5);
    expect(buildRecommendations(selections, 2)).toHaveLength(2);
  });

  it('incluye la mejor franja de cada fecha recomendada', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1'], red: [], orange: [], timeSlots: { D1: ['night'] } } },
      { userId: 'ben', selectedDays: { green: ['D1'], red: [], orange: [], timeSlots: { D1: ['night'] } } }
    ];
    const [d1] = buildRecommendations(selections);
    expect(d1.bestSlot).toBe('night');
    expect(d1.bestSlotCount).toBe(2);
    expect(d1.counts).toEqual({ yes: 2, no: 0, maybe: 0 });
  });

  it('es retrocompatible con selecciones sin franjas', () => {
    const selections = [
      { userId: 'ana', selectedDays: { green: ['D1'], red: [], orange: [] } }
    ];
    const [d1] = buildRecommendations(selections);
    expect(d1.anySlots).toBe(false);
    expect(d1.bestSlot).toBeNull();
  });
});
