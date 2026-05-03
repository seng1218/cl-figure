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

async function writeVouchers(vouchers, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('vouchers', JSON.stringify(vouchers));
    return;
  }
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(path.join(process.cwd(), 'src/data/vouchers.json'), JSON.stringify(vouchers, null, 2));
}

export async function GET(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const vouchers = await readVouchers(cfEnv);
    return NextResponse.json({ success: true, vouchers });
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
    const { code, type, value, minOrder, maxUses, expiresAt, description } = await req.json();

    if (!code || !type || value === undefined || value === null) {
      return NextResponse.json({ success: false, error: 'code, type, and value are required.' }, { status: 400 });
    }
    if (!['percent', 'fixed'].includes(type)) {
      return NextResponse.json({ success: false, error: 'type must be percent or fixed.' }, { status: 400 });
    }
    if (type === 'percent' && (Number(value) <= 0 || Number(value) > 100)) {
      return NextResponse.json({ success: false, error: 'Percent value must be 1–100.' }, { status: 400 });
    }
    if (type === 'fixed' && Number(value) <= 0) {
      return NextResponse.json({ success: false, error: 'Fixed value must be > 0.' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9_-]{3,20}$/.test(normalizedCode)) {
      return NextResponse.json({ success: false, error: 'Code must be 3–20 chars (A-Z, 0-9, _, -).' }, { status: 400 });
    }

    const vouchers = await readVouchers(cfEnv);
    if (vouchers.some(v => v.code === normalizedCode)) {
      return NextResponse.json({ success: false, error: 'Code already exists.' }, { status: 409 });
    }

    const voucher = {
      id: crypto.randomBytes(8).toString('hex'),
      code: normalizedCode,
      type,
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxUses: maxUses ? Number(maxUses) : null,
      usedCount: 0,
      usedBy: [],
      expiresAt: expiresAt || null,
      isActive: true,
      description: description?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    vouchers.unshift(voucher);
    await writeVouchers(vouchers, cfEnv);
    return NextResponse.json({ success: true, voucher });
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
    const { id, isActive } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 });

    const vouchers = await readVouchers(cfEnv);
    const idx = vouchers.findIndex(v => v.id === id);
    if (idx === -1) return NextResponse.json({ success: false, error: 'Voucher not found.' }, { status: 404 });

    vouchers[idx].isActive = Boolean(isActive);
    await writeVouchers(vouchers, cfEnv);
    return NextResponse.json({ success: true, voucher: vouchers[idx] });
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

    const vouchers = await readVouchers(cfEnv);
    const filtered = vouchers.filter(v => v.id !== id);
    if (filtered.length === vouchers.length) {
      return NextResponse.json({ success: false, error: 'Voucher not found.' }, { status: 404 });
    }

    await writeVouchers(filtered, cfEnv);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
