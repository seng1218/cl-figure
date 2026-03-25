import inventoryData from '../data/inventory.json';

// Exporting the JSON data directly as the universal source of truth.
// Because we are relying on Next.js HMR/Webpack during local development, 
// any updates made to inventory.json via our Admin API will automatically 
// hot-reload and reflect on the frontend without needing complex client-side fetch logic.
export const allProducts = inventoryData;