const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "../public/icons");
const splashDir = path.join(__dirname, "../public/splash");
const publicDir = path.join(__dirname, "../public");

const iconSvg = fs.readFileSync(path.join(iconsDir, "icon.svg"));
const splashSvg = fs.readFileSync(path.join(splashDir, "splash.svg"));

const maskableSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
    <rect width="512" height="512" fill="#f6f5f4"/>
    <defs>
      <linearGradient id="bg" x1="128" y1="128" x2="384" y2="384" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0075de"/>
        <stop offset="1" stop-color="#213183"/>
      </linearGradient>
    </defs>
    <rect x="128" y="128" width="256" height="256" rx="56" fill="url(#bg)"/>
    <rect x="168" y="176" width="176" height="160" rx="24" fill="#ffffff"/>
    <path d="M256 200v112" stroke="#0075de" stroke-width="6" stroke-linecap="round"/>
    <path d="M200 220c20-12 36-10 56 5v92c-20 10-36 8-56-5V220z" stroke="#0075de" stroke-width="5" stroke-linejoin="round"/>
    <path d="M312 220c-20-12-36-10-56 5v92c20 10 36 8 56-5V220z" stroke="#213183" stroke-width="5" stroke-linejoin="round"/>
  </svg>
`);

const splashSizes = [
  { name: "splash-1170x2532", width: 1170, height: 2532 },
  { name: "splash-1284x2778", width: 1284, height: 2778 },
  { name: "splash-750x1334", width: 750, height: 1334 },
  { name: "splash-1080x1920", width: 1080, height: 1920 },
];

async function generate() {
  fs.mkdirSync(splashDir, { recursive: true });

  await sharp(iconSvg).resize(16, 16).png().toFile(path.join(publicDir, "favicon-16x16.png"));
  await sharp(iconSvg).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32x32.png"));
  await sharp(iconSvg).resize(48, 48).png().toFile(path.join(publicDir, "favicon-48x48.png"));
  await sharp(iconSvg).resize(180, 180).png().toFile(path.join(iconsDir, "apple-touch-icon.png"));
  await sharp(iconSvg).resize(192, 192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(iconSvg).resize(512, 512).png().toFile(path.join(iconsDir, "icon-512.png"));

  await sharp(maskableSvg).resize(192, 192).png().toFile(path.join(iconsDir, "icon-maskable-192.png"));
  await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(iconsDir, "icon-maskable-512.png"));

  for (const { name, width, height } of splashSizes) {
    await sharp(splashSvg)
      .resize(width, height, { fit: "cover", position: "centre" })
      .png()
      .toFile(path.join(splashDir, `${name}.png`));
  }

  const favicon32 = await sharp(iconSvg).resize(32, 32).png().toBuffer();
  await sharp(favicon32).toFile(path.join(publicDir, "favicon.ico"));

  console.log("Logo, favicon, and splash assets generated");
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
