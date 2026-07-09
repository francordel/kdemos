import { isValidCalendarId, isValidUserId, badRequest } from '../_lib/validate.js';
export async function onRequest({ request, env }) {
    try {
      const method = request.method;
  
      let calendarId;
  
      if (method === 'GET') {
        const url = new URL(request.url);
        calendarId = url.searchParams.get("calendarId");
      } else if (method === 'POST') {
        const body = await request.json();
        calendarId = body.calendarId;
      }

      if (!isValidCalendarId(calendarId)) return badRequest("calendarId inválido");

      if (!calendarId) {
        return new Response(JSON.stringify([]), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const res = await fetch(url);
  
      if (!res.ok) {
        return new Response(JSON.stringify({
          ok: true,
          exists: false,
          users: []
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const doc = await res.json();
  
      const users = doc.fields?.users?.arrayValue?.values || [];
  
      // Parseamos los usuarios desde la representación de Firestore
      const parsedUsers = users.map(user => {
        const fields = user.mapValue.fields;
        const selectedDaysFields = fields.selectedDays.mapValue.fields;

        const selectedDays = {
          green: (selectedDaysFields.green?.arrayValue?.values || []).map(v => v.stringValue),
          red: (selectedDaysFields.red?.arrayValue?.values || []).map(v => v.stringValue),
          orange: (selectedDaysFields.orange?.arrayValue?.values || []).map(v => v.stringValue)
        };

        // Franjas horarias (opcional): mapa fecha -> array de franjas
        const slotFields = selectedDaysFields.timeSlots?.mapValue?.fields;
        if (slotFields) {
          const timeSlots = {};
          for (const [dateStr, val] of Object.entries(slotFields)) {
            timeSlots[dateStr] = (val.arrayValue?.values || []).map(v => v.stringValue);
          }
          selectedDays.timeSlots = timeSlots;
        }

        return {
          userId: fields.userId.stringValue,
          selectedDays
        };
      });
  
      return new Response(JSON.stringify({
        ok: true,
        exists: true,
        users: parsedUsers,
        finalDate: doc.fields?.finalDate?.stringValue || null
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (err) {
      return new Response(JSON.stringify([]), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }