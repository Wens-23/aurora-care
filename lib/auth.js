import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aurora-care-dev-secret-change-me';
const COOKIE_NAME = 'aurora_session';
const ADMIN_COOKIE_NAME = 'aurora_admin_session';

export const ADMIN_ID = process.env.ADMIN_ID || 'admin@aurora_care';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@aurora123';

export function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

export function getSessionUser(req) {
  const token = getCookie(req, COOKIE_NAME);
  if (!token) return null;
  const data = verifySession(token);
  if (!data || data.type !== 'user') return null;
  return data;
}

export function getSessionAdmin(req) {
  const token = getCookie(req, ADMIN_COOKIE_NAME);
  if (!token) return null;
  const data = verifySession(token);
  if (!data || data.type !== 'admin') return null;
  return data;
}

export { COOKIE_NAME, ADMIN_COOKIE_NAME };
