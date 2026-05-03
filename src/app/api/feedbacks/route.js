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

async function readFeedbacks(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('feedbacks');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    const fs = await import('fs');
    const path = await import('path');
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/feedbacks.json'), 'utf8'));
  } catch {
    return [];
  }
}

async function writeFeedbacks(feedbacks, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('feedbacks', JSON.stringify(feedbacks));
    return;
  }
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(path.join(process.cwd(), 'src/data/feedbacks.json'), JSON.stringify(feedbacks, null, 2));
}

export async function GET(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const feedbacks = await readFeedbacks(cfEnv);
    return NextResponse.json({ success: true, feedbacks, count: feedbacks.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, message, rating, type, orderId } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, error: 'name, email, and message are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email.' }, { status: 400 });
    }
    if (message.trim().length > 2000) {
      return NextResponse.json({ success: false, error: 'Message too long (max 2000 chars).' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const feedbacks = await readFeedbacks(cfEnv);

    const feedback = {
      id: crypto.randomBytes(8).toString('hex'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      rating: rating ? Math.min(5, Math.max(1, Number(rating))) : null,
      type: ['general', 'product', 'service', 'complaint', 'suggestion'].includes(type) ? type : 'general',
      orderId: orderId?.trim() || null,
      status: 'new',
      adminNote: null,
      createdAt: new Date().toISOString(),
    };

    feedbacks.unshift(feedback);
    await writeFeedbacks(feedbacks, cfEnv);
    return NextResponse.json({ success: true });
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
    const { id, status, adminNote } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 });

    const feedbacks = await readFeedbacks(cfEnv);
    const idx = feedbacks.findIndex(f => f.id === id);
    if (idx === -1) return NextResponse.json({ success: false, error: 'Feedback not found.' }, { status: 404 });

    if (status && ['new', 'read', 'resolved'].includes(status)) feedbacks[idx].status = status;
    if (adminNote !== undefined) feedbacks[idx].adminNote = adminNote?.trim() || null;

    await writeFeedbacks(feedbacks, cfEnv);
    return NextResponse.json({ success: true, feedback: feedbacks[idx] });
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

    const feedbacks = await readFeedbacks(cfEnv);
    const filtered = feedbacks.filter(f => f.id !== id);
    if (filtered.length === feedbacks.length) {
      return NextResponse.json({ success: false, error: 'Feedback not found.' }, { status: 404 });
    }

    await writeFeedbacks(filtered, cfEnv);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
