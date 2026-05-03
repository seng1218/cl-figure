import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { generateToken, storeMemberSession, deleteMemberSession, getMemberSessionToken } from '@/lib/memberAuth';

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

async function writeMembers(members, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('members', JSON.stringify(members));
    return;
  }
  const fs = await import('fs');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'src/data/members.json');
  fs.writeFileSync(filePath, JSON.stringify(members, null, 2));
}

async function verifyPassword(password, storedHash, storedSalt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(storedSalt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashBytes = Buffer.from(hash, 'hex');
  const storedBytes = Buffer.from(storedHash, 'hex');
  if (hashBytes.length !== storedBytes.length) return false;
  return crypto.timingSafeEqual(hashBytes, storedBytes);
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required.' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const members = await readMembers(cfEnv);
    const member = members.find(m => m.email.toLowerCase() === email.toLowerCase().trim());

    // Always run a hash to prevent timing attacks that reveal email existence
    const dummySalt = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const dummyHash = 'a'.repeat(64);
    if (!member) {
      await verifyPassword(password, dummyHash, dummySalt);
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    if (member.status === 'suspended') {
      await verifyPassword(password, dummyHash, dummySalt);
      return NextResponse.json({ ok: false, error: 'Account suspended. Contact support.' }, { status: 403 });
    }

    const valid = await verifyPassword(password, member.passwordHash, member.passwordSalt);
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = generateToken();
    await storeMemberSession(token, member.id, cfEnv);

    const idx = members.findIndex(m => m.id === member.id);
    members[idx].lastLoginAt = new Date().toISOString();
    await writeMembers(members, cfEnv);

    const res = NextResponse.json({ ok: true });
    res.cookies.set('member_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7200,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('Member login error:', err);
    return NextResponse.json({ ok: false, error: 'Login failed.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cfEnv = await getCFEnv();
  const token = getMemberSessionToken(req);
  await deleteMemberSession(token, cfEnv);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('member_session');
  return res;
}
