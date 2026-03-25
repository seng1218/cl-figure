/**
 * Mobile Build Script — Cross-platform
 * Swaps next.config.mjs to the mobile (static export) version,
 * temporarily hides the API folder so Next.js skips it,
 * runs `next build`, then restores everything, and syncs Capacitor.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const mainConfig = path.join(root, 'next.config.mjs');
const mobileConfig = path.join(root, 'next.config.mobile.mjs');
const backupConfig = path.join(root, 'next.config.mjs.bak');
// Rename just the route file, not the folder (avoids EPERM on Windows)
const routeFile = path.join(root, 'src', 'app', 'api', 'products', 'route.js');
const routeFileHidden = path.join(root, 'src', 'app', 'api', 'products', 'route.js.bak');

const run = (cmd) => {
  console.log(`\n>> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
};

let configSwapped = false;
let apiHidden = false;

try {
  // 1. Backup the current config
  fs.copyFileSync(mainConfig, backupConfig);
  console.log('✓ Backed up next.config.mjs');

  // 2. Replace with the mobile config
  fs.copyFileSync(mobileConfig, mainConfig);
  configSwapped = true;
  console.log('✓ Mobile config applied');

  // 3. Temporarily hide the API route file (Next.js only picks up route.js/ts)
  if (fs.existsSync(routeFile)) {
    fs.renameSync(routeFile, routeFileHidden);
    apiHidden = true;
    console.log('✓ API route hidden from static export');
  }

  // 4. Run Next.js static build
  run('npx next build');

  // 5. Sync with Capacitor Android
  run('npx cap sync android');

  console.log('\n✅ Mobile build complete! Run `npm run cap:open` to open in Android Studio.');

} catch (err) {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
} finally {
  // Always restore the API route file
  if (apiHidden && fs.existsSync(routeFileHidden)) {
    fs.renameSync(routeFileHidden, routeFile);
    console.log('✓ API route restored');
  }
  // Always restore the original config
  if (configSwapped && fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, mainConfig);
    fs.unlinkSync(backupConfig);
    console.log('✓ Original config restored');
  }
}

