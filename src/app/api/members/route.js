import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAuthorized } from '@/lib/adminAuth';

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

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  let pass = '';
  for (let i = 0; i < 12; i++) pass += chars[bytes[i] % chars.length];
  return pass;
}

async function sendCredentialsEmail(email, name, password) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vault6studios.com';
  const fromDomain = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const safeName = name
    ? name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : 'Operative';
  const safeEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Vault 6 Studios <${fromDomain}>`,
      to: email,
      subject: 'Your Syndicate Member Credentials',
      html: `
        <div style="background:#050505;color:#fff;font-family:'Courier New',monospace;padding:48px 40px;max-width:580px;margin:0 auto;border:1px solid #1f2937;">
          <p style="color:#2563eb;font-size:10px;text-transform:uppercase;letter-spacing:6px;font-weight:900;margin:0 0 24px;">VAULT 6 STUDIOS // MEMBER ACCESS</p>
          <h1 style="font-size:40px;font-weight:900;letter-spacing:-2px;font-style:italic;color:#fff;margin:0 0 8px;line-height:1;">CREDENTIALS ISSUED.</h1>
          <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-weight:bold;margin:0 0 32px;">CLEARANCE LEVEL: SYNDICATE MEMBER</p>
          <p style="color:#9ca3af;line-height:1.8;font-size:14px;margin:0 0 24px;">
            ${safeName}, your member portal access has been activated.
          </p>
          <div style="background:#111;border:1px solid #1f2937;padding:24px;margin:0 0 32px;">
            <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:4px;margin:0 0 16px;">Login Credentials</p>
            <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;"><strong style="color:#fff;">Email:</strong> ${safeEmail}</p>
            <p style="color:#9ca3af;font-size:13px;margin:0;"><strong style="color:#fff;">Password:</strong> <span style="color:#2563eb;font-size:18px;font-weight:900;letter-spacing:0.1em;">${password}</span></p>
          </div>
          <a href="${siteUrl}/member/login" style="background:#2563eb;color:#fff;padding:16px 32px;font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:4px;text-decoration:none;display:inline-block;">
            ACCESS MEMBER PORTAL →
          </a>
          <div style="margin-top:48px;padding-top:24px;border-top:1px solid #1f2937;">
            <p style="color:#374151;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0;">
              Keep your credentials secure. Do not share them.
            </p>
          </div>
        </div>
      `,
    }),
  });
}

export async function GET(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const members = await readMembers(cfEnv);
    const safe = members.map(({ passwordHash, passwordSalt, ...m }) => m);
    return NextResponse.json({ success: true, members: safe, count: safe.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { email, name } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email.' }, { status: 400 });
    }

    const members = await readMembers(cfEnv);
    if (members.some(m => m.email.toLowerCase() === email.toLowerCase().trim())) {
      return NextResponse.json({ success: false, error: 'Member already exists.' }, { status: 409 });
    }

    const password = generatePassword();
    const { hash, salt } = await hashPassword(password);

    const member = {
      id: Date.now().toString(),
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      phone: null,
      passwordHash: hash,
      passwordSalt: salt,
      status: 'active',
      tier: 'syndicate',
      points: 0,
      totalSpent: 0,
      notes: null,
      joinedAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      lastLoginAt: null,
    };

    members.unshift(member);
    await writeMembers(members, cfEnv);
    sendCredentialsEmail(email, name, password).catch(console.error);

    const { passwordHash, passwordSalt, ...safeMember } = member;
    return NextResponse.json({ success: true, member: safeMember, generatedPassword: password });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, action } = body;
    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Missing id or action.' }, { status: 400 });
    }

    const members = await readMembers(cfEnv);
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 });
    }

    let generatedPassword = null;

    if (action === 'activate') {
      members[idx].status = 'active';
      members[idx].activatedAt = new Date().toISOString();
    } else if (action === 'suspend') {
      members[idx].status = 'suspended';
    } else if (action === 'reset_password') {
      const password = generatePassword();
      const { hash, salt } = await hashPassword(password);
      members[idx].passwordHash = hash;
      members[idx].passwordSalt = salt;
      generatedPassword = password;
      sendCredentialsEmail(members[idx].email, members[idx].name, password).catch(console.error);
    } else if (action === 'set_tier') {
      const validTiers = ['bronze', 'silver', 'gold', 'platinum', 'syndicate'];
      if (!validTiers.includes(body.tier)) {
        return NextResponse.json({ success: false, error: 'Invalid tier.' }, { status: 400 });
      }
      members[idx].tier = body.tier;
    } else if (action === 'update_notes') {
      members[idx].notes = body.notes?.trim() || null;
    } else if (action === 'update_phone') {
      members[idx].phone = body.phone?.trim() || null;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
    }

    await writeMembers(members, cfEnv);
    const { passwordHash, passwordSalt, ...safeMember } = members[idx];
    return NextResponse.json({ success: true, member: safeMember, generatedPassword });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 });

    const members = await readMembers(cfEnv);
    const filtered = members.filter(m => m.id !== id);
    if (filtered.length === members.length) {
      return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 });
    }

    await writeMembers(filtered, cfEnv);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
