const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWindows = process.platform === 'win32';

function findJavaHome() {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;

  if (isWindows) {
    const commonRoots = [
      'C:\\Program Files\\Eclipse Adoptium',
      'C:\\Program Files\\Java',
      'C:\\Program Files (x86)\\Java',
      'C:\\Program Files\\Microsoft\\jdk',
      'C:\\Program Files\\Amazon Corretto'
    ];
    
    for (const root of commonRoots) {
      if (fs.existsSync(root)) {
        const entries = fs.readdirSync(root);
        // Sort to get latest version if multiple
        entries.sort().reverse();
        for (const entry of entries) {
          if (entry.toLowerCase().includes('jdk') || entry.toLowerCase().includes('jre')) {
             return path.join(root, entry);
          }
        }
      }
    }
  }
  return null;
}

const env = { ...process.env };

// Check for Java
try {
    execSync('java -version', { stdio: 'ignore' });
} catch (e) {
    console.log('Java not found in PATH. Attempting to locate...');
    const javaHome = findJavaHome();
    if (javaHome) {
        console.log(`Found Java at: ${javaHome}`);
        const javaBin = path.join(javaHome, 'bin');
        
        // Find the correct Path key (case-insensitive)
        const pathKey = Object.keys(env).find(k => k.toLowerCase() === 'path') || 'Path';
        
        env[pathKey] = isWindows ? `${javaBin};${env[pathKey]}` : `${javaBin}:${env[pathKey]}`;
        env.JAVA_HOME = javaHome;
    } else {
        console.warn('WARNING: Java not found. API generation may fail.');
    }
}

try {
    // Clean
    console.log('Cleaning output...');
    const outputDir = path.join(__dirname, '../libs/shared/src/lib/api');
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }

    // Generate
    console.log('Generating API...');
    
    // Resolve path to openapi-generator-cli
    const binName = isWindows ? 'openapi-generator-cli.cmd' : 'openapi-generator-cli';
    const localBin = path.join(__dirname, '..', 'node_modules', '.bin', binName);
    
    let cmd;
    if (fs.existsSync(localBin)) {
        console.log(`Using local binary: ${localBin}`);
        cmd = `"${localBin}" generate -g typescript-angular -i http://localhost:8080/v3/api-docs -o libs/shared/src/lib/api --additional-properties=ngVersion=17.0.0,fileNaming=kebab-case`;
    } else {
        console.log('Local binary not found, falling back to npx...');
        cmd = 'npx openapi-generator-cli generate -g typescript-angular -i http://localhost:8080/v3/api-docs -o libs/shared/src/lib/api --additional-properties=ngVersion=17.0.0,fileNaming=kebab-case';
    }
    
    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: 'inherit', env: env, cwd: path.join(__dirname, '..') });
    console.log('API Generation completed successfully.');
} catch (error) {
    console.error('Error during API generation:', error.message);
    process.exit(1);
}
