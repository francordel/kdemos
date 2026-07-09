// Marca (o desmarca) el día definitivo de un calendario.
// Cualquiera con el enlace puede hacerlo: KDemos no tiene cuentas y el
// modelo de confianza es el mismo que para votar.
export async function onRequestPost({ request, env }) {
  try {
    const { calendarId, finalDate } = await request.json();

    if (!calendarId) {
      return new Response(JSON.stringify({ ok: false, error: "Falta el ID del calendario" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
    const FIREBASE_API_KEY = env.FIREBASE_API_KEY;

    const base = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}`;

    // Comprobamos que el calendario existe antes de escribir
    const check = await fetch(`${base}?key=${FIREBASE_API_KEY}`);
    if (!check.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Calendario no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // updateMask limita el PATCH al campo finalDate: no toca users ni createdAt
    const url = `${base}?updateMask.fieldPaths=finalDate&key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: { finalDate: { stringValue: finalDate || "" } }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(JSON.stringify({ ok: false, error: errorText }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, finalDate: finalDate || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
