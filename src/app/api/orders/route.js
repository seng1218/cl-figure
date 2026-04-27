import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import seedInventory from '@/data/inventory.json';
import { isAuthorized } from '@/lib/adminAuth';

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
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [...seedInventory];
  }
}

async function writeInventory(inventory, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('inventory', JSON.stringify(inventory));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/inventory.json');
  fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
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

async function writeOrders(orders, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('orders', JSON.stringify(orders));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/orders.json');
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
}

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 10;

// POST /api/orders — create order + decrement stock atomically
export async function POST(req) {
  try {
    const { cart, shipping, paymentMethod } = await req.json();

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

    // Validate stock for all items before touching anything
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

    // Server-side price calculation — never trust client-supplied prices
    const serverItems = cart.map(({ id, quantity }) => {
      const product = inventory.find(p => String(p.id) === String(id));
      return { id, name: product.name, price: product.price, quantity, image: product.image };
    });
    const cartTotal = serverItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal = cartTotal + shippingFee;

    // Decrement stock
    for (const { id, quantity } of cart) {
      const idx = inventory.findIndex(p => String(p.id) === String(id));
      inventory[idx].stock -= quantity;
    }
    await writeInventory(inventory, cfEnv);

    // Persist order
    const orders = await readOrders(cfEnv);
    const orderId = `V6-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentMethod,
      shipping,
      items: serverItems,
      cartTotal,
      shippingFee,
      grandTotal,
    };

    orders.unshift(newOrder);
    await writeOrders(orders, cfEnv);

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order.' }, { status: 500 });
  }
}

// GET /api/orders — admin only, list all orders
export async function GET(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    const orders = await readOrders(cfEnv);
    return NextResponse.json({ success: true, orders, count: orders.length });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load orders.' }, { status: 500 });
  }
}

// PUT /api/orders — admin only, update order status and tracking
export async function PUT(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    const { id, status, courier, trackingNumber } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required.' }, { status: 400 });
    }
    const orders = await readOrders(cfEnv);
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    orders[orderIndex].status = status;
    if (courier !== undefined) orders[orderIndex].courier = courier;
    if (trackingNumber !== undefined) orders[orderIndex].trackingNumber = trackingNumber;

    await writeOrders(orders, cfEnv);

    return NextResponse.json({ success: true, order: orders[orderIndex] });
  } catch (error) {
    console.error('PUT /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order.' }, { status: 500 });
  }
}
