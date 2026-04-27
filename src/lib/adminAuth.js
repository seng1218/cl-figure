import crypto from 'crypto';

const SESSION_TTL = 7200; // 2 hours

// In-memory fallback for local dev — cleared on Worker restart
const localSessions = new Map();

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function sessionCookie(token) {
  const sec = process.env.NODE_ENV !== 'development' ? '; Secure' : '';
  return `admin_session=${token}; HttpOnly${sec}; SameSite=Strict; Max-Age=${SESSION_TTL}; Path=/`;
}

export function clearCookie() {
  const sec = process.env.NODE_ENV !== 'development' ? '; Secure' : '';
  return `admin_session=; HttpOnly${sec}; SameSite=Strict; Max-Age=0; Path=/`;
}

export function getSessionToken(req) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)admin_session=([a-f0-9]{64})/);
  return match ? match[1] : null;
}

export async function storeSession(token, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put(`session:${token}`, '1', { expirationTtl: SESSION_TTL });
  } else {
    localSessions.set(token, Date.now() + SESSION_TTL * 1000);
  }
}

export async function deleteSession(token, cfEnv) {
  if (!token) return;
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.delete(`session:${token}`);
  } else {
    localSessions.delete(token);
  }
}

async function validateSession(token, cfEnv) {
  if (!token) return false;
  if (cfEnv?.INVENTORY_KV) {
    const val = await cfEnv.INVENTORY_KV.get(`session:${token}`);
    return val !== null;
  }
  const expiry = localSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    localSessions.delete(token);
    return false;
  }
  return true;
}

export async function isAuthorized(req, cfEnv) {
  return validateSession(getSessionToken(req), cfEnv);
}
