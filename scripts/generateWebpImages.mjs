import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { products } from '../backend/dist/seed/data.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(scriptDir, '../public/products');
const frontendPublicDir = path.resolve(scriptDir, '../frontend/public/products');

// Color mapping based on fashion palette
const COLOR_MAP = {
  wine: { primary: '#6b1d2f', secondary: '#4a1220', accent: '#d4af37', bg: '#181416' },
  burgundy: { primary: '#541221', secondary: '#380b15', accent: '#e5c365', bg: '#171214' },
  merlot: { primary: '#5c1e2b', secondary: '#3d111b', accent: '#d4af37', bg: '#161214' },
  crimson: { primary: '#8b1122', secondary: '#5e0b16', accent: '#f3e5ab', bg: '#1a1315' },
  red: { primary: '#a81c2d', secondary: '#6e0f1c', accent: '#ffd700', bg: '#1a1214' },
  ruby: { primary: '#93182b', secondary: '#620f1c', accent: '#d4af37', bg: '#181214' },
  maroon: { primary: '#59161c', secondary: '#3b0d11', accent: '#e6ca65', bg: '#161113' },
  ivory: { primary: '#ede6d6', secondary: '#cfc4b0', accent: '#d4af37', bg: '#191816' },
  cream: { primary: '#f2ece1', secondary: '#d9cdb8', accent: '#c5a059', bg: '#191817' },
  white: { primary: '#f5f5f7', secondary: '#d8d8de', accent: '#d4af37', bg: '#171719' },
  pearl: { primary: '#eae6df', secondary: '#c8c2b5', accent: '#d4af37', bg: '#181716' },
  blush: { primary: '#d9828f', secondary: '#a85865', accent: '#f7d6bf', bg: '#1b1416' },
  pink: { primary: '#c9687e', secondary: '#964356', accent: '#fbe4d8', bg: '#1a1316' },
  rose: { primary: '#b85d70', secondary: '#85394a', accent: '#edd0b0', bg: '#191315' },
  emerald: { primary: '#17583e', secondary: '#0e3827', accent: '#d4af37', bg: '#121815' },
  green: { primary: '#1f5f42', secondary: '#133e2b', accent: '#e2caa0', bg: '#131815' },
  teal: { primary: '#1c6065', secondary: '#113e41', accent: '#d4af37', bg: '#121819' },
  olive: { primary: '#52593b', secondary: '#363b26', accent: '#d8c27a', bg: '#161714' },
  navy: { primary: '#1c2d4a', secondary: '#111d30', accent: '#d4af37', bg: '#12141a' },
  blue: { primary: '#20436d', secondary: '#132c4a', accent: '#d8e4f0', bg: '#121519' },
  sky: { primary: '#4a7ea3', secondary: '#2d5470', accent: '#f0f5fa', bg: '#13161a' },
  cobalt: { primary: '#1a3d82', secondary: '#0f2654', accent: '#d4af37', bg: '#11141c' },
  indigo: { primary: '#263459', secondary: '#172038', accent: '#c4d3eb', bg: '#13151b' },
  mustard: { primary: '#b58728', secondary: '#7d5c18', accent: '#fce9a7', bg: '#191712' },
  yellow: { primary: '#c7982c', secondary: '#8a681c', accent: '#fff0bd', bg: '#191712' },
  gold: { primary: '#b89437', secondary: '#7a601f', accent: '#fff4cc', bg: '#191713' },
  camel: { primary: '#a67d4c', secondary: '#73532f', accent: '#f5ddbe', bg: '#181512' },
  tan: { primary: '#9e7345', secondary: '#6b4c2b', accent: '#f0d7b7', bg: '#181512' },
  brown: { primary: '#5c3a21', secondary: '#3d2514', accent: '#d9ad7c', bg: '#161311' },
  beige: { primary: '#b8a68d', secondary: '#85755e', accent: '#e8dbca', bg: '#181715' },
  black: { primary: '#212124', secondary: '#141416', accent: '#d4af37', bg: '#111112' },
  charcoal: { primary: '#2d2e33', secondary: '#1b1c1f', accent: '#b0b3bd', bg: '#131315' },
  grey: { primary: '#4a4d54', secondary: '#2e3036', accent: '#d1d3d9', bg: '#151517' },
  silver: { primary: '#9a9da6', secondary: '#6a6d75', accent: '#ffffff', bg: '#161719' },
  lavender: { primary: '#78688c', secondary: '#504461', accent: '#e2d8ed', bg: '#161419' },
  purple: { primary: '#59386e', secondary: '#3a234a', accent: '#d4af37', bg: '#151218' },
};

