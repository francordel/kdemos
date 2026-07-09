// Config pública para el cliente: qué features opcionales están activas.
// El client id de Google OAuth es público por diseño (viaja en cada página
// que usa Sign in with Google); no es un secreto.
export async function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({
      googleClientId: env.GOOGLE_CLIENT_ID || null,
      notificationsEnabled: Boolean(env.GOOGLE_CLIENT_ID),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
