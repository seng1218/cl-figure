import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const key = req.headers.get('x-admin-key');
  if (key && key === process.env.ADMIN_SECRET) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
