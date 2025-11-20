import sharp from 'sharp';
import fs from 'fs';

// Create SVG with gradient background and icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" />
  <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">💰</text>
</svg>
`;

async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    const svg = Buffer.from(createSVG(size));
    await sharp(svg)
      .png()
      .toFile(`client/public/icon-${size}.png`);
    console.log(`✓ Generated icon-${size}.png`);
  }
}

generateIcons().then(() => {
  console.log('✓ All icons generated successfully');
}).catch(err => {
  console.error('Error generating icons:', err);
});
