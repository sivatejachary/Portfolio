const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Helper to write CRC32
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const crcVal = crc32(buf.slice(4, 8 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

// Generate RGBA Buffer for ST Logo at size N x N
function generateSTLogoRGBA(size) {
  const buf = Buffer.alloc(size * size * 4);
  const scale = size / 48; // normalize to 48x48 grid

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const nx = x / scale;
      const ny = y / scale;

      // Background rounded rect
      const cornerRadius = 10;
      let inCorner = false;
      if (nx < cornerRadius && ny < cornerRadius && Math.hypot(nx - cornerRadius, ny - cornerRadius) > cornerRadius) inCorner = true;
      if (nx > 48 - cornerRadius && ny < cornerRadius && Math.hypot(nx - (48 - cornerRadius), ny - cornerRadius) > cornerRadius) inCorner = true;
      if (nx < cornerRadius && ny > 48 - cornerRadius && Math.hypot(nx - cornerRadius, ny - (48 - cornerRadius)) > cornerRadius) inCorner = true;
      if (nx > 48 - cornerRadius && ny > 48 - cornerRadius && Math.hypot(nx - (48 - cornerRadius), ny - (48 - cornerRadius)) > cornerRadius) inCorner = true;

      if (inCorner) {
        buf[idx] = 0; buf[idx+1] = 0; buf[idx+2] = 0; buf[idx+3] = 0;
        continue;
      }

      // Default BG: Dark Indigo Gradient
      let r = 16, g = 18, b = 30, a = 255;

      // Border ring (glow)
      const distFromCenter = Math.hypot(nx - 24, ny - 24);
      if (distFromCenter >= 21 && distFromCenter <= 23.5) {
        r = 79; g = 70; b = 229; // Indigo #4f46e5
      }

      // Draw Letter 'S' (x: 10..22, y: 14..34)
      let inS = false;
      if (ny >= 14 && ny <= 18 && nx >= 11 && nx <= 22) inS = true; // Top bar
      if (ny >= 14 && ny <= 25 && nx >= 11 && nx <= 15) inS = true; // Upper left
      if (ny >= 22 && ny <= 26 && nx >= 11 && nx <= 22) inS = true; // Mid bar
      if (ny >= 23 && ny <= 34 && nx >= 18 && nx <= 22) inS = true; // Lower right
      if (ny >= 30 && ny <= 34 && nx >= 11 && nx <= 22) inS = true; // Bottom bar

      // Draw Letter 'T' (x: 25..38, y: 14..34)
      let inT = false;
      if (ny >= 14 && ny <= 18 && nx >= 25 && nx <= 38) inT = true; // Top crossbar
      if (ny >= 14 && ny <= 34 && nx >= 29.5 && nx <= 33.5) inT = true; // Vertical stem

      // AI Accent Dot at (38, 14)
      const inDot = Math.hypot(nx - 37, ny - 13) <= 2.2;

      if (inS || inT) {
        // Vibrant Indigo/Cyan gradient
        r = Math.floor(79 + (nx / 48) * 80);
        g = Math.floor(70 + (ny / 48) * 110);
        b = 245;
      } else if (inDot) {
        r = 6; g = 182; b = 212; // Cyan #06b6d4
      }

      buf[idx] = r;
      buf[idx+1] = g;
      buf[idx+2] = b;
      buf[idx+3] = a;
    }
  }
  return buf;
}

// Encode RGBA Buffer to PNG Buffer
function encodePNG(width, height, rgbaBuf) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;  // bit depth
  header[9] = 6;  // color type RGBA
  header[10] = 0; // compression
  header[11] = 0; // filter
  header[12] = 0; // interlace

  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // None filter
    rgbaBuf.copy(rawData, y * rowSize + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    signature,
    makeChunk('IHDR', header),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Write PNG files to public directory
const publicDir = path.join(__dirname, '..', 'public');

const sizes = [
  { size: 48, name: 'favicon-48.png' },
  { size: 96, name: 'favicon-96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32.png' }
];

const pngBuffers = {};

sizes.forEach(({ size, name }) => {
  const rgba = generateSTLogoRGBA(size);
  const png = encodePNG(size, size, rgba);
  pngBuffers[size] = png;
  fs.writeFileSync(path.join(publicDir, name), png);
  console.log(`Created ${name} (${size}x${size})`);
});

// Build ICO file containing 32x32 and 48x48 PNGs
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // ICO type
icoHeader.writeUInt16LE(2, 4); // count = 2 images

const png32 = pngBuffers[32];
const png48 = pngBuffers[48];

const dir32 = Buffer.alloc(16);
dir32[0] = 32; dir32[1] = 32; dir32[2] = 0; dir32[3] = 0;
dir32.writeUInt16LE(1, 4); dir32.writeUInt16LE(32, 6);
dir32.writeUInt32BE(png32.length, 8);
dir32.writeUInt32LE(6 + 16 + 16, 12); // offset

const dir48 = Buffer.alloc(16);
dir48[0] = 48; dir48[1] = 48; dir48[2] = 0; dir48[3] = 0;
dir48.writeUInt16LE(1, 4); dir48.writeUInt16LE(32, 6);
dir48.writeUInt32BE(png48.length, 8);
dir48.writeUInt32LE(6 + 16 + 16 + png32.length, 12); // offset

const icoBuf = Buffer.concat([icoHeader, dir32, dir48, png32, png48]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
console.log('Created favicon.ico (32x32 & 48x48 Multi-ICO)!');
