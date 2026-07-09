// Utilidades de exportación: evento de calendario (.ics / Google Calendar)
// para el día definitivo, y CSV con la disponibilidad de todos.
// Funciones puras (salvo download) para poder testearlas sin DOM.

const pad = (n) => String(n).padStart(2, '0');

// dateStr llega en formato toDateString() ("Thu Jul 16 2026")
const toYmd = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};

const nextDayYmd = (dateStr) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};

// Evento de día completo en formato iCalendar (RFC 5545)
export const buildIcs = ({ title, dateStr, url }) => {
  const uid = `${toYmd(dateStr)}-${title.replace(/\W+/g, '')}@kdemos.com`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KDEMOS//kdemos.com//ES',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${toYmd(dateStr)}`,
    `DTEND;VALUE=DATE:${nextDayYmd(dateStr)}`,
    `SUMMARY:${title}`,
    ...(url ? [`URL:${url}`, `DESCRIPTION:${url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

// Enlace "añadir a Google Calendar" para el mismo evento de día completo
export const googleCalendarUrl = ({ title, dateStr }) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toYmd(dateStr)}/${nextDayYmd(dateStr)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// CSV de disponibilidad: una fila por participante, una columna por fecha
// votada por alguien. labels = { available, maybe, notAvailable, participant }
export const buildAvailabilityCsv = (allUsers, labels) => {
  const dates = new Set();
  for (const user of allUsers) {
    const sel = user.selectedDays || {};
    for (const day of [...(sel.green || []), ...(sel.orange || []), ...(sel.red || [])]) {
      dates.add(day);
    }
  }
  const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));

  const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const header = [labels.participant, ...sortedDates].map(cell).join(',');

  const rows = allUsers.map((user) => {
    const sel = user.selectedDays || {};
    const values = sortedDates.map((day) => {
      let value = '';
      if ((sel.green || []).includes(day)) value = labels.available;
      else if ((sel.orange || []).includes(day)) value = labels.maybe;
      else if ((sel.red || []).includes(day)) value = labels.notAvailable;
      const slots = sel.timeSlots?.[day];
      if (value && Array.isArray(slots) && slots.length > 0) {
        value += ` (${slots.map((s) => labels['slot_' + s] || s).join(', ')})`;
      }
      return value;
    });
    return [user.userId, ...values].map(cell).join(',');
  });

  return [header, ...rows].join('\n');
};

// Descarga un contenido como archivo (solo navegador)
export const downloadFile = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
};
