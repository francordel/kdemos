import { isValidCalendarId, isValidUserId, badRequest } from '../_lib/validate.js';
// Serializa el objeto selectedDays (green/red/orange + timeSlots opcional)
// al formato tipado de Firestore para un usuario.
// extraFields: campos previos a conservar (email/notify de las suscripciones).
function serializeUser(userId, selectedDays, extraFields = {}) {
  const toDayArray = (days) => ({
    arrayValue: { values: (days || []).map((day) => ({ stringValue: day })) }
  });

  const fields = {
    green: toDayArray(selectedDays.green),
    red: toDayArray(selectedDays.red),
    orange: toDayArray(selectedDays.orange)
  };

  // Franjas horarias: mapa fecha -> array de franjas (solo si hay alguna)
  const timeSlots = selectedDays.timeSlots || {};
  const slotFields = {};
  for (const [dateStr, slots] of Object.entries(timeSlots)) {
    if (Array.isArray(slots) && slots.length > 0) {
      slotFields[dateStr] = {
        arrayValue: { values: slots.map((s) => ({ stringValue: s })) }
      };
    }
  }
  if (Object.keys(slotFields).length > 0) {
    fields.timeSlots = { mapValue: { fields: slotFields } };
  }

  const userFields = {
    userId: { stringValue: userId },
    selectedDays: { mapValue: { fields } }
  };
  if (extraFields.email) userFields.email = extraFields.email;
  if (extraFields.notify) userFields.notify = extraFields.notify;

  return { mapValue: { fields: userFields } };
}

// Aviso por email a los demás participantes suscritos. Best-effort: si no hay
// RESEND_API_KEY o falla el envío, el guardado no se ve afectado.
async function notifySubscribers(env, calendarId, voterId, users) {
  if (!env.RESEND_API_KEY) return;

  // Dedupe + tope de destinatarios (anti-abuso en repo público) y saneo del
  // nombre del votante antes de meterlo en el asunto del email.
  const recipients = [...new Set(
    users
      .map((u) => u.mapValue.fields)
      .filter((f) => f.notify?.booleanValue && f.email?.stringValue && f.userId.stringValue !== voterId)
      .map((f) => f.email.stringValue)
  )].slice(0, 20);

  if (recipients.length === 0) return;

  const safeVoter = String(voterId).replace(/[\r\n\t<>]/g, ' ').slice(0, 40);
  const link = `https://kdemos.com/${calendarId}`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || "KDEMOS <avisos@kdemos.com>",
        to: recipients,
        subject: `${safeVoter} ha votado en tu calendario KDEMOS`,
        text: `${safeVoter} acaba de marcar su disponibilidad en el calendario "${calendarId}".\n\nMira cómo va la votación: ${link}\n\nRecibes este aviso porque activaste las notificaciones en ese calendario. Para dejar de recibirlas, entra en el calendario y desactívalas.`,
      }),
    });
  } catch (err) {
    console.error("Notificación fallida:", err.message);
  }
}

export async function onRequestPost({ request, env }) {
    try {
      const { calendarId, userId, selectedDays } = await request.json();

      if (!isValidCalendarId(calendarId)) return badRequest("calendarId inválido");
      if (!isValidUserId(userId)) return badRequest("userId inválido");
  
      if (!calendarId || !userId || !selectedDays) {
        return new Response(JSON.stringify({ ok: false, error: "Datos incompletos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const res = await fetch(url);
      if (!res.ok) {
        return new Response(JSON.stringify({ ok: false, error: "Calendario no encontrado" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const doc = await res.json();
  
      const users = doc.fields?.users?.arrayValue?.values || [];
  
      let updatedUsers = [];
      let userExists = false;
  
      for (const user of users) {
        const fields = user.mapValue.fields;
        const uid = fields.userId.stringValue;

        if (uid === userId) {
          userExists = true;
          // Conserva email/notify si el usuario tenía avisos activados
          updatedUsers.push(serializeUser(userId, selectedDays, { email: fields.email, notify: fields.notify }));
        } else {
          updatedUsers.push(user);
        }
      }

      if (!userExists) {
        updatedUsers.push(serializeUser(userId, selectedDays));
      }
  
      // updateMask limita el PATCH a users/password: sin él, cada guardado
      // borraba el resto de campos del doc (createdAt, finalDate).
      const patchUrl = `${url}&updateMask.fieldPaths=users&updateMask.fieldPaths=password`;
      const patchRes = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            password: doc.fields.password || { stringValue: "" }, // fallback por si se borra accidentalmente
            users: {
              arrayValue: {
                values: updatedUsers
              }
            }
          }
        })
      });
  
      if (!patchRes.ok) {
        let errorText = await patchRes.text();
        return new Response(JSON.stringify({ ok: false, error: errorText }), {
          status: patchRes.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      // Avisa a los suscritos (best-effort, no bloquea la respuesta si falla)
      await notifySubscribers(env, calendarId, userId, updatedUsers);

      return new Response(JSON.stringify({ ok: true, totalUsers: updatedUsers.length }), {
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
  
  