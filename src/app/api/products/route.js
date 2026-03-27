import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');

    // Process image file
    const file = formData.get('image');
    let imageUrl = "https://via.placeholder.com/400x500"; // fallback

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filename = `${Date.now()}-${safeFilename}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Read the existing JSON securely
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const inventory = JSON.parse(fileContents);

    // Auto-generate the numeric ID
    const newIdStr = inventory.length > 0 ? (Math.max(...inventory.map(item => parseInt(item.id))) + 1).toString() : "1";

    const newItem = {
      id: newIdStr,
      name: formData.get('name') || "Unknown Artifact",
      manufacturer: formData.get('manufacturer') || "Unknown Manufacturer",
      series: formData.get('series') || "Unknown Series",
      price: parseFloat(formData.get('price')) || 0,
      stock: parseInt(formData.get('stock')) || 1,
      scale: formData.get('scale') || "1/7",
      image: imageUrl,
      category: formData.get('category') || "Ready Stock",
      description: formData.get('description') || "Acquisition data unverified."
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
    return NextResponse.json({ success: false, error: "Failed to read vault." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const idToEdit = formData.get('id');
    const filePath = path.join(process.cwd(), 'src/data/inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let inventory = JSON.parse(fileContents);

    const index = inventory.findIndex(item => item.id === idToEdit);
    if (index === -1) return NextResponse.json({ success: false, error: "Artifact not found." }, { status: 404 });

    // Process optional new image file
    const file = formData.get('image');
    let imageUrl = inventory[index].image; // keep old image by default

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filename = `${Date.now()}-${safeFilename}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updatedItem = {
      ...inventory[index],
      name: formData.get('name') || inventory[index].name,
      manufacturer: formData.get('manufacturer') || inventory[index].manufacturer || "Unknown Manufacturer",
      series: formData.get('series') || inventory[index].series,
      price: parseFloat(formData.get('price')) || inventory[index].price,
      stock: parseInt(formData.get('stock')) || inventory[index].stock,
      scale: formData.get('scale') || inventory[index].scale,
      image: imageUrl,
      category: formData.get('category') || inventory[index].category,
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
