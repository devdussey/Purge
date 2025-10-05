const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, pngPath, size) {
  try {
    // Read SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // Create canvas
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fill with white background (better visibility on all interfaces)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Create SVG data URL
    const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

    // Load and draw SVG
    const img = await loadImage(svgDataUrl);
    ctx.drawImage(img, 0, 0, size, size);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);

    console.log(`✅ Created ${path.basename(pngPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`Error converting ${svgPath}:`, error.message);
  }
}

async function main() {
  console.log('Converting SVG logos to PNG with white backgrounds...\n');

  const publicDir = path.join(__dirname, '..', 'public');

  // Convert 512x512
  await convertSvgToPng(
    path.join(publicDir, 'purge-logo-512.svg'),
    path.join(publicDir, 'purge-icon-512.png'),
    512
  );

  // Convert 256x256
  await convertSvgToPng(
    path.join(publicDir, 'purge-logo-256.svg'),
    path.join(publicDir, 'purge-icon-256.png'),
    256
  );

  // Convert 64x64 (from favicon)
  await convertSvgToPng(
    path.join(publicDir, 'purge-favicon.svg'),
    path.join(publicDir, 'purge-icon-64.png'),
    64
  );

  console.log('\n✅ All PNGs created successfully!');
  console.log('Next step: Run "node create-ico.cjs" to create .ico file');
}

main();
