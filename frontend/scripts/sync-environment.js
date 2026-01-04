const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  // Source of truth is repo root: <repo>/config/environment.json
  const source = path.resolve(__dirname, '..', '..', 'config', 'environment.json');

  // Frontend serves assets from apps/web/public
  const destDir = path.resolve(__dirname, '..', 'apps', 'web', 'public');
  const dest = path.join(destDir, 'environment.json');

  if (!fs.existsSync(source)) {
    console.error(`[sync-environment] Missing source file: ${source}`);
    process.exit(1);
  }

  ensureDir(destDir);
  fs.copyFileSync(source, dest);
  console.log(`[sync-environment] Copied ${source} -> ${dest}`);
}

main();
