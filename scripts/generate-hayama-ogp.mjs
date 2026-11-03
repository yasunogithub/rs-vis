// Regenerate the committed 1200x630 image; Japanese font availability affects glyph rendering.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const svg = fileURLToPath(new URL('../assets/hayama-ogp.svg', import.meta.url));
const png = fileURLToPath(new URL('../public/ogp-hayama.png', import.meta.url));
await sharp(svg).png().toFile(png);
