import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

async function readOrders(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('orders');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    const filePath = path.join(process.cwd(), 'src/data/orders.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const cfEnv = await getCFEnv();
    const orders = await readOrders(cfEnv);

    const order = orders.find(o => o.id === id.trim());

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    // Strip PII (Personally Identifiable Information)
    const trackingInfo = {
      id: order.id,
      status: order.status,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      items: order.items.map(item => ({ name: item.name, quantity: item.quantity }))
    };

    return NextResponse.json({ success: true, tracking: trackingInfo });
  } catch (error) {
    console.error('GET /api/track error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve tracking info.' }, { status: 500 });
  }
}
