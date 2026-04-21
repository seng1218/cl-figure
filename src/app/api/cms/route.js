import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function isAuthorized(req) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_SECRET;
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

export const CMS_DEFAULTS = {
  announcement: { enabled: false, text: '', link: '', type: 'info' },
  hero: { tagline: 'Established 2023', ctaLabel: 'Enter Vault' },
  home: {
    syndicateHeading: 'JOIN THE SYNDICATE.',
    syndicateDescription: 'The highest-tier drops go fast. Submit your email to get early access to new drops before they go public.',
  },
  brands: ['FuRyu', 'Banpresto', 'Taito', 'Bear Panda', 'Alter', 'Animester'],
  ethos: [
    { title: '100% Verified', description: 'No bootlegs. No recasts. Every item is verified against manufacturer records before entering our catalog.' },
    { title: 'Secure Transport', description: 'Figures are packed in impact-resistant casing before dispatch. While we cannot control external couriers, we remain reachable if an item is damaged in transit.' },
    { title: 'Order Tracking', description: 'Your order history is digitized. Track your purchases and collection seamlessly within your dashboard.' },
  ],
  contact: { whatsapp: '' },
  site: { name: 'Vault 6 Studios', tagline: 'by Crafted Legacies' },
};

async function readCMS(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('cms_data');
    if (raw) return { ...CMS_DEFAULTS, ...JSON.parse(raw) };
    return CMS_DEFAULTS;
  }
  const filePath = path.join(process.cwd(), 'src/data/cms.json');
  try {
    const stored = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return { ...CMS_DEFAULTS, ...stored };
  } catch {
    return CMS_DEFAULTS;
  }
}

async function writeCMS(data, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('cms_data', JSON.stringify(data));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/cms.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cfEnv = await getCFEnv();
    const data = await readCMS(cfEnv);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(CMS_DEFAULTS);
  }
}

export async function PUT(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const cfEnv = await getCFEnv();
    const current = await readCMS(cfEnv);
    // Merge at section level — PUT with { section: 'hero', data: {...} }
    const { section, data } = body;
    if (!section || !data) {
      return NextResponse.json({ success: false, error: 'section and data required' }, { status: 400 });
    }
    const updated = { ...current, [section]: data };
    await writeCMS(updated, cfEnv);
    return NextResponse.json({ success: true, cms: updated });
  } catch (err) {
    console.error('CMS PUT error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
