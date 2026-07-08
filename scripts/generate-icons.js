const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svg = fs.readFileSync(path.join(__dirname, "../public/icons/icon.svg"));

async function generate() {
  const dir = path.join(__dirname, "../public/icons");

  await sharp(svg).resize(192, 192).png().toFile(path.join(dir, "icon-192.png"));
  await sharp(svg).resize(512, 512).png().toFile(path.join(dir, "icon-512.png"));
  await sharp(svg).resize(180, 180).png().toFile(path.join(dir, "apple-touch-icon.png"));

  const maskableSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#f6f5f4"/>
      <rect x="96" y="96" width="320" height="320" rx="48" fill="#ffffff" stroke="#e6e6e6" stroke-width="4"/>
      <text x="256" y="300" text-anchor="middle" font-size="140" font-family="Arial,sans-serif" font-weight="700" fill="#000000">W</text>
    </svg>
  `);

  await sharp(maskableSvg).resize(192, 192).png().toFile(path.join(dir, "icon-maskable-192.png"));
  await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(dir, "icon-maskable-512.png"));

  console.log("PWA icons generated");
}

generate().catch(console.error);
