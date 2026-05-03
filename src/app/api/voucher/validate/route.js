import { NextResponse } from 'next/server';

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

async function readVouchers(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('vouchers');
    return raw ? JSON.parse(raw) : [];
  }
  try {
    const fs = await import('fs');
    const path = await import('path');
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/vouchers.json'), 'utf8'));
  } catch {
    return [];
  }
}

export async function POST(req) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || cartTotal === undefined) {
      return NextResponse.json({ success: false, error: 'code and cartTotal required.' }, { status: 400 });
    }

    const normalizedCode = String(code).trim().toUpperCase();
    const cfEnv = await getCFEnv();
    const vouchers = await readVouchers(cfEnv);
    const voucher = vouchers.find(v => v.code === normalizedCode);

    if (!voucher) {
      return NextResponse.json({ success: false, error: 'Invalid voucher code.' }, { status: 404 });
    }
    if (!voucher.isActive) {
      return NextResponse.json({ success: false, error: 'Voucher is no longer active.' }, { status: 400 });
    }
    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: 'Voucher has expired.' }, { status: 400 });
    }
    if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ success: false, error: 'Voucher usage limit reached.' }, { status: 400 });
    }
    if (Number(cartTotal) < voucher.minOrder) {
      return NextResponse.json({
        success: false,
        error: `Minimum order of RM${voucher.minOrder.toFixed(2)} required.`,
      }, { status: 400 });
    }

    let discount = 0;
    if (voucher.type === 'percent') {
      discount = Math.round((Number(cartTotal) * voucher.value / 100) * 100) / 100;
    } else {
      discount = Math.min(voucher.value, Number(cartTotal));
    }

    return NextResponse.json({
      success: true,
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      discount,
      description: voucher.description,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
