import * as mockDB from './mockDatabase';
import * as firebaseDB from './firebaseDatabase';
import * as cloudflareDB from './cloudflareDatabase';

const mode = process.env.REACT_APP_DB_MODE || 'cloudflare'; // mock | firebase | cloudflare
console.log("🧠 MODO DE BASE DE DATOS ACTIVO:", mode);

const selected = {
  mock: mockDB,
  firebase: firebaseDB,
  cloudflare: cloudflareDB
}[mode];
console.log("🧠 Modo de base de datos activo:", mode);
export const {
  calendarExists,
  createCalendar,
  generateUniqueCalendarId,
  fetchCalendarSelections,
  saveUserSelections
} = selected;

// Día definitivo: con fallback para modos que aún no lo implementen (firebase)
export const fetchCalendarInfo =
  selected.fetchCalendarInfo ||
  (async (calendarId) => ({ users: await selected.fetchCalendarSelections(calendarId), finalDate: null }));

export const setCalendarFinalDate =
  selected.setCalendarFinalDate || (async () => false);

// Notificaciones por email (opcional, requiere GOOGLE_CLIENT_ID en el backend)
export const getPublicConfig =
  selected.getPublicConfig || (async () => ({ googleClientId: null, notificationsEnabled: false }));

export const subscribeNotifications =
  selected.subscribeNotifications || (async () => ({ ok: false, error: 'No disponible' }));

// Helper function to get specific user data from calendar
export const getUserFromCalendar = async (calendarId, userName) => {
  try {
    const allUsers = await fetchCalendarSelections(calendarId);
    const user = allUsers.find(u => u.userId === userName);
    return user || null;
  } catch (error) {
    console.error('Error getting user from calendar:', error);
    return null;
  }
};

