import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../backend/dist/seed/data.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(scriptDir, '../public/products');

function hash(value) {
  return [...value].reduce((result, char) => ((result * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
}

function palette(product) {
  const seed = hash(product.id);
  const colors = ['#7d1f35', '#1f4d73', '#2f6b52', '#9b6c1c', '#4f3b78', '#a24a61', '#355b8c', '#72512b', '#7b3145', '#2d6f83'];
  return {
    primary: colors[seed % colors.length],
    secondary: colors[(seed >>> 5) % colors.length],
    accent: ['#d4af37', '#f1d2a6', '#d9e6f2', '#d7c4ee', '#f0a0a5'][seed % 5],
    background: ['#f8f3eb', '#f0f4f6', '#f7eef3', '#f4f0e8', '#edf3ef'][seed % 5],
  };
}

function dress(primary, secondary, accent) {
  return `<path d="M330 230h140l28 104 112 420H190l112-420z" fill="${primary}"/><path d="M330 230c22-38 42-56 70-56s48 18 70 56" fill="none" stroke="${accent}" stroke-width="15"/><path d="M330 334h140l-22 230H352z" fill="${secondary}" opacity=".48"/><path d="M242 754h316" stroke="${accent}" stroke-width="11" opacity=".75"/>`;
}

function saree(primary, secondary, accent) {
  return `<circle cx="400" cy="210" r="54" fill="#b77856"/><path d="M322 276h156l75 470H260z" fill="${primary}"/><path d="M328 296c92 28 159 124 196 264l-54 120c-34-141-100-225-201-255z" fill="${secondary}"/><path d="M274 612c100 18 185 5 257-38" fill="none" stroke="${accent}" stroke-width="28"/><path d="M285 725h255" stroke="${accent}" stroke-width="13"/>`;
}

function top(primary, secondary, accent, sleeves = true) {
  return `<path d="M300 250h200l90 92-67 66-39-48v390H316V360l-39 48-67-66z" fill="${primary}"/><path d="M355 250c11 30 27 45 45 45s34-15 45-45" fill="${secondary}"/><path d="M330 505h140" stroke="${accent}" stroke-width="14" opacity=".7"/>${sleeves ? `<path d="M210 342l-58 182 92 26 72-154" fill="${secondary}"/><path d="M590 342l58 182-92 26-72-154" fill="${secondary}"/>` : ''}`;
}

function bottoms(primary, secondary, accent) {
  return `<path d="M290 230h220l-24 510H396l-18-285-42 285h-90z" fill="${primary}"/><path d="M314 280h172" stroke="${accent}" stroke-width="14"/><path d="M396 270v430" stroke="${secondary}" stroke-width="12" opacity=".75"/>`;
}

function shoe(primary, secondary, accent) {
  return `<path d="M182 574c80-2 135-64 178-177l96 70c45 35 105 67 174 94 51 20 65 74 32 107H183c-42 0-55-59-1-94z" fill="${primary}"/><path d="M310 538c87 16 177 23 269 18" fill="none" stroke="${secondary}" stroke-width="21"/><path d="M214 641h407" stroke="${accent}" stroke-width="12"/>`;
}

function bag(primary, secondary, accent) {
  return `<rect x="205" y="345" width="390" height="300" rx="38" fill="${primary}"/><path d="M300 345c0-128 200-128 200 0" fill="none" stroke="${secondary}" stroke-width="32"/><rect x="378" y="456" width="44" height="34" rx="9" fill="${accent}"/><path d="M235 585h330" stroke="${accent}" stroke-width="10" opacity=".65"/>`;
}

function jewelry(primary, secondary, accent, type) {
  if (type === 'earrings') return `<circle cx="280" cy="360" r="56" fill="${primary}"/><circle cx="520" cy="360" r="56" fill="${primary}"/><path d="M280 416l-46 152 46 76 46-76zM520 416l-46 152 46 76 46-76z" fill="${secondary}"/><circle cx="280" cy="572" r="22" fill="${accent}"/><circle cx="520" cy="572" r="22" fill="${accent}"/>`;
  return `<path d="M215 320c25 360 345 360 370 0" fill="none" stroke="${primary}" stroke-width="38"/><path d="M280 340c18 250 222 250 240 0" fill="none" stroke="${secondary}" stroke-width="16"/><path d="M400 614l-53-78h106z" fill="${accent}"/>`;
}

function accessory(primary, secondary, accent) {
  return `<path d="M170 430c115-232 345-232 460 0" fill="none" stroke="${primary}" stroke-width="28"/><circle cx="240" cy="329" r="34" fill="${secondary}"/><circle cx="400" cy="251" r="44" fill="${accent}"/><circle cx="560" cy="329" r="34" fill="${secondary}"/><path d="M400 294v270" stroke="${primary}" stroke-width="18"/><path d="M400 622l-58-76h116z" fill="${accent}"/>`;
}

function artwork(product) {
  const { primary, secondary, accent, background } = palette(product);
  const category = product.category;
  const garment = category === 'sarees' ? saree(primary, secondary, accent)
    : category === 'jeans' || category === 'trousers' ? bottoms(primary, secondary, accent)
    : category === 'shoes' ? shoe(primary, secondary, accent)
    : category === 'handbags' ? bag(primary, secondary, accent)
    : category === 'earrings' || category === 'necklaces' ? jewelry(primary, secondary, accent, category)
    : category === 'wedding-accessories' ? accessory(primary, secondary, accent)
    : category === 'shirts' || category === 't-shirts' || category === 'jackets' ? top(primary, secondary, accent, category !== 't-shirts')
    : dress(primary, secondary, accent);
  const title = product.name.replace(/&/g, 'and').slice(0, 34);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-labelledby="title-${product.id}">
  <title id="title-${product.id}">${title}</title>
  <rect width="800" height="1000" fill="${background}"/>
  <rect x="60" y="60" width="680" height="780" rx="32" fill="#ffffff" opacity=".56"/>
  <circle cx="690" cy="138" r="100" fill="${accent}" opacity=".17"/>
  <circle cx="122" cy="760" r="120" fill="${secondary}" opacity=".10"/>
  ${garment}
  <path d="M190 852h420" stroke="${primary}" stroke-width="2" opacity=".32"/>
  <text x="400" y="895" text-anchor="middle" fill="#26231f" font-family="Georgia, serif" font-size="25">${title}</text>
  <text x="400" y="930" text-anchor="middle" fill="#716b62" font-family="Arial, sans-serif" font-size="13" letter-spacing="3">AGENTCART ATELIER</text>
</svg>`;
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await Promise.all(products.map((product) =>
  writeFile(path.join(outputDir, `${product.id}.svg`), artwork(product), 'utf8'),
));

console.log(`Generated ${products.length} unique product illustrations in ${outputDir}`);
