// Preferences are optional: blocked storage must not prevent session changes.
export const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Keep the preference in React state for this session.
  }
};