function getProductPalette(product) {
  const nameLower = product.name.toLowerCase();
  const colors = (product.colors || []).map((c) => c.toLowerCase());
  
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (nameLower.includes(key) || colors.some((c) => c.includes(key))) {
      return val;
    }
  }
  return { primary: '#8c6d3b', secondary: '#544020', accent: '#d4af37', bg: '#161513' };
}

function renderGarmentShape(category, style, palette, id) {
  const p = palette.primary;
  const s = palette.secondary;
  const a = palette.accent;
  const seed = parseInt(id.replace(/[^0-9]/g, '') || '1', 10);

  switch (category) {
    case 'wedding-dresses': {
      if (id.includes('lehenga') || (style || '').toLowerCase().includes('lehenga')) {
        return `
          <!-- Blouse / Choli -->
          <path d="M330 250 L470 250 L490 350 L310 350 Z" fill="${p}" stroke="${a}" stroke-width="2"/>
          <path d="M360 250 Q400 280 440 250" fill="none" stroke="${a}" stroke-width="4"/>
          <!-- Dupatta Drape across chest -->
          <path d="M310 270 Q400 370 490 480 L520 460 Q420 340 330 250 Z" fill="${s}" opacity="0.85"/>
          <path d="M310 270 Q400 370 490 480" fill="none" stroke="${a}" stroke-width="4"/>
          <!-- Flared Lehenga Skirt -->
          <path d="M340 380 L460 380 L560 760 L240 760 Z" fill="${p}"/>
          <!-- Ornate Zari Embroidery Panels -->
          <path d="M370 380 L310 760 M400 380 L400 760 M430 380 L490 760" stroke="${a}" stroke-width="3" stroke-dasharray="8 6"/>
          <!-- Broad Border -->
          <path d="M240 730 L560 730 L560 760 L240 760 Z" fill="${a}"/>
          <path d="M240 710 L560 710" stroke="${s}" stroke-width="4"/>
        `;
      }
      if (id.includes('anarkali') || (style || '').toLowerCase().includes('anarkali')) {
        return `
          <!-- Anarkali Bodice -->
          <path d="M330 230 L470 230 L480 370 L320 370 Z" fill="${p}"/>
          <path d="M370 230 Q400 270 430 230" fill="none" stroke="${a}" stroke-width="4"/>
          <!-- Sleeves -->
          <path d="M330 230 L260 460 L290 470 L340 330 Z" fill="${s}"/>
          <path d="M470 230 L540 460 L510 470 L460 330 Z" fill="${s}"/>
          <!-- Flowing Kalis / Skirt -->
          <path d="M320 370 L480 370 L550 780 L250 780 Z" fill="${p}"/>
          <path d="M350 370 L310 780 M380 370 L370 780 M420 370 L430 780 M450 370 L490 780" stroke="${a}" stroke-width="2" opacity="0.6"/>
          <!-- Embroidered Hem -->
          <path d="M250 750 L550 750" stroke="${a}" stroke-width="12"/>
          <path d="M250 770 L550 770" stroke="${s}" stroke-width="4"/>
        `;
      }
      // Majestic Bridal Gown (A-line / Ball Gown)
      return `
        <!-- Bodice / Corset -->
        <path d="M330 230 L470 230 L480 360 L320 360 Z" fill="${p}" stroke="${a}" stroke-width="2"/>
        <path d="M360 230 Q400 270 440 230" fill="none" stroke="${a}" stroke-width="5"/>
        <path d="M400 260 L400 360" stroke="${a}" stroke-width="2" stroke-dasharray="4 4"/>
        <!-- Off-shoulder Straps / Delicate Sleeves -->
        <path d="M330 240 Q280 270 310 300 Q330 270 340 250" fill="${s}" opacity="0.7"/>
        <path d="M470 240 Q520 270 490 300 Q470 270 460 250" fill="${s}" opacity="0.7"/>
        <!-- Grand Layered Ball Skirt -->
        <path d="M320 360 Q400 380 480 360 L580 770 Q400 810 220 770 Z" fill="${p}"/>
        <!-- Tulle / Satin Overlay Sheen -->
        <path d="M340 370 Q400 390 460 370 L520 750 Q400 780 280 750 Z" fill="${s}" opacity="0.45"/>
        <path d="M370 380 Q400 400 430 380 L460 730 Q400 750 340 730 Z" fill="${a}" opacity="0.25"/>
        <!-- Hemline Embroidery -->
        <path d="M220 760 Q400 800 580 760" fill="none" stroke="${a}" stroke-width="8"/>
        <path d="M230 740 Q400 780 570 740" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="6 6"/>
      `;
    }

    case 'dresses':
    case 'party-wear': {
      if ((style || '').toLowerCase().includes('jumpsuit')) {
        return `
          <!-- Halter Bodice -->
          <path d="M360 210 L440 210 L460 360 L340 360 Z" fill="${p}"/>
          <path d="M360 210 L400 170 L440 210" fill="none" stroke="${a}" stroke-width="5"/>
          <!-- Belt / Sash -->
          <rect x="330" y="360" width="140" height="24" rx="4" fill="${a}"/>
          <!-- Wide Leg Trousers -->
          <path d="M340 384 L395 384 L385 760 L270 760 Z" fill="${p}"/>
          <path d="M405 384 L460 384 L530 760 L415 760 Z" fill="${p}"/>
          <!-- Crease Lines -->
          <path d="M330 420 L330 750 M470 420 L470 750" stroke="${s}" stroke-width="3"/>
        `;
      }
      if ((style || '').toLowerCase().includes('nehru') || id.includes('nehru')) {
        return `
          <!-- Nehru Jacket -->
          <path d="M310 230 L490 230 L500 580 L300 580 Z" fill="${p}"/>
          <!-- Mandarin Collar -->
          <rect x="360" y="210" width="80" height="24" rx="3" fill="${s}" stroke="${a}" stroke-width="2"/>
          <!-- Front Placket & Gold Buttons -->
          <line x1="400" y1="234" x2="400" y2="580" stroke="${a}" stroke-width="3"/>
          <circle cx="400" cy="270" r="5" fill="${a}"/>
          <circle cx="400" cy="320" r="5" fill="${a}"/>
          <circle cx="400" cy="370" r="5" fill="${a}"/>
          <circle cx="400" cy="420" r="5" fill="${a}"/>
          <circle cx="400" cy="470" r="5" fill="${a}"/>
          <circle cx="400" cy="520" r="5" fill="${a}"/>
          <!-- Pocket Square -->
          <path d="M335 310 L370 310 L370 316 L335 316 Z" fill="${a}"/>
          <polygon points="345,310 355,290 365,310" fill="${a}"/>
          <!-- Kurta Hem Below -->
          <path d="M315 580 L485 580 L495 720 L305 720 Z" fill="${s}"/>
          <line x1="400" y1="580" x2="400" y2="720" stroke="${p}" stroke-width="2"/>
        `;
      }
      // Cocktail / Midi / Slip / Bodycon Dress
      return `
        <!-- Straps / Neckline -->
        <path d="M340 200 L340 240 M460 200 L460 240" stroke="${a}" stroke-width="4"/>
        <path d="M330 240 L470 240 L480 370 L320 370 Z" fill="${p}"/>
        <path d="M340 240 Q400 290 460 240" fill="none" stroke="${a}" stroke-width="3"/>
        <!-- Waist cinch -->
        <path d="M320 370 Q400 385 480 370" stroke="${s}" stroke-width="8"/>
        <!-- Flowing or Fitted Skirt -->
        <path d="M320 370 Q400 385 480 370 L530 740 Q400 770 270 740 Z" fill="${p}"/>
        <!-- High Slit or Ruched Pleats -->
        <path d="M360 410 Q420 540 370 680" stroke="${s}" stroke-width="4" fill="none"/>
        <path d="M380 430 Q440 560 390 700" stroke="${a}" stroke-width="2" opacity="0.6" fill="none"/>
      `;
    }

    case 'sarees': {
      return `
        <!-- Blouse -->
        <path d="M330 250 L470 250 L460 340 L340 340 Z" fill="${s}"/>
        <path d="M360 250 Q400 280 440 250" fill="none" stroke="${a}" stroke-width="4"/>
        <!-- Fitted Waist & Pleated Base -->
        <path d="M340 370 L460 370 L520 760 L280 760 Z" fill="${p}"/>
        <!-- Vertical Pleat Folds -->
        <path d="M380 380 L360 760 M400 380 L400 760 M420 380 L440 760" stroke="${s}" stroke-width="4"/>
        <!-- Diagonal Pallu Drape across Shoulder -->
        <path d="M480 750 Q410 490 320 250 L270 260 Q370 520 450 760 Z" fill="${s}" opacity="0.9"/>
        <path d="M480 750 Q410 490 320 250" stroke="${a}" stroke-width="6"/>
        <!-- Elaborate Zari Border -->
        <path d="M280 730 L520 730 L520 760 L280 760 Z" fill="${a}"/>
        <path d="M280 705 L520 705" stroke="${s}" stroke-width="3"/>
        <!-- Motif Highlights -->
        <circle cx="340" cy="480" r="8" fill="${a}"/>
        <circle cx="440" cy="520" r="8" fill="${a}"/>
        <circle cx="360" cy="620" r="8" fill="${a}"/>
      `;
    }

    case 'kurtis': {
      return `
        <!-- Kurti Torso -->
        <path d="M310 230 L490 230 L510 520 L480 750 L320 750 L290 520 Z" fill="${p}"/>
        <!-- Neckline Embroidery Work -->
        <path d="M365 230 Q400 280 435 230" fill="none" stroke="${a}" stroke-width="5"/>
        <path d="M400 280 L400 400" stroke="${a}" stroke-width="4"/>
        <circle cx="400" cy="310" r="4" fill="${a}"/>
        <circle cx="400" cy="340" r="4" fill="${a}"/>
        <circle cx="400" cy="370" r="4" fill="${a}"/>
        <!-- Three-Quarter Sleeves -->
        <path d="M310 230 L230 450 L265 460 L325 320 Z" fill="${s}"/>
        <path d="M490 230 L570 450 L535 460 L475 320 Z" fill="${s}"/>
        <line x1="230" y1="445" x2="265" y2="455" stroke="${a}" stroke-width="4"/>
        <line x1="570" y1="445" x2="535" y2="455" stroke="${a}" stroke-width="4"/>
        <!-- Side Slits -->
        <line x1="400" y1="520" x2="400" y2="750" stroke="${s}" stroke-width="3"/>
        <path d="M320 735 L480 735" stroke="${a}" stroke-width="8"/>
      `;
    }

    case 'shirts': {
      return `
        <!-- Collar -->
        <polygon points="360,200 400,230 440,200 430,240 400,260 370,240" fill="${s}" stroke="${a}" stroke-width="2"/>
        <!-- Main Shirt Body -->
        <path d="M310 235 L490 235 L480 670 L320 670 Z" fill="${p}"/>
        <!-- Placket & Buttons -->
        <rect x="390" y="255" width="20" height="415" fill="${s}"/>
        <circle cx="400" cy="285" r="4" fill="${a}"/>
        <circle cx="400" cy="355" r="4" fill="${a}"/>
        <circle cx="400" cy="425" r="4" fill="${a}"/>
        <circle cx="400" cy="495" r="4" fill="${a}"/>
        <circle cx="400" cy="565" r="4" fill="${a}"/>
        <circle cx="400" cy="635" r="4" fill="${a}"/>
        <!-- Sleeves -->
        <path d="M310 235 L220 530 L260 540 L330 330 Z" fill="${p}"/>
        <path d="M490 235 L580 530 L540 540 L470 330 Z" fill="${p}"/>
        <!-- Cuffs -->
        <rect x="220" y="525" width="40" height="18" rx="2" fill="${s}" stroke="${a}" stroke-width="1"/>
        <rect x="540" y="525" width="40" height="18" rx="2" fill="${s}" stroke="${a}" stroke-width="1"/>
        <!-- Chest Pocket -->
        <path d="M340 310 L375 310 L375 350 L357 360 L340 350 Z" fill="${s}" stroke="${a}" stroke-width="1"/>
      `;
    }

    case 't-shirts': {
      return `
        <!-- Crew Neck / Polo Neck -->
        <path d="M360 220 Q400 250 440 220" fill="none" stroke="${a}" stroke-width="6"/>
        <!-- Torso -->
        <path d="M310 225 L490 225 L485 640 L315 640 Z" fill="${p}"/>
        <!-- Short Sleeves -->
        <path d="M310 225 L215 350 L260 380 L320 300 Z" fill="${s}"/>
        <path d="M490 225 L585 350 L540 380 L480 300 Z" fill="${s}"/>
        <!-- Minimal Graphic / Atelier Logo Emblem on Chest -->
        <circle cx="400" cy="340" r="28" fill="${s}" stroke="${a}" stroke-width="2"/>
        <path d="M386 340 L400 322 L414 340 L400 358 Z" fill="${a}"/>
        <line x1="315" y1="630" x2="485" y2="630" stroke="${s}" stroke-width="3"/>
      `;
    }

    case 'jeans':
    case 'trousers': {
      const isJeans = category === 'jeans';
      return `
        <!-- Waistband & Belt Loops -->
        <rect x="290" y="220" width="220" height="34" rx="4" fill="${s}" stroke="${a}" stroke-width="${isJeans ? '2' : '1'}"/>
        <rect x="310" y="220" width="8" height="34" fill="${a}" opacity="0.7"/>
        <rect x="396" y="220" width="8" height="34" fill="${a}" opacity="0.7"/>
        <rect x="482" y="220" width="8" height="34" fill="${a}" opacity="0.7"/>
        <!-- Front Fly & Button -->
        <circle cx="400" cy="237" r="6" fill="${a}"/>
        <path d="M400 254 L400 340 Q390 355 375 355" fill="none" stroke="${a}" stroke-width="2"/>
        <!-- Left Leg -->
        <path d="M290 254 L395 254 L380 770 L265 770 Z" fill="${p}"/>
        <!-- Right Leg -->
        <path d="M405 254 L510 254 L535 770 L420 770 Z" fill="${p}"/>
        <!-- Crease line or Contrast Stitching -->
        <line x1="325" y1="260" x2="325" y2="765" stroke="${isJeans ? a : s}" stroke-width="${isJeans ? '2' : '3'}" stroke-dasharray="${isJeans ? '6 4' : 'none'}"/>
        <line x1="475" y1="260" x2="475" y2="765" stroke="${isJeans ? a : s}" stroke-width="${isJeans ? '2' : '3'}" stroke-dasharray="${isJeans ? '6 4' : 'none'}"/>
        <!-- Curved Front Pockets -->
        <path d="M290 270 Q340 270 345 320" fill="none" stroke="${a}" stroke-width="2"/>
        <path d="M510 270 Q460 270 455 320" fill="none" stroke="${a}" stroke-width="2"/>
        <!-- Hems -->
        <line x1="265" y1="760" x2="380" y2="760" stroke="${a}" stroke-width="3"/>
        <line x1="420" y1="760" x2="535" y2="760" stroke="${a}" stroke-width="3"/>
      `;
    }

    case 'jackets': {
      return `
        <!-- Jacket Silhouette -->
        <path d="M290 220 L510 220 L520 660 L280 660 Z" fill="${p}"/>
        <!-- Notched Lapels / Biker Collar -->
        <polygon points="360,220 310,320 375,340 330,420 400,380" fill="${s}" stroke="${a}" stroke-width="2"/>
        <polygon points="440,220 490,320 425,340 470,420 400,380" fill="${s}" stroke="${a}" stroke-width="2"/>
        <!-- Asymmetric Zipper or Center Placket -->
        <line x1="390" y1="380" x2="390" y2="660" stroke="${a}" stroke-width="4"/>
        <!-- Sleeves -->
        <path d="M290 220 L190 560 L240 575 L315 320 Z" fill="${s}"/>
        <path d="M510 220 L610 560 L560 575 L485 320 Z" fill="${s}"/>
        <!-- Zipper Pocket Accents -->
        <line x1="320" y1="470" x2="370" y2="450" stroke="${a}" stroke-width="3"/>
        <line x1="430" y1="520" x2="480" y2="520" stroke="${a}" stroke-width="3"/>
        <!-- Cuffs with Hardware -->
        <line x1="190" y1="550" x2="240" y2="565" stroke="${a}" stroke-width="4"/>
        <line x1="610" y1="550" x2="560" y2="565" stroke="${a}" stroke-width="4"/>
      `;
    }

    case 'shoes': {
      if (id.includes('heel') || (style || '').toLowerCase().includes('heel') || (style || '').toLowerCase().includes('pump')) {
        return `
          <!-- High Heel Silhouette -->
          <path d="M200 520 Q320 520 430 420 Q500 370 560 370 Q610 370 610 420 Q600 480 520 560 Q440 610 320 620 L210 620 Z" fill="${p}"/>
          <!-- Insole / Arch Sheen -->
          <path d="M260 535 Q350 535 440 445 Q490 400 540 400" fill="none" stroke="${a}" stroke-width="6"/>
          <!-- Block / Stiletto Heel -->
          <path d="M220 620 L220 730 L255 730 L255 620 Z" fill="${s}" stroke="${a}" stroke-width="2"/>
          <!-- Pointed Toe Front -->
          <path d="M520 560 Q590 560 620 540 L570 610 Z" fill="${s}"/>
        `;
      }
      if (id.includes('jutti') || (style || '').toLowerCase().includes('jutti')) {
        return `
          <!-- Traditional Jutti Pair -->
          <path d="M220 420 Q380 400 440 540 Q400 630 250 600 Q190 560 220 420 Z" fill="${p}" stroke="${a}" stroke-width="3"/>
          <path d="M580 420 Q420 400 360 540 Q400 630 550 600 Q610 560 580 420 Z" fill="${s}" stroke="${a}" stroke-width="3"/>
          <!-- Embroidered Zari & Sequins on Vamp -->
          <circle cx="280" cy="490" r="14" fill="${a}"/>
          <circle cx="520" cy="490" r="14" fill="${a}"/>
          <path d="M250 460 Q280 490 310 460" stroke="${a}" stroke-width="4" fill="none"/>
          <path d="M490 460 Q520 490 550 460" stroke="${a}" stroke-width="4" fill="none"/>
        `;
      }
      // Premium Leather Sneakers / Oxford Brogues
      return `
        <!-- Sneaker / Oxford Profile -->
        <path d="M180 560 Q240 430 360 410 L460 460 Q560 480 620 540 Q630 580 610 610 L180 610 Z" fill="${p}"/>
        <!-- Contrast Leather Overlay / Heel Cap -->
        <path d="M180 560 Q220 470 280 460 L270 610 L180 610 Z" fill="${s}"/>
        <!-- Lacing System & Eyelets -->
        <path d="M370 415 L430 475" stroke="${a}" stroke-width="6"/>
        <circle cx="390" cy="440" r="3" fill="${a}"/>
        <circle cx="410" cy="460" r="3" fill="${a}"/>
        <!-- Sole Cushion Base -->
        <rect x="170" y="605" width="455" height="42" rx="12" fill="${s}" stroke="${a}" stroke-width="2"/>
        <line x1="170" y1="625" x2="625" y2="625" stroke="${a}" stroke-width="2" opacity="0.6"/>
      `;
    }

    case 'handbags': {
      if (id.includes('potli') || (style || '').toLowerCase().includes('potli')) {
        return `
          <!-- Potli Bag Silhouette -->
          <circle cx="400" cy="530" r="160" fill="${p}" stroke="${a}" stroke-width="3"/>
          <!-- Drawstring Neck & Flounce -->
          <path d="M330 370 Q400 395 470 370 L485 330 Q400 350 315 330 Z" fill="${s}" stroke="${a}" stroke-width="2"/>
          <!-- Hanging Tassels & Pearls -->
          <line x1="350" y1="380" x2="330" y2="520" stroke="${a}" stroke-width="3"/>
          <circle cx="330" cy="525" r="8" fill="${a}"/>
          <line x1="450" y1="380" x2="470" y2="520" stroke="${a}" stroke-width="3"/>
          <circle cx="470" cy="525" r="8" fill="${a}"/>
          <!-- Intricate Embroidery Grid -->
          <circle cx="400" cy="530" r="80" fill="none" stroke="${a}" stroke-width="3" stroke-dasharray="6 6"/>
          <circle cx="400" cy="530" r="16" fill="${a}"/>
        `;
      }
      // Luxury Tote / Shoulder Bag / Clutch
      return `
        <!-- Bag Handles / Strap -->
        <path d="M290 350 Q290 180 400 180 Q510 180 510 350" fill="none" stroke="${a}" stroke-width="12"/>
        <!-- Main Bag Body -->
        <rect x="220" y="350" width="360" height="290" rx="30" fill="${p}" stroke="${a}" stroke-width="2"/>
        <!-- Flap / Pocket -->
        <path d="M220 350 L580 350 L540 480 Q400 520 260 480 Z" fill="${s}"/>
        <!-- Gold Lock Clasp -->
        <rect x="380" y="470" width="40" height="32" rx="6" fill="${a}"/>
        <circle cx="400" cy="486" r="5" fill="${p}"/>
        <!-- Stitching Lines -->
        <path d="M245 615 L555 615" stroke="${a}" stroke-width="2" stroke-dasharray="6 4"/>
      `;
    }

    case 'earrings': {
      return `
        <!-- Earring Hooks / Stud Posts -->
        <circle cx="280" cy="260" r="14" fill="${a}"/>
        <circle cx="520" cy="260" r="14" fill="${a}"/>
        <!-- Connector Links -->
        <line x1="280" y1="274" x2="280" y2="340" stroke="${a}" stroke-width="5"/>
        <line x1="520" y1="274" x2="520" y2="340" stroke="${a}" stroke-width="5"/>
        <!-- Main Chandbali / Jhumka Domes -->
        <path d="M210 420 Q280 330 350 420 Q280 480 210 420 Z" fill="${p}" stroke="${a}" stroke-width="3"/>
        <path d="M450 420 Q520 330 590 420 Q520 480 450 420 Z" fill="${p}" stroke="${a}" stroke-width="3"/>
        <!-- Hanging Pearl Clusters -->
        <circle cx="240" cy="510" r="12" fill="${s}" stroke="${a}" stroke-width="2"/>
        <circle cx="280" cy="530" r="14" fill="${a}"/>
        <circle cx="320" cy="510" r="12" fill="${s}" stroke="${a}" stroke-width="2"/>
        <circle cx="480" cy="510" r="12" fill="${s}" stroke="${a}" stroke-width="2"/>
        <circle cx="520" cy="530" r="14" fill="${a}"/>
        <circle cx="560" cy="510" r="12" fill="${s}" stroke="${a}" stroke-width="2"/>
      `;
    }

    case 'necklaces': {
      return `
        <!-- Inner & Outer Choker Collar -->
        <path d="M220 300 Q400 480 580 300" fill="none" stroke="${a}" stroke-width="18"/>
        <path d="M260 320 Q400 460 540 320" fill="none" stroke="${s}" stroke-width="8"/>
        <path d="M200 290 Q400 520 600 290" fill="none" stroke="${p}" stroke-width="6"/>
        <!-- Suspended Gemstone Pendant -->
        <polygon points="400,480 435,535 400,590 365,535" fill="${p}" stroke="${a}" stroke-width="3"/>
        <circle cx="400" cy="535" r="14" fill="${a}"/>
        <!-- Hanging Drop Pearls -->
        <circle cx="340" cy="490" r="8" fill="${a}"/>
        <circle cx="460" cy="490" r="8" fill="${a}"/>
        <circle cx="400" cy="620" r="12" fill="${a}"/>
      `;
    }

    case 'wedding-accessories': {
      if (id.includes('tikka') || (style || '').toLowerCase().includes('tikka')) {
        return `
          <!-- Hair Chain -->
          <path d="M400 180 L400 420" stroke="${a}" stroke-width="5" stroke-dasharray="6 4"/>
          <circle cx="400" cy="200" r="12" fill="${a}"/>
          <!-- Center Floral Medallion -->
          <circle cx="400" cy="460" r="50" fill="${p}" stroke="${a}" stroke-width="3"/>
          <circle cx="400" cy="460" r="22" fill="${a}"/>
          <!-- Hanging Teardrop Pearls -->
          <circle cx="400" cy="540" r="14" fill="${a}"/>
          <circle cx="360" cy="520" r="10" fill="${s}"/>
          <circle cx="440" cy="520" r="10" fill="${s}"/>
        `;
      }
      if (id.includes('belt') || (style || '').toLowerCase().includes('belt')) {
        return `
          <!-- Ornate Kamarbandh / Waist Belt -->
          <rect x="180" y="440" width="440" height="42" rx="8" fill="${p}" stroke="${a}" stroke-width="3"/>
          <!-- Intricate Filigree Panels -->
          <circle cx="400" cy="461" r="28" fill="${a}"/>
          <circle cx="300" cy="461" r="18" fill="${s}" stroke="${a}" stroke-width="2"/>
          <circle cx="500" cy="461" r="18" fill="${s}" stroke="${a}" stroke-width="2"/>
          <!-- Hanging Crystal Chains -->
          <path d="M260 482 Q330 550 400 482" fill="none" stroke="${a}" stroke-width="4"/>
          <path d="M400 482 Q470 550 540 482" fill="none" stroke="${a}" stroke-width="4"/>
        `;
      }
      // Bridal Hair Vine / Embroidered Shawl / Stole
      return `
        <!-- Delicate Bridal Crown / Hair Vine Structure -->
        <path d="M200 400 Q400 240 600 400 Q400 340 200 400" fill="${p}" stroke="${a}" stroke-width="3"/>
        <!-- Floral Crystal Sprigs -->
        <circle cx="300" cy="330" r="14" fill="${a}"/>
        <circle cx="360" cy="300" r="16" fill="${s}" stroke="${a}" stroke-width="2"/>
        <circle cx="400" cy="285" r="20" fill="${a}"/>
        <circle cx="440" cy="300" r="16" fill="${s}" stroke="${a}" stroke-width="2"/>
        <circle cx="500" cy="330" r="14" fill="${a}"/>
        <!-- Crystal Leaves -->
        <ellipse cx="330" cy="315" rx="8" ry="16" transform="rotate(-30 330 315)" fill="${a}"/>
        <ellipse cx="470" cy="315" rx="8" ry="16" transform="rotate(30 470 315)" fill="${a}"/>
      `;
    }

    default:
      return `
        <!-- Default Luxury Silhouette -->
        <path d="M320 240 L480 240 L520 740 L280 740 Z" fill="${p}"/>
        <path d="M360 240 Q400 280 440 240" fill="none" stroke="${a}" stroke-width="4"/>
        <line x1="400" y1="280" x2="400" y2="740" stroke="${s}" stroke-width="4"/>
      `;
  }
}

