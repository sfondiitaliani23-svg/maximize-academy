import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const W = 32;
const H = 32;
const bpp = 32;
const xorSize = W * H * 4;
const andSize = Math.ceil((W * H) / 8);
const bihSize = 40;
const imageSize = bihSize + xorSize + andSize;
const offset = 22;

const buffer = Buffer.alloc(offset + imageSize, 0);

// ICO Header
buffer.writeUInt16LE(0, 0); // reserved
buffer.writeUInt16LE(1, 2); // type 1: ICO
buffer.writeUInt16LE(1, 4); // 1 image

// Dir entry
buffer.writeUInt8(W, 6);
buffer.writeUInt8(H, 7);
buffer.writeUInt8(0, 8); // color count
buffer.writeUInt8(0, 9); // reserved
buffer.writeUInt16LE(1, 10); // planes
buffer.writeUInt16LE(bpp, 12); // bit count
buffer.writeUInt32LE(imageSize, 14); // bytes in res
buffer.writeUInt32LE(offset, 18); // offset

// BITMAPINFOHEADER
const bihOffset = offset;
buffer.writeUInt32LE(bihSize, bihOffset);
buffer.writeInt32LE(W, bihOffset + 4);
buffer.writeInt32LE(H * 2, bihOffset + 8);
buffer.writeUInt16LE(1, bihOffset + 12);
buffer.writeUInt16LE(bpp, bihOffset + 14);
buffer.writeUInt32LE(0, bihOffset + 16);
buffer.writeUInt32LE(xorSize, bihOffset + 20);
buffer.writeInt32LE(0, bihOffset + 24);
buffer.writeInt32LE(0, bihOffset + 28);
buffer.writeUInt32LE(0, bihOffset + 32);
buffer.writeUInt32LE(0, bihOffset + 36);

// Pixels in BGRA, bottom-up
const xorOffset = bihOffset + bihSize;
for (let y = 0; y < H; y++) {
  const py = H - 1 - y;
  for (let x = 0; x < W; x++) {
    const idx = xorOffset + (py * W + x) * 4;

    const inBox = x >= 2 && x <= 29 && y >= 2 && y <= 29;
    const cornerCut =
      (x <= 4 && y <= 4 && (x - 4) * (x - 4) + (y - 4) * (y - 4) > 8) ||
      (x >= 27 && y <= 4 && (x - 27) * (x - 27) + (y - 4) * (y - 4) > 8) ||
      (x <= 4 && y >= 27 && (x - 4) * (x - 4) + (y - 27) * (y - 27) > 8) ||
      (x >= 27 && y >= 27 && (x - 27) * (x - 27) + (y - 27) * (y - 27) > 8);

    if (!inBox || cornerCut) {
      buffer[idx] = 0;
      buffer[idx + 1] = 0;
      buffer[idx + 2] = 0;
      buffer[idx + 3] = 0;
      continue;
    }

    const isBorder = x === 2 || x === 29 || y === 2 || y === 29;

    const inM =
      (x >= 7 && x <= 9 && y >= 8 && y <= 23) ||
      (x >= 22 && x <= 24 && y >= 8 && y <= 23) ||
      (x >= 9 && x <= 15 && Math.abs((y - 8) - (x - 7) * 1.1) <= 1.5 && y <= 18) ||
      (x >= 16 && x <= 22 && Math.abs((y - 8) - (24 - x) * 1.1) <= 1.5 && y <= 18);

    if (inM) {
      buffer[idx] = 0x37;     // B
      buffer[idx + 1] = 0xaf; // G
      buffer[idx + 2] = 0xd4; // R
      buffer[idx + 3] = 0xff; // A
    } else if (isBorder) {
      buffer[idx] = 0x1a;
      buffer[idx + 1] = 0x6e;
      buffer[idx + 2] = 0x8c;
      buffer[idx + 3] = 0xff;
    } else {
      buffer[idx] = 0x0c;
      buffer[idx + 1] = 0x09;
      buffer[idx + 2] = 0x09;
      buffer[idx + 3] = 0xff;
    }
  }
}

// AND mask
const andOffset = xorOffset + xorSize;
for (let y = 0; y < H; y++) {
  const py = H - 1 - y;
  for (let x = 0; x < W; x++) {
    const pIdx = xorOffset + (py * W + x) * 4;
    const isTrans = buffer[pIdx + 3] === 0;
    if (isTrans) {
      const byteIdx = andOffset + Math.floor((py * W + x) / 8);
      const bitPos = 7 - ((py * W + x) % 8);
      buffer[byteIdx] |= 1 << bitPos;
    }
  }
}

const targetPath = path.resolve(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(targetPath, buffer);
console.log('Successfully created', targetPath, buffer.length, 'bytes');
