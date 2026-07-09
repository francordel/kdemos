import { parseJwtPayload } from './googleAuth';

describe('parseJwtPayload', () => {
  it('extrae el payload de un JWT válido', () => {
    const payload = { email: 'ana@gmail.com', email_verified: true, name: 'Ana' };
    const jwt = ['h', btoa(JSON.stringify(payload)), 's'].join('.');
    expect(parseJwtPayload(jwt)).toEqual(payload);
  });

  it('soporta base64url (caracteres - y _)', () => {
    const payload = { sub: '12345', email: 'x@y.com' };
    const b64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
    expect(parseJwtPayload(`h.${b64}.s`)).toEqual(payload);
  });

  it('devuelve null con entrada corrupta', () => {
    expect(parseJwtPayload('no-es-un-jwt')).toBeNull();
    expect(parseJwtPayload('')).toBeNull();
  });
});
