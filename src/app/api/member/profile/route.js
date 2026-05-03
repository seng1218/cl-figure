import { NextResponse } from 'next/server';
import { getAuthorizedMemberId } from '@/lib/memberAuth';

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

async function readMembers(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('members');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src/data/members.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

export async function GET(req) {
  const cfEnv = await getCFEnv();
  const memberId = await getAuthorizedMemberId(req, cfEnv);
  if (!memberId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const members = await readMembers(cfEnv);
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 });
    }
    if (member.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Account suspended.' }, { status: 403 });
    }
    const { passwordHash, passwordSalt, ...safe } = member;
    return NextResponse.json({ success: true, member: safe });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
