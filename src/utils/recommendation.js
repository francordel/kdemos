// Lógica pura de recomendación de fechas y franjas horarias.
// Separada del componente para poder testearla de forma aislada.
import { TIME_SLOTS } from '../pages/CalendarUtils';

// Clasifica a cada usuario (por su voto) para una fecha concreta.
export const detailsForDate = (date, allSelections) => {
  const details = { available: [], unavailable: [], maybe: [] };
  allSelections.forEach((user) => {
    const sd = user.selectedDays;
    if (!sd) return;
    if (sd.green?.includes(date)) details.available.push(user.userId);
    else if (sd.red?.includes(date)) details.unavailable.push(user.userId);
    else if (sd.orange?.includes(date)) details.maybe.push(user.userId);
  });
  return details;
};

// Puntuación de una fecha: disponible=+2, quizás=+1, no disponible=-0.5.
export const scoreForDate = (details) =>
  details.available.length * 2 + details.maybe.length * 1 - details.unavailable.length * 0.5;

// Disponibilidad por franja de una fecha. Solo cuentan usuarios disponibles/quizás
// (green u orange) ese día que además hayan marcado franjas.
export const slotCountsForDate = (date, completeSelections) => {
  const slotCounts = {};
  TIME_SLOTS.forEach((s) => { slotCounts[s] = 0; });

  let anySlots = false;
  completeSelections.forEach((user) => {
    const sd = user.selectedDays;
    if (!sd) return;
    const availableThatDay = (sd.green || []).includes(date) || (sd.orange || []).includes(date);
    const userSlots = sd.timeSlots?.[date];
    if (availableThatDay && Array.isArray(userSlots) && userSlots.length) {
      anySlots = true;
      userSlots.forEach((s) => { if (s in slotCounts) slotCounts[s] += 1; });
    }
  });

  let bestSlot = null;
  let bestSlotCount = 0;
  if (anySlots) {
    // Empate: gana la primera franja en el orden de TIME_SLOTS (comparación estricta).
    TIME_SLOTS.forEach((s) => {
      if (slotCounts[s] > bestSlotCount) { bestSlot = s; bestSlotCount = slotCounts[s]; }
    });
  }

  return { slotCounts, bestSlot, bestSlotCount, anySlots };
};

// Construye el ranking de fechas recomendadas a partir de las selecciones de todos.
// Devuelve solo las de puntuación positiva, ordenadas de mayor a menor, hasta `limit`.
export const buildRecommendations = (completeSelections, limit = 5) => {
  const allDates = new Set();
  completeSelections.forEach((user) => {
    if (user.selectedDays) {
      [
        ...(user.selectedDays.green || []),
        ...(user.selectedDays.red || []),
        ...(user.selectedDays.orange || [])
      ].forEach((date) => allDates.add(date));
    }
  });

  return Array.from(allDates)
    .map((date) => {
      const details = detailsForDate(date, completeSelections);
      const score = scoreForDate(details);
      const { slotCounts, bestSlot, bestSlotCount, anySlots } = slotCountsForDate(date, completeSelections);
      return {
        date,
        score,
        counts: {
          yes: details.available.length,
          no: details.unavailable.length,
          maybe: details.maybe.length
        },
        details,
        slotCounts,
        bestSlot,
        bestSlotCount,
        anySlots
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
