import { NextResponse } from 'next/server';
import { isMemberAuthorized } from '@/lib/memberAuth';

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

export async function GET(req) {
  const cfEnv = await getCFEnv();
  const authorized = await isMemberAuthorized(req, cfEnv);
  return authorized
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false }, { status: 401 });
}
