import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function isAuthorized(req) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_SECRET;
}

async function saveFile(file, uploadDir) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const uid = Math.random().toString(36).substring(2, 8);
  const filename = `${Date.now()}-${uid}-${safeFilename}`;
  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Process primary image
    const file = formData.get('image');
    let imageUrl = "https://via.placeholder.com/400x500";
    if (file && file.size > 0) imageUrl = await saveFile(file, uploadDir);

    // Process additional images
    const extraFiles = formData.getAll('additionalImages').filter(f => f && f.size > 0);
    const extraPaths = await Promise.all(extraFiles.map(f => saveFile(f, uploadDir)));
    const images = [imageUrl, ...extraPaths];

    // Read the existing JSON securely
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const inventory = JSON.parse(fileContents);

    // Auto-generate the numeric ID
    const newIdStr = inventory.length > 0 ? (Math.max(...inventory.map(item => parseInt(item.id))) + 1).toString() : "1";

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

    // Insert at the front (as a newly archived item)
    inventory.unshift(newItem);

    // Write the JSON back to the disk
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Vault Write Error:", error);
    return NextResponse.json({ success: false, error: "Failed to write to vault." }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const idToEdit = formData.get('id');
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let inventory = JSON.parse(fileContents);

    const index = inventory.findIndex(item => item.id === idToEdit);
    if (index === -1) return NextResponse.json({ success: false, error: "Artifact not found." }, { status: 404 });

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Process optional new primary image
    const file = formData.get('image');
    let imageUrl = inventory[index].image;
    if (file && file.size > 0) imageUrl = await saveFile(file, uploadDir);

    // Process optional additional images — replace all extras if any new ones provided
    const extraFiles = formData.getAll('additionalImages').filter(f => f && f.size > 0);
    let images;
    if (extraFiles.length > 0) {
      const extraPaths = await Promise.all(extraFiles.map(f => saveFile(f, uploadDir)));
      images = [imageUrl, ...extraPaths];
    } else {
      // Keep existing images, but update primary if it changed
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
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("Vault Edit Error:", error);
    return NextResponse.json({ success: false, error: "Failed to edit vault." }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const idToDelete = body.id;
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let inventory = JSON.parse(fileContents);

    inventory = inventory.filter(item => item.id !== idToDelete);
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    return NextResponse.json({ success: true, message: "Artifact incinerated." });
  } catch (error) {
    console.error("Vault Delete Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete from vault." }, { status: 500 });
  }
}
