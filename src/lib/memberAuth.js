import crypto from 'crypto';

const SESSION_TTL = 7200; // 2 hours

if (!global._localMemberSessions) {
  global._localMemberSessions = new Map();
}
const localSessions = global._localMemberSessions;

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getMemberSessionToken(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)member_session=([a-f0-9]{64})/);
  return match ? match[1] : null;
}

export async function storeMemberSession(token, memberId, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put(`member_session:${token}`, memberId, { expirationTtl: SESSION_TTL });
  } else {
    localSessions.set(token, { memberId, expiry: Date.now() + SESSION_TTL * 1000 });
  }
}

export async function deleteMemberSession(token, cfEnv) {
  if (!token) return;
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.delete(`member_session:${token}`);
  } else {
    localSessions.delete(token);
  }
}

export async function getMemberIdFromSession(token, cfEnv) {
  if (!token) return null;
  if (cfEnv?.INVENTORY_KV) {
    return await cfEnv.INVENTORY_KV.get(`member_session:${token}`);
  }
  const entry = localSessions.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    localSessions.delete(token);
    return null;
  }
  return entry.memberId;
}

export async function isMemberAuthorized(req, cfEnv) {
  const token = getMemberSessionToken(req);
  const memberId = await getMemberIdFromSession(token, cfEnv);
  return memberId !== null;
}

export async function getAuthorizedMemberId(req, cfEnv) {
  const token = getMemberSessionToken(req);
  return getMemberIdFromSession(token, cfEnv);
}
