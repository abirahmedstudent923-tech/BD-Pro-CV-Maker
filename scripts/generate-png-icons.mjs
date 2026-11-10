import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(crcData), 8 + len);
  return chunk;
}

function generatePNG(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image pixels
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.44);
  const redCircleRadius = radius * 0.55;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base Bangladesh green: #006a4e -> R:0, G:106, B:78
      let r = 0, g = 106, b = 78, a = 255;

      if (!isMaskable) {
        // Rounded corners or circular icon
        const cornerRadius = width * 0.22;
        const inBox = (
          x >= cornerRadius && x <= width - cornerRadius ||
          y >= cornerRadius && y <= height - cornerRadius ||
          Math.hypot(Math.max(0, Math.abs(x - cx) - (cx - cornerRadius)), Math.max(0, Math.abs(y - cy) - (cy - cornerRadius))) <= cornerRadius
        );

        if (!inBox) {
          a = 0; // Transparent outer
        }
      }

      // Red circle emblem: #f42a41 -> R:244, G:42, B:65
      const redDist = Math.hypot(x - (cx - width * 0.02), y - (cy - height * 0.05));
      if (a > 0 && redDist <= redCircleRadius) {
        r = 244;
        g = 42;
        b = 65;
      }

      // White CV Document in center
      const docW = width * 0.44;
      const docH = height * 0.52;
      const docLeft = cx - docW / 2;
      const docTop = cy - docH / 2 + (height * 0.02);

      if (a > 0 && x >= docLeft && x <= docLeft + docW && y >= docTop && y <= docTop + docH) {
        // Check top right fold
        const foldSize = docW * 0.3;
        const inFoldCorner = (x > docLeft + docW - foldSize && y < docTop + foldSize);
        if (inFoldCorner && (x - (docLeft + docW - foldSize) + (docTop + foldSize - y) > foldSize)) {
          // Folded corner
          r = 226; g = 232; b = 240;
        } else {
          // Document paper white
          r = 255; g = 255; b = 255;

          // Lines on document
          const relY = (y - docTop) / docH;
          const relX = (x - docLeft) / docW;

          // Header avatar circle
          if (Math.hypot(x - (docLeft + docW * 0.25), y - (docTop + docH * 0.22)) < docW * 0.12) {
            r = 0; g = 106; b = 78;
          } else if (relX > 0.42 && relX < 0.85 && relY > 0.16 && relY < 0.22) {
            r = 30; g = 41; b = 59; // Name bar
          } else if (relX > 0.42 && relX < 0.72 && relY > 0.24 && relY < 0.28) {
            r = 100; g = 116; b = 139; // Title bar
          } else if (relX > 0.12 && relX < 0.88 && (
            (relY > 0.40 && relY < 0.43) || // Green separator
            (relY > 0.47 && relY < 0.50) ||
            (relY > 0.54 && relY < 0.57) ||
            (relY > 0.65 && relY < 0.68) || // Green separator
            (relY > 0.72 && relY < 0.75) ||
            (relY > 0.79 && relY < 0.82)
          )) {
            if (relY > 0.39 && relY < 0.44 || relY > 0.64 && relY < 0.69) {
              r = 0; g = 106; b = 78;
            } else {
              r = 148; g = 163; b = 184;
            }
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePNG(64, 64, false));

console.log('Successfully generated all PWA icons (192, 512, maskable, apple-touch-icon, favicon)');
