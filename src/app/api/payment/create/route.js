import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import seedInventory from '@/data/inventory.json';

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 10;
const HITPAY_BASE = 'https://api.hit-pay.com/v1';

async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

async function readInventory(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('inventory');
    if (raw !== null) return JSON.parse(raw);
    await cfEnv.INVENTORY_KV.put('inventory', JSON.stringify(seedInventory));
    return [...seedInventory];
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/inventory.json'), 'utf8'));
  } catch {
    return [...seedInventory];
  }
}

async function writeInventory(inventory, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('inventory', JSON.stringify(inventory));
    return;
  }
  fs.writeFileSync(path.join(process.cwd(), 'src/data/inventory.json'), JSON.stringify(inventory, null, 2));
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

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { cart, shipping } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty.' }, { status: 400 });
    }

    const required = ['fullName', 'phone', 'address1', 'city', 'postcode', 'state'];
    for (const field of required) {
      if (!shipping?.[field]?.trim()) {
        return NextResponse.json({ success: false, error: `Shipping field "${field}" is required.` }, { status: 400 });
      }
    }

    const cfEnv = await getCFEnv();
    const inventory = await readInventory(cfEnv);

    for (const { id, quantity, name } of cart) {
      const product = inventory.find(p => String(p.id) === String(id));
      if (!product) {
        return NextResponse.json({ success: false, error: `"${name}" is no longer available.` }, { status: 409 });
      }
      if (product.stock < quantity) {
        return NextResponse.json({
          success: false,
          error: `"${product.name}" only has ${product.stock} unit${product.stock === 1 ? '' : 's'} left.`,
          outOfStock: product.id,
        }, { status: 409 });
      }
    }

    const serverItems = cart.map(({ id, quantity }) => {
      const product = inventory.find(p => String(p.id) === String(id));
      return { id, name: product.name, price: product.price, quantity, image: product.image };
    });
    const cartTotal = serverItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal = cartTotal + shippingFee;

    const inventorySnapshot = JSON.stringify(inventory);
    for (const { id, quantity } of cart) {
      const idx = inventory.findIndex(p => String(p.id) === String(id));
      inventory[idx].stock -= quantity;
    }
    await writeInventory(inventory, cfEnv);

    const orderId = `V6-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const orders = await readOrders(cfEnv);
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'awaiting_payment',
      shipping,
      items: serverItems,
      cartTotal,
      shippingFee,
      grandTotal,
    };
    orders.unshift(newOrder);

    try {
      await writeOrders(orders, cfEnv);
    } catch (writeErr) {
      await writeInventory(JSON.parse(inventorySnapshot), cfEnv).catch(() => {});
      throw writeErr;
    }

    const origin = req.headers.get('origin') || req.headers.get('host') || '';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    const hitpayRes = await fetch(`${HITPAY_BASE}/payment-requests`, {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': process.env.HITPAY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: grandTotal.toFixed(2),
        currency: 'MYR',
        name: shipping.fullName,
        phone: shipping.phone,
        redirect_url: `${baseUrl}/checkout/success`,
        webhook: `${baseUrl}/api/payment/webhook`,
        reference_number: orderId,
      }),
    });

    if (!hitpayRes.ok) {
      // HitPay call failed — rollback stock and order
      await writeInventory(JSON.parse(inventorySnapshot), cfEnv).catch(() => {});
      const remainingOrders = orders.filter(o => o.id !== orderId);
      await writeOrders(remainingOrders, cfEnv).catch(() => {});
      const errText = await hitpayRes.text().catch(() => '');
      console.error('HitPay API error:', hitpayRes.status, errText);
      return NextResponse.json({ success: false, error: 'Payment gateway unavailable. Try again.' }, { status: 502 });
    }

    const hitpayData = await hitpayRes.json();
    return NextResponse.json({ success: true, orderId, url: hitpayData.url });
  } catch (error) {
    console.error('POST /api/payment/create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to initiate payment.' }, { status: 500 });
  }
}
