// Validación de entradas de las Pages Functions (repo público: los ids
// viajan a URLs de Firestore REST y no deben poder inyectar path/query).
// El directorio _lib no genera rutas (prefijo _).

export const isValidCalendarId = (id) =>
  typeof id === 'string' && /^[A-Za-z0-9-]{3,64}$/.test(id);

export const isValidUserId = (id) =>
  typeof id === 'string' && id.length >= 1 && id.length <= 60 && !/[\x00-\x1f<>]/.test(id);

export const badRequest = (error) =>
  new Response(JSON.stringify({ ok: false, error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
