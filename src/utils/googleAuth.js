// Google Identity Services (Sign in with Google) sin Firebase.
// Solo se carga si el backend tiene GOOGLE_CLIENT_ID configurado.

const GIS_SRC = 'https://accounts.google.com/gsi/client';

let gisPromise = null;

// Carga el script de GIS una sola vez
export const loadGis = () => {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google.accounts.id);
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve(window.google.accounts.id);
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity'));
    document.head.appendChild(script);
  });
  return gisPromise;
};

// Renderiza el botón oficial de Google en un contenedor y devuelve una promesa
// que se resuelve con el credential (JWT) cuando el usuario inicia sesión.
export const renderGoogleButton = async (clientId, container, onCredential) => {
  const gis = await loadGis();
  gis.initialize({
    client_id: clientId,
    callback: (response) => onCredential(response.credential),
  });
  gis.renderButton(container, { theme: 'outline', size: 'large', width: 260 });
};

// Extrae el payload de un JWT (sin verificar: la verificación real la hace el
// backend contra Google; esto es solo para mostrar el email en la UI).
export const parseJwtPayload = (jwt) => {
  try {
    const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    ));
  } catch {
    return null;
  }
};
