// Merge de las selecciones de UN usuario aplicando solo los cambios de la sesión
// actual sobre el estado del backend (para no pisar votos hechos en otra pestaña
// o por el propio usuario en otro momento).
//
// - backendSelectedDays: lo último guardado en backend { green, red, orange, timeSlots? }
// - localVotes:         estado local de esta sesión { green, red, orange }
// - localTimeSlots:     franjas locales { [dateStr]: [slots] }
// - modifiedDates:      Set|Array de fechas tocadas en esta sesión
//
// Devuelve el objeto listo para guardar: { green, red, orange, timeSlots }.
export const mergeUserSelections = (backendSelectedDays, localVotes, localTimeSlots = {}, modifiedDates = []) => {
  const backend = backendSelectedDays || {};
  const finalSelectedDays = {
    green: [...(backend.green || [])],
    red: [...(backend.red || [])],
    orange: [...(backend.orange || [])]
  };
  const finalTimeSlots = { ...(backend.timeSlots || {}) };

  const findVoteType = (dateStr, votesObj) => {
    for (const [voteType, dates] of Object.entries(votesObj)) {
      if (dates.includes(dateStr)) return voteType;
    }
    return null;
  };

  const dates = modifiedDates instanceof Set ? Array.from(modifiedDates) : (modifiedDates || []);

  dates.forEach((dateStr) => {
    // Quitar la fecha de todos los votos primero
    Object.keys(finalSelectedDays).forEach((voteType) => {
      finalSelectedDays[voteType] = finalSelectedDays[voteType].filter((d) => d !== dateStr);
    });

    const currentVoteType = findVoteType(dateStr, localVotes);
    if (currentVoteType) {
      finalSelectedDays[currentVoteType].push(dateStr);
    }
    // currentVoteType === null => voto en blanco (la fecha queda sin voto)

    // Las franjas solo se conservan en días disponibles/quizás con franjas marcadas
    const localSlots = localTimeSlots?.[dateStr];
    if ((currentVoteType === 'green' || currentVoteType === 'orange') && localSlots && localSlots.length > 0) {
      finalTimeSlots[dateStr] = localSlots;
    } else {
      delete finalTimeSlots[dateStr];
    }
  });

  return { ...finalSelectedDays, timeSlots: finalTimeSlots };
};
