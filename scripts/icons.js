const fs = require("fs");
const path = require("path");

const iconDir = path.join(__dirname, "../static/tab");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const createPNG = (r, g, b) => {
  const width = 64;
  const height = 64;

  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createChunk("IHDR", ihdrData);

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b);
    }
  }

  const zlib = require("zlib");
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = createChunk("IDAT", compressed);

  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const createChunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
};

const crc32 = (data) => {
  let crc = 0xffffffff;
  const table = [];

  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }

  return crc ^ 0xffffffff;
};

const gray = createPNG(153, 153, 153);
const primary = createPNG(102, 126, 234);

fs.writeFileSync(path.join(iconDir, "home.png"), gray);
fs.writeFileSync(path.join(iconDir, "home-active.png"), primary);
fs.writeFileSync(path.join(iconDir, "borrow.png"), gray);
fs.writeFileSync(path.join(iconDir, "borrow-active.png"), primary);
fs.writeFileSync(path.join(iconDir, "personal.png"), gray);
fs.writeFileSync(path.join(iconDir, "personal-active.png"), primary);

console.log("Icons generated successfully!");
