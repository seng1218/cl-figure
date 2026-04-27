import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

export const CMS_DEFAULTS = {
  announcement: { enabled: false, text: '', link: '', type: 'info' },
  hero: { tagline: 'Established 2023', ctaLabel: 'Enter Vault' },
  home: {
    syndicateHeading: 'JOIN THE SYNDICATE.',
    syndicateDescription: 'The highest-tier drops go fast. Submit your email to get early access to new drops before they go public.',
  },
  brands: ['FuRyu', 'Banpresto', 'Taito', 'Bear Panda', 'Alter', 'Animester'],
  contact: { whatsapp: '' },
  site: { name: 'Vault 6 Studios', tagline: 'by Crafted Legacies' },
  ethos: {
    heading: 'OUR ETHOS.',
    subheading: 'UNCOMPROMISING STANDARDS.',
    values: [
      { title: 'CURATION', desc: 'Every piece is hand-selected. If it isn\'t S-tier, it doesn\'t enter the Vault.' },
      { title: 'AUTHENTICITY', desc: 'Direct sourcing and multi-stage verification. Zero bootlegs, zero exceptions.' },
      { title: 'INTEGRITY', desc: 'Accurate condition reporting. What you see in the Archive is what reaches your hands.' }
    ]
  }
};

async function readCMS(cfEnv) {
  let stored = {};
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('cms_data');
    if (raw) stored = JSON.parse(raw);
  } else {
    const filePath = path.join(process.cwd(), 'src/data/cms.json');
    try { stored = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { stored = {}; }
  }

  // Deep merge: for each top-level section, merge stored section over defaults
  const merged = { ...CMS_DEFAULTS };
  for (const key of Object.keys(CMS_DEFAULTS)) {
    const def = CMS_DEFAULTS[key];
    const src = stored[key];
    if (src === undefined) continue;
    if (Array.isArray(def)) {
      // Arrays: use stored if valid array, else keep default
      merged[key] = Array.isArray(src) ? src : def;
    } else if (def !== null && typeof def === 'object') {
      // Objects: deep merge, preserving default keys that stored doesn't have
      merged[key] = { ...def, ...src };
      // Nested arrays inside objects (e.g. ethos.values)
      for (const subKey of Object.keys(def)) {
        if (Array.isArray(def[subKey]) && !Array.isArray(merged[key][subKey])) {
          merged[key][subKey] = def[subKey];
        }
      }
    } else {
      merged[key] = src;
    }
  }
  // Include any extra keys from stored not in defaults
  for (const key of Object.keys(stored)) {
    if (!(key in merged)) merged[key] = stored[key];
  }
  return merged;
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
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
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
