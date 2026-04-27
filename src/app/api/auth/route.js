import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { generateToken, storeSession, deleteSession, getSessionToken, sessionCookie, clearCookie } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

export async function POST(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return NextResponse.json({ ok: false }, { status: 500 });

  const provided = req.headers.get('x-admin-key') || '';
  const providedHash = crypto.createHash('sha256').update(provided).digest();
  const secretHash = crypto.createHash('sha256').update(secret).digest();

  if (!crypto.timingSafeEqual(providedHash, secretHash)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cfEnv = await getCFEnv();
  const token = generateToken();
  await storeSession(token, cfEnv);

  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', sessionCookie(token));
  return res;
}

// Logout — deletes KV session and expires cookie
export async function DELETE(req) {
  const cfEnv = await getCFEnv();
  const token = getSessionToken(req);
  await deleteSession(token, cfEnv);
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', clearCookie());
  return res;
}
