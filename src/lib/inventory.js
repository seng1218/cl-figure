import fs from 'fs';
import path from 'path';
import seedInventory from '@/data/inventory.json';

export async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

export async function readInventory(cfEnv) {
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

export async function writeInventory(inventory, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('inventory', JSON.stringify(inventory));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/inventory.json');
  fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
}
