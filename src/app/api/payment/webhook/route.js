import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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

async function readOrders(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('orders');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/orders.json'), 'utf8'));
  } catch {
    return [];
  }
}

async function writeOrders(orders, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('orders', JSON.stringify(orders));
    return;
  }
  fs.writeFileSync(path.join(process.cwd(), 'src/data/orders.json'), JSON.stringify(orders, null, 2));
}

// HitPay webhook verification:
// Sort all fields (except 'hmac') alphabetically, join as "key=value" pairs with "|",
// compute HMAC-SHA256 using the HitPay API key as the secret.
// Docs: https://hit-pay.com/docs.html#webhook-validation
function verifyHitPayHmac(data, apiKey) {
  const { hmac, ...rest } = data;
  if (!hmac) return false;
  const message = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('|');
  const expected = crypto.createHmac('sha256', apiKey).update(message).digest('hex');
  // timingSafeEqual requires equal-length buffers
  if (hmac.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
}

export async function POST(req) {
  try {
    const apiKey = process.env.HITPAY_API_KEY;
    if (!apiKey) {
      console.error('HitPay webhook: HITPAY_API_KEY not configured');
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // HitPay sends application/x-www-form-urlencoded
    const text = await req.text();
    const params = new URLSearchParams(text);
    const data = Object.fromEntries(params.entries());

    if (!verifyHitPayHmac(data, apiKey)) {
      console.error('HitPay webhook: HMAC verification failed');
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const { reference_number, status, payment_id } = data;
    if (!reference_number) {
      return NextResponse.json({ ok: true });
    }

    const cfEnv = await getCFEnv();
    const orders = await readOrders(cfEnv);
    const idx = orders.findIndex(o => o.id === reference_number);

    if (idx !== -1) {
      if (status === 'completed') {
        orders[idx].status = 'processing';
        orders[idx].paidAt = new Date().toISOString();
        if (payment_id) orders[idx].hitpayPaymentId = payment_id;
      } else if (status === 'failed') {
        orders[idx].status = 'payment_failed';
      }
      await writeOrders(orders, cfEnv);
    } else {
      console.warn(`HitPay webhook: order ${reference_number} not found`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('HitPay webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
