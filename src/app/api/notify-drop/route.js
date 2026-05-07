import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCFEnv } from '@/lib/inventory';
import { isAuthorized } from '@/lib/adminAuth';

async function readNotifyDrops(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('notify_drops');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    const filePath = path.join(process.cwd(), 'src/data/notify_drops.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

async function writeNotifyDrops(drops, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('notify_drops', JSON.stringify(drops));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/notify_drops.json');
  fs.writeFileSync(filePath, JSON.stringify(drops, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const drops = await readNotifyDrops(cfEnv);
    return NextResponse.json({ success: true, drops, count: drops.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email, productId, productName, website } = await req.json();

    if (website) return NextResponse.json({ success: true });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email.' }, { status: 400 });
    }
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Missing product ID.' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const drops = await readNotifyDrops(cfEnv);

    const alreadyExists = drops.some(
      d => d.email.toLowerCase() === email.toLowerCase() && String(d.productId) === String(productId)
    );
    if (alreadyExists) {
      return NextResponse.json({ success: false, error: 'Already on the list for this drop.' }, { status: 409 });
    }

    drops.unshift({
      id: Date.now().toString(),
      email,
      productId: String(productId),
      productName: productName || 'Unknown Drop',
      addedAt: new Date().toISOString(),
    });

    await writeNotifyDrops(drops, cfEnv);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('notify-drop POST error:', err);
    return NextResponse.json({ success: false, error: 'Failed to register.' }, { status: 500 });
  }
}
