import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { generateToken, storeMemberSession } from '@/lib/memberAuth';

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

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash, salt };
}

async function sendWelcomeEmail(email, name) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vault6studios.com';
  const fromDomain = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const safeName = name
    ? name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : 'Operative';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Vault 6 Studios <${fromDomain}>`,
      to: email,
      subject: 'Welcome to the Syndicate.',
      html: `
        <div style="background:#050505;color:#fff;font-family:'Courier New',monospace;padding:48px 40px;max-width:580px;margin:0 auto;border:1px solid #1f2937;">
          <p style="color:#2563eb;font-size:10px;text-transform:uppercase;letter-spacing:6px;font-weight:900;margin:0 0 24px;">VAULT 6 STUDIOS // SYNDICATE ACCESS</p>
          <h1 style="font-size:40px;font-weight:900;letter-spacing:-2px;font-style:italic;color:#fff;margin:0 0 8px;line-height:1;">ACCESS GRANTED.</h1>
          <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-weight:bold;margin:0 0 32px;">CLEARANCE LEVEL: SYNDICATE MEMBER</p>
          <p style="color:#9ca3af;line-height:1.8;font-size:14px;margin:0 0 40px;">
            ${safeName}, you are now part of an elite circle of collectors. The rarest drops, first claim, zero FOMO.
          </p>
          <a href="${siteUrl}/member" style="background:#2563eb;color:#fff;padding:16px 32px;font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:4px;text-decoration:none;display:inline-block;">
            ACCESS YOUR PORTAL →
          </a>
          <div style="margin-top:48px;padding-top:24px;border-top:1px solid #1f2937;">
            <p style="color:#374151;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0;">
              Vault 6 Studios · vault6studios.com
            </p>
          </div>
        </div>
      `,
    }),
  });
}

export async function POST(req) {
  try {
    const { email, name, password, confirmPassword } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ ok: false, error: 'Passwords do not match.' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const members = await readMembers(cfEnv);

    if (members.some(m => m.email.toLowerCase() === email.toLowerCase().trim())) {
      return NextResponse.json({ ok: false, error: 'An account with this email already exists.' }, { status: 409 });
    }

    const { hash, salt } = await hashPassword(password);

    const member = {
      id: Date.now().toString(),
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      passwordHash: hash,
      passwordSalt: salt,
      status: 'active',
      tier: 'syndicate',
      joinedAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    members.unshift(member);
    await writeMembers(members, cfEnv);

    // Auto-login: create session immediately
    const token = generateToken();
    await storeMemberSession(token, member.id, cfEnv);

    sendWelcomeEmail(email, name).catch(console.error);

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
    console.error('Member registration error:', err);
    return NextResponse.json({ ok: false, error: 'Registration failed. Try again.' }, { status: 500 });
  }
}
