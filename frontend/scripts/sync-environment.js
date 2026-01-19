const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  // Source of truth is repo root: <repo>/config/environment.json
  const source = path.resolve(__dirname, '..', '..', 'config', 'environment.json');

  const appNames = ['web', 'crm'];

  if (!fs.existsSync(source)) {
    console.error(`[sync-environment] Missing source file: ${source}`);
    process.exit(1);
  }

  for (const appName of appNames) {
    const destDir = path.resolve(__dirname, '..', 'apps', appName, 'public');
    if (!fs.existsSync(destDir)) {
      console.log(`[sync-environment] Skipped (missing): ${destDir}`);
      continue;
    }

    const dest = path.join(destDir, 'environment.json');
    ensureDir(destDir);
    fs.copyFileSync(source, dest);
    console.log(`[sync-environment] Copied ${source} -> ${dest}`);
  }
}

main();
