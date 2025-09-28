import { build } from 'vite';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildElectron() {
  console.log('Building React app...');
  
  // Build the React app
  await build();
  
  console.log('Building Electron main process...');
  
  // Create dist-electron directory
  if (!fs.existsSync('dist-electron')) {
    fs.mkdirSync('dist-electron');
  }
  
  // Compile TypeScript files for Electron
  const tscProcess = spawn('npx', ['tsc', '--project', 'tsconfig.electron.json'], {
    stdio: 'inherit',
    shell: true
  });
  
  tscProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Electron build completed successfully!');
    } else {
      console.error('Electron build failed with code:', code);
      process.exit(1);
    }
  });
}

buildElectron().catch(console.error);