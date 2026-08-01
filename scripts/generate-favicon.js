const fs = require('fs');
const sharp = require('sharp');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="16" ry="16" fill="url(#logo-gradient)" />
  <rect x="5.5" y="5.5" width="53" height="53" rx="13" ry="13" fill="#020617" />
  <g transform="translate(14, 14) scale(1.5)" stroke="#22d3ee" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </g>
</svg>`;

async function generate() {
  fs.mkdirSync('public', { recursive: true });

  // Generate PNG buffers for 16x16, 32x32, and 48x48
  const png16 = await sharp(Buffer.from(svg)).resize(16, 16).png({ compressionLevel: 9 }).toBuffer();
  const png32 = await sharp(Buffer.from(svg)).resize(32, 32).png({ compressionLevel: 9 }).toBuffer();
  const png48 = await sharp(Buffer.from(svg)).resize(48, 48).png({ compressionLevel: 9 }).toBuffer();

  // Save favicon.png (32x32)
  fs.writeFileSync('public/favicon.png', png32);
  console.log('Created public/favicon.png (' + png32.length + ' bytes)');

  // Build multi-image ICO container
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ];

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Image type: 1 = ICO
  icoHeader.writeUInt16LE(images.length, 4); // Number of images

  const dirEntries = [];
  let offset = 6 + (images.length * 16);

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...dirEntries,
    ...images.map(img => img.buffer)
  ]);

  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('Created public/favicon.ico (' + icoBuffer.length + ' bytes with 16x16, 32x32, 48x48 icons)');
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
