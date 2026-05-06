import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function readMembers(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('members');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/members.json'), 'utf8'));
  } catch {
    return [];
  }
}

async function writeMembers(members, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('members', JSON.stringify(members));
    return;
  }
  fs.writeFileSync(path.join(process.cwd(), 'src/data/members.json'), JSON.stringify(members, null, 2));
}

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

// Razorpay Curlec webhook verification:
// HMAC-SHA256 of the raw request body using RAZORPAY_WEBHOOK_SECRET.
// Signature is sent in the X-Razorpay-Signature header.
function verifyRazorpaySignature(rawBody, signature, webhookSecret) {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Razorpay Curlec webhook: RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Razorpay Curlec sends application/json
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
      console.error('Razorpay Curlec webhook: signature verification failed');
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const data = JSON.parse(rawBody);
    const event = data.event;
    const paymentLink = data.payload?.payment_link?.entity;
    const paymentEntity = data.payload?.payment?.entity;
    const orderId = paymentLink?.reference_id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    const cfEnv = await getCFEnv();
    const orders = await readOrders(cfEnv);
    const idx = orders.findIndex(o => o.id === orderId);

    if (idx !== -1) {
      if (event === 'payment_link.paid') {
        orders[idx].status = 'processing';
        orders[idx].paidAt = new Date().toISOString();
        if (paymentId) orders[idx].paymentId = paymentId;

        // Credit member points and totalSpent
        const order = orders[idx];
        if (order.memberId) {
          try {
            const members = await readMembers(cfEnv);
            const mi = members.findIndex(m => m.id === order.memberId);
            if (mi !== -1) {
              const earned = order.grandTotal || 0;
              members[mi].totalSpent = (members[mi].totalSpent || 0) + earned;
              members[mi].points = (members[mi].points || 0) + Math.floor(earned);
              await writeMembers(members, cfEnv);
            }
          } catch {
            // Non-fatal: member stats may lag
          }
        }
      } else if (event === 'payment_link.cancelled' || event === 'payment_link.expired') {
        orders[idx].status = 'payment_failed';
      }
      await writeOrders(orders, cfEnv);
    } else {
      console.warn(`Razorpay Curlec webhook: order ${orderId} not found`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Razorpay Curlec webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
