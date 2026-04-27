import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';

async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const cfEnv = await getCFEnv();
    const authorized = await isAuthorized(req, cfEnv);
    if (authorized) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