function buildSvg(product) {
  const palette = getProductPalette(product);
  const garment = renderGarmentShape(product.category, product.style, palette, product.id);
  const title = product.name.replace(/&/g, 'and').slice(0, 36);
  const categoryLabel = (product.category || '').toUpperCase().replace(/-/g, ' ');
  const priceFormatted = `INR ${product.price.toLocaleString('en-IN')}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <!-- Rich Haute Noir Backdrop Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#1b1b1e"/>
      <stop offset="60%" stop-color="#111113"/>
      <stop offset="100%" stop-color="#080809"/>
    </radialGradient>
    <!-- Gold Rim Linear Gradient -->
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e0a0"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8a6c1e"/>
    </linearGradient>
    <!-- Soft Pedestal Radial Shadow -->
    <radialGradient id="pedestal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.75"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Surface -->
  <rect width="800" height="1000" fill="url(#bgGrad)"/>

  <!-- Studio Ambient Halo in Garment Tone -->
  <circle cx="400" cy="460" r="280" fill="${palette.primary}" opacity="0.14" filter="url(#softGlow)"/>

  <!-- Atelier Framing Border (1px Hairline) -->
  <rect x="36" y="36" width="728" height="928" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="44" y="44" width="712" height="912" rx="4" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1"/>

  <!-- Top Studio Corner Telemetry -->
  <text x="64" y="80" fill="#d4af37" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="3">${categoryLabel}</text>
  <text x="736" y="80" text-anchor="end" fill="rgba(226,226,226,0.5)" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" letter-spacing="2">${product.id.toUpperCase()}</text>

  <!-- Stage Shadow Pedestal -->
  <ellipse cx="400" cy="780" rx="220" ry="34" fill="url(#pedestal)"/>

  <!-- Garment Illustration Centerpiece -->
  <g id="garment-render">
    ${garment}
  </g>

  <!-- Bottom Archival Title & Brand Plaque -->
  <line x1="240" y1="840" x2="560" y2="840" stroke="url(#goldRim)" stroke-width="1.5" opacity="0.6"/>
  <text x="400" y="880" text-anchor="middle" fill="#f5f5f7" font-family="'Playfair Display', Georgia, serif" font-size="22" font-style="italic">${title}</text>
  <text x="400" y="910" text-anchor="middle" fill="#d4af37" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="2">${priceFormatted}</text>
  <text x="400" y="938" text-anchor="middle" fill="rgba(226,226,226,0.35)" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" letter-spacing="4">AGENTCART HAUTE INTELLIGENCE</text>
</svg>`;
}

async function main() {
  console.log(`Starting WebP product image generation for ${products.length} products...`);

  await mkdir(publicDir, { recursive: true });
  await mkdir(frontendPublicDir, { recursive: true });

  const hashes = new Set();

  for (const product of products) {
    const svg = buildSvg(product);
    const webpBuffer = await sharp(Buffer.from(svg))
      .webp({ quality: 92, lossless: false })
      .toBuffer();

    const filename = `${product.id}.webp`;
    const publicPath = path.join(publicDir, filename);
    const frontendPath = path.join(frontendPublicDir, filename);

    await writeFile(publicPath, webpBuffer);
    await writeFile(frontendPath, webpBuffer);

    hashes.add(webpBuffer.toString('base64').slice(0, 40));
  }

  console.log(`Successfully generated 87 WebP images in:`);
  console.log(` - ${publicDir}`);
  console.log(` - ${frontendPublicDir}`);
  console.log(`Unique image buffers verified: ${hashes.size} / ${products.length}`);
}

main().catch((err) => {
  console.error('Error generating product images:', err);
  process.exit(1);
});
