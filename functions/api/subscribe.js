import { isValidCalendarId, isValidUserId, badRequest } from '../_lib/validate.js';
// Activa/desactiva los avisos por email de un participante.
// El email NUNCA lo envía el cliente: se obtiene del idToken de Google
// verificado contra el endpoint oficial de tokeninfo (firma + audience).
export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const { calendarId, userId, idToken, notify } = await request.json();

      if (!isValidCalendarId(calendarId)) return badRequest("calendarId inválido");
      if (!isValidUserId(userId)) return badRequest("userId inválido");

    if (!calendarId || !userId || !idToken) {
      return json({ ok: false, error: "Datos incompletos" }, 400);
    }
    if (!env.GOOGLE_CLIENT_ID) {
      return json({ ok: false, error: "Notificaciones no configuradas" }, 501);
    }

    // Verificación del token con Google (valida firma, expiración y emisor)
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!infoRes.ok) {
      return json({ ok: false, error: "Token inválido" }, 401);
    }
    const info = await infoRes.json();
    if (info.aud !== env.GOOGLE_CLIENT_ID || info.email_verified !== "true" || !info.email) {
      return json({ ok: false, error: "Token no autorizado" }, 401);
    }
    const email = info.email;

    const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
    const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      return json({ ok: false, error: "Calendario no encontrado" }, 404);
    }
    const doc = await res.json();
    const users = doc.fields?.users?.arrayValue?.values || [];

    // Añade email/notify a la entrada del usuario (o crea una vacía si aún no votó)
    let found = false;
    const updated = users.map((user) => {
      const fields = user.mapValue.fields;
      if (fields.userId.stringValue !== userId) return user;
      found = true;
      const newFields = { ...fields };
      if (notify) {
        newFields.email = { stringValue: email };
        newFields.notify = { booleanValue: true };
      } else {
        delete newFields.email;
        delete newFields.notify;
      }
      return { mapValue: { fields: newFields } };
    });

    if (!found) {
      const fields = {
        userId: { stringValue: userId },
        selectedDays: {
          mapValue: {
            fields: {
              green: { arrayValue: { values: [] } },
              red: { arrayValue: { values: [] } },
              orange: { arrayValue: { values: [] } },
            },
          },
        },
      };
      if (notify) {
        fields.email = { stringValue: email };
        fields.notify = { booleanValue: true };
      }
      updated.push({ mapValue: { fields } });
    }

    const patchRes = await fetch(`${url}&updateMask.fieldPaths=users`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { users: { arrayValue: { values: updated } } } }),
    });

    if (!patchRes.ok) {
      return json({ ok: false, error: await patchRes.text() }, patchRes.status);
    }

    return json({ ok: true, email: notify ? email : null });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
