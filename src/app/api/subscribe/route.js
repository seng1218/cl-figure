import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function isAuthorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const provided = req.headers.get('x-admin-key') || '';
  
  const providedHash = crypto.createHash('sha256').update(provided).digest();
  const secretHash = crypto.createHash('sha256').update(secret).digest();

  return crypto.timingSafeEqual(providedHash, secretHash);
}

async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

async function readSubscribers(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('subscribers');
    return raw ? JSON.parse(raw) : [];
  }
  const filePath = path.join(process.cwd(), 'src/data/subscribers.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('subscribers', JSON.stringify(subscribers));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/subscribers.json');
  fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
}

async function sendWelcomeEmail(email, name) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vault6studios.com';
  const fromDomain = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Vault 6 Studios <${fromDomain}>`,
      to: email,
      subject: 'You\'re In. Welcome to the Syndicate.',
      html: `
        <div style="background:#050505;color:#fff;font-family:'Courier New',monospace;padding:48px 40px;max-width:580px;margin:0 auto;border:1px solid #1f2937;">
          <p style="color:#2563eb;font-size:10px;text-transform:uppercase;letter-spacing:6px;font-weight:900;margin:0 0 24px;">VAULT 6 STUDIOS // SYNDICATE ACCESS</p>
          <h1 style="font-size:40px;font-weight:900;letter-spacing:-2px;font-style:italic;color:#fff;margin:0 0 8px;line-height:1;">ACCESS GRANTED.</h1>
          <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-weight:bold;margin:0 0 32px;">CLEARANCE LEVEL: SYNDICATE</p>
          <p style="color:#9ca3af;line-height:1.8;font-size:14px;margin:0 0 16px;">
            ${name ? `${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')}, you are` : 'You are'} now part of an elite circle of collectors.
            The highest-tier drops hit your inbox before the public ever sees them.
          </p>
          <p style="color:#9ca3af;line-height:1.8;font-size:14px;margin:0 0 40px;">
            Stay locked in. The Vault never sleeps.
          </p>
          <a href="${siteUrl}/shop" style="background:#2563eb;color:#fff;padding:16px 32px;font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:4px;text-decoration:none;display:inline-block;">
            ENTER THE VAULT →
          </a>
          <div style="margin-top:48px;padding-top:24px;border-top:1px solid #1f2937;">
            <p style="color:#374151;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0;">
              You received this because you joined the Syndicate waitlist at vault6studios.com.<br/>
              To unsubscribe, reply with "REVOKE ACCESS".
            </p>
          </div>
        </div>
      `,
    }),
  });
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const cfEnv = await getCFEnv();
    const subscribers = await readSubscribers(cfEnv);
    return NextResponse.json({ success: true, subscribers, count: subscribers.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email, name, website } = await req.json();

    // Honeypot check: If 'website' is filled, it's likely a bot
    if (website) {
      console.warn('Bot subscription attempt blocked via honeypot.');
      return NextResponse.json({ success: true }); // Return 200 to trick the bot
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const subscribers = await readSubscribers(cfEnv);

    const alreadyExists = subscribers.some(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (alreadyExists) {
      return NextResponse.json({ success: false, error: 'Already in the Syndicate.' }, { status: 409 });
    }

    const newSub = {
      id: Date.now().toString(),
      email,
      name: name?.trim() || null,
      joinedAt: new Date().toISOString(),
    };

    subscribers.unshift(newSub);
    await writeSubscribers(subscribers, cfEnv);

    sendWelcomeEmail(email, name).catch(console.error);

    return NextResponse.json({ success: true, count: subscribers.length });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ success: false, error: 'Failed to join. Try again.' }, { status: 500 });
  }
}
