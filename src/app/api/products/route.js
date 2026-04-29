import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import seedInventory from '@/data/inventory.json';
import { isAuthorized } from '@/lib/adminAuth';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Returns Cloudflare env bindings when running on Workers, null in local dev
async function getCFEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return null;
  }
}

// Upload an image file — R2 on Cloudflare, local /public/uploads in dev
async function saveFile(file, cfEnv) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) throw new Error('Invalid file type.');
  if (file.size > MAX_FILE_SIZE) throw new Error('File exceeds 10 MB limit.');
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const uid = Math.random().toString(36).substring(2, 8);
  const filename = `${Date.now()}-${uid}-${safeFilename}`;

  if (cfEnv?.UPLOADS_BUCKET) {
    const r2PublicUrl = process.env.R2_PUBLIC_URL;
    if (!r2PublicUrl) throw new Error('R2_PUBLIC_URL is not configured. Set it via: wrangler secret put R2_PUBLIC_URL');
    const bytes = await file.arrayBuffer();
    await cfEnv.UPLOADS_BUCKET.put(filename, bytes, {
      httpMetadata: { contentType: file.type }
    });
    return `${r2PublicUrl}/${filename}`;
  }

  // Local dev fallback
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

// Read inventory — KV on Cloudflare, local JSON file in dev, static seed as fallback
async function readInventory(cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    const raw = await cfEnv.INVENTORY_KV.get('inventory');
    if (raw !== null) return JSON.parse(raw);
    // KV empty on first deploy — seed from bundled JSON
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

// Write inventory — KV on Cloudflare, local JSON file in dev
async function writeInventory(inventory, cfEnv) {
  if (cfEnv?.INVENTORY_KV) {
    await cfEnv.INVENTORY_KV.put('inventory', JSON.stringify(inventory));
    return;
  }
  const filePath = path.join(process.cwd(), 'src/data/inventory.json');
  fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cfEnv = await getCFEnv();
    const inventory = await readInventory(cfEnv);
    return NextResponse.json(inventory);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load inventory." }, { status: 500 });
  }
}

export async function POST(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const formData = await req.formData();

    // Primary image
    const file = formData.get('image');
    let imageUrl = "https://via.placeholder.com/400x500";
    if (file && file.size > 0) imageUrl = await saveFile(file, cfEnv);

    // Additional images
    const extraFiles = formData.getAll('additionalImages').filter(f => f && f.size > 0);
    const extraPaths = await Promise.all(extraFiles.map(f => saveFile(f, cfEnv)));
    const images = [imageUrl, ...extraPaths];

    const inventory = await readInventory(cfEnv);
    const newIdStr = inventory.length > 0
      ? (Math.max(...inventory.map(item => parseInt(item.id))) + 1).toString()
      : "1";

    const newItem = {
      id: newIdStr,
      name: formData.get('name') || "Unknown Item",
      manufacturer: formData.get('manufacturer') || "Unknown Manufacturer",
      series: formData.get('series') || "Unknown Series",
      price: parseFloat(formData.get('price')) || 0,
      stock: parseInt(formData.get('stock')) || 1,
      scale: formData.get('scale') || "1/7",
      image: imageUrl,
      images,
      category: formData.get('category') || "Ready Stock",
      dispatchCondition: formData.get('dispatchCondition') || "10/10 MISB (Mint in Sealed Box)",
      sealIntegrity: formData.get('sealIntegrity') || "Intact / Untampered",
      productSpecs: formData.get('productSpecs') || "ABS, PVC",
      authenticity: formData.get('authenticity') || "Verified Authentic",
      description: formData.get('description') || ""
    };

    inventory.unshift(newItem);
    await writeInventory(inventory, cfEnv);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to add item." }, { status: 500 });
  }
}

export async function PUT(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const idToEdit = formData.get('id');

    const inventory = await readInventory(cfEnv);
    const index = inventory.findIndex(item => String(item.id) === String(idToEdit));
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Item not found." }, { status: 404 });
    }

    // Primary image — keep existing if none uploaded
    const file = formData.get('image');
    let imageUrl = inventory[index].image;
    if (file && file.size > 0) imageUrl = await saveFile(file, cfEnv);

    // Additional images — replace all extras if new ones uploaded, keep existing otherwise
    const extraFiles = formData.getAll('additionalImages').filter(f => f && f.size > 0);
    let images;
    if (extraFiles.length > 0) {
      const extraPaths = await Promise.all(extraFiles.map(f => saveFile(f, cfEnv)));
      images = [imageUrl, ...extraPaths];
    } else {
      const existingImages = inventory[index].images || [inventory[index].image];
      images = [imageUrl, ...existingImages.slice(1)];
    }

    const updatedItem = {
      ...inventory[index],
      name: formData.get('name') || inventory[index].name,
      manufacturer: formData.get('manufacturer') || inventory[index].manufacturer || "Unknown Manufacturer",
      series: formData.get('series') || inventory[index].series,
      price: formData.has('price') && formData.get('price') !== "" ? parseFloat(formData.get('price')) : inventory[index].price,
      stock: formData.has('stock') && formData.get('stock') !== "" ? parseInt(formData.get('stock'), 10) : inventory[index].stock,
      scale: formData.get('scale') || inventory[index].scale,
      image: imageUrl,
      images,
      category: formData.get('category') || inventory[index].category,
      dispatchCondition: formData.get('dispatchCondition') || inventory[index].dispatchCondition || "10/10 MISB (Mint in Sealed Box)",
      sealIntegrity: formData.get('sealIntegrity') || inventory[index].sealIntegrity || "Intact / Untampered",
      productSpecs: formData.get('productSpecs') || inventory[index].productSpecs || "ABS, PVC",
      authenticity: formData.get('authenticity') || inventory[index].authenticity || "Verified Authentic",
      description: formData.get('description') || inventory[index].description
    };

    inventory[index] = updatedItem;
    await writeInventory(inventory, cfEnv);
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update item." }, { status: 500 });
  }
}

// PATCH /api/products — decrement stock for purchased items (called by /api/orders)
export async function PATCH(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid items.' }, { status: 400 });
    }
    const inventory = await readInventory(cfEnv);

    for (const { id, quantity } of items) {
      const product = inventory.find(p => String(p.id) === String(id));
      if (!product) {
        return NextResponse.json({ success: false, error: `Item ${id} not found.` }, { status: 404 });
      }
      if (product.stock < quantity) {
        return NextResponse.json({
          success: false,
          error: `"${product.name}" only has ${product.stock} unit${product.stock === 1 ? '' : 's'} left.`,
        }, { status: 409 });
      }
    }

    for (const { id, quantity } of items) {
      const idx = inventory.findIndex(p => String(p.id) === String(id));
      inventory[idx].stock -= quantity;
    }

    await writeInventory(inventory, cfEnv);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update stock.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cfEnv = await getCFEnv();
  if (!await isAuthorized(req, cfEnv)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const { id: idToDelete } = await req.json();

    const inventory = await readInventory(cfEnv);
    const filtered = inventory.filter(item => String(item.id) !== String(idToDelete));
    await writeInventory(filtered, cfEnv);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete item." }, { status: 500 });
  }
}
