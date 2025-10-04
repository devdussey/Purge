const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  try {
    console.log('Creating multi-resolution ICO file...');

    // Convert PNG to ICO with multiple sizes
    const buf = await pngToIco(path.join(__dirname, 'public', 'purge-icon-512.png'));

    // Write to public folder
    fs.writeFileSync(path.join(__dirname, 'public', 'purge-icon.ico'), buf);

    console.log('✅ Successfully created purge-icon.ico');
    console.log('   Sizes: 256x256, 128x128, 64x64, 32x32, 16x16');
  } catch (error) {
    console.error('Error creating ICO:', error);
    process.exit(1);
  }
}

createIcon();
