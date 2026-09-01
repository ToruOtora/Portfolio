/* ═══════════════════════════════════════════════════════════════════════════
   COOLORS-STYLE COLOR GENERATOR — CURATED SMART ENGINE
   File: color-palette.js
   Toru_O Web Tools — Simple, Beautiful, Practical
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──
  let activeHarmony = 'analogous';
  let activeTone = 'all'; // 'all' | 'light' | 'pastel' | 'bright' | 'vivid' | 'muted' | 'dark' | 'deep' | 'neutral'
  let historyStack = [];
  let inspectorIdx = 0;
  let paletteTargetMode = 'graphic'; // 'graphic' | 'painting'
  let palette = [];
  let dragSrcIdx = -1;
  let isWindowDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let highestZ = 100;
  let activeSlider = null; // { type: 'h'|'s'|'v', idx: number }

  // ── Curated Hue Zones (full 0-360° coverage with beautiful zones) ──
  const HUE_ZONES = [
    { min: 0, max: 25, name: 'Coral / Red' },
    { min: 25, max: 55, name: 'Amber / Orange' },
    { min: 55, max: 80, name: 'Gold / Yellow' },
    { min: 80, max: 140, name: 'Lime / Green' },
    { min: 140, max: 165, name: 'Mint / Spring' },
    { min: 165, max: 200, name: 'Teal / Cyan' },
    { min: 200, max: 240, name: 'Blue / Azure' },
    { min: 240, max: 280, name: 'Indigo / Lavender' },
    { min: 280, max: 310, name: 'Purple / Magenta' },
    { min: 310, max: 360, name: 'Rose / Crimson' }
  ];

  // ── Named Color Lookup (approximate) ──
  const COLOR_NAMES = [
    { h: [0, 15], s: [0, 30], v: [90, 100], name: 'White' },
    { h: [0, 360], s: [0, 10], v: [0, 20], name: 'Black' },
    { h: [0, 360], s: [0, 15], v: [40, 70], name: 'Gray' },
    { h: [0, 360], s: [0, 15], v: [70, 95], name: 'Silver' },
    { h: [0, 15], s: [60, 100], v: [30, 60], name: 'Maroon' },
    { h: [0, 15], s: [70, 100], v: [70, 100], name: 'Red' },
    { h: [15, 35], s: [70, 100], v: [80, 100], name: 'Orange' },
    { h: [35, 55], s: [60, 100], v: [85, 100], name: 'Gold' },
    { h: [50, 70], s: [70, 100], v: [85, 100], name: 'Yellow' },
    { h: [70, 100], s: [30, 70], v: [50, 80], name: 'Olive' },
    { h: [80, 150], s: [40, 100], v: [40, 80], name: 'Green' },
    { h: [150, 175], s: [30, 80], v: [60, 90], name: 'Mint' },
    { h: [170, 195], s: [40, 100], v: [50, 90], name: 'Teal' },
    { h: [190, 215], s: [30, 70], v: [70, 100], name: 'Sky' },
    { h: [200, 240], s: [50, 100], v: [50, 90], name: 'Blue' },
    { h: [235, 260], s: [30, 80], v: [30, 70], name: 'Indigo' },
    { h: [260, 290], s: [30, 80], v: [40, 80], name: 'Purple' },
    { h: [285, 330], s: [30, 80], v: [50, 85], name: 'Violet' },
    { h: [330, 360], s: [40, 90], v: [60, 90], name: 'Pink' },
    { h: [0, 30], s: [30, 60], v: [80, 100], name: 'Peach' },
    { h: [260, 290], s: [15, 45], v: [70, 95], name: 'Lavender' },
    { h: [15, 40], s: [40, 75], v: [40, 70], name: 'Brown' },
    { h: [190, 220], s: [60, 100], v: [60, 95], name: 'Cyan' }
  ];

  // ── Curated Preset Palettes (60 total mapped across 8 Color Theory Harmony Modes) ──
  const CURATED_PALETTES = [
    // 🌸 1. Analogous (สีข้างเคียง)
    { name: '🌸 Sakura Blossom', harmony: 'Analogous', hexes: ['#fdf2f4', '#fbc4ce', '#e56b8f', '#d84a75', '#3d1520'] },
    { name: '🍂 Warm Earth', harmony: 'Analogous', hexes: ['#faf5ef', '#e6c594', '#d97724', '#b85c14', '#2b1e17'] },
    { name: '🌲 Forest Pine', harmony: 'Analogous', hexes: ['#f0fdf4', '#dcfce7', '#22c55e', '#169846', '#14532d'] },
    { name: '🍵 Matcha', harmony: 'Analogous', hexes: ['#fefae0', '#e9edc9', '#a3b18a', '#6b8e4e', '#2d3a27'] },
    { name: '🌾 Golden Harvest', harmony: 'Analogous', hexes: ['#fcf4de', '#f5d68b', '#e6b85c', '#c2852c', '#2e1f0e'] },
    { name: '🌲 Emerald Forest', harmony: 'Analogous', hexes: ['#d1fae5', '#50c878', '#228b57', '#134e32', '#091e13'] },
    { name: '☕ Espresso Roast', harmony: 'Analogous', hexes: ['#e8d5c4', '#c49a80', '#9c6b4e', '#613b2b', '#180e0a'] },
    { name: '🍁 Autumn Maple', harmony: 'Analogous', hexes: ['#ffaa44', '#ff8800', '#e66000', '#a83a00', '#1c0a00'] },
    { name: '🌿 Olive Garden', harmony: 'Analogous', hexes: ['#e8f5e9', '#8fbc8f', '#556b2f', '#2d3b25', '#131a10'] },
    { name: '🍊 Orange Sunset', harmony: 'Analogous', hexes: ['#f6ae2d', '#f26419', '#b83b0f', '#5c1704', '#210903'] },

    // ⚡ 2. Complementary (สีตรงข้าม)
    { name: '⚡ Cyberpunk Neon', harmony: 'Complementary', hexes: ['#0a0a1a', '#1a0533', '#0fefca', '#ff007f', '#ffe600'] },
    { name: '🌊 Nordic Ocean', harmony: 'Complementary', hexes: ['#e0f2fe', '#38bdf8', '#0f766e', '#f97316', '#0c2d3f'] },
    { name: '🔥 Sunset Fire', harmony: 'Complementary', hexes: ['#fef3c7', '#fbbf24', '#f97316', '#3b82f6', '#450a0a'] },
    { name: '🍉 Summer Watermelon', harmony: 'Complementary', hexes: ['#f9f8f6', '#ff8589', '#ff5a60', '#1e6f47', '#0c3823'] },
    { name: '🏮 Neon Cyber Alley', harmony: 'Complementary', hexes: ['#080914', '#1b1c3a', '#00f0ff', '#ff0055', '#ffe600'] },
    { name: '🌌 Cosmic Aurora', harmony: 'Complementary', hexes: ['#03141f', '#093a4b', '#3caea3', '#f6d55c', '#ed553b'] },
    { name: '🎴 Hanafuda Retro', harmony: 'Complementary', hexes: ['#f5f0eb', '#e6a100', '#c72c2c', '#1b4d3e', '#1a0505'] },
    { name: '🧪 Poison Ivy', harmony: 'Complementary', hexes: ['#c2f0c7', '#69b071', '#2f6e42', '#a8325a', '#08170e'] },
    { name: '🍨 Mango Sticky Rice', harmony: 'Complementary', hexes: ['#fffbeb', '#ffc107', '#bd8924', '#5c3a93', '#2e2008'] },
    { name: '👑 Royal Gold & Velvet', harmony: 'Complementary', hexes: ['#fdf4dc', '#d4af37', '#731c77', '#3b1248', '#190a21'] },

    // 🔺 3. Triad (สามเหลี่ยม 3 ทิศทาง)
    { name: '🍧 Anime Dream', harmony: 'Triad', hexes: ['#fef9f0', '#fbc531', '#487eb0', '#e84118', '#2c2c54'] },
    { name: '🔮 Neon Retro Synth', harmony: 'Triad', hexes: ['#180828', '#4c1d95', '#c084fc', '#f43f5e', '#fbbf24'] },
    { name: '🌌 Galaxy', harmony: 'Triad', hexes: ['#f0f0ff', '#a78bfa', '#7c3aed', '#06b6d4', '#0f0520'] },
    { name: '🌇 Tokyo Dusk', harmony: 'Triad', hexes: ['#190924', '#3f1651', '#8c2474', '#e24e75', '#ff9e9d'] },
    { name: '🛸 Deep Space Nebula', harmony: 'Triad', hexes: ['#050510', '#140c2d', '#683594', '#00d2ff', '#d89bfe'] },
    { name: '🦄 Pastel Unicorn', harmony: 'Triad', hexes: ['#f5f0ff', '#e0c3fc', '#8ec5fc', '#ffb5e2', '#edafb8'] },
    { name: '🍸 Velvet Lounge', harmony: 'Triad', hexes: ['#120817', '#2a1130', '#9b3092', '#309b78', '#f48fb1'] },
    { name: '🫐 Wild Berry', harmony: 'Triad', hexes: ['#12081d', '#321447', '#a83db5', '#3db5a8', '#f19eec'] },
    { name: '🔮 Mystic Quartz', harmony: 'Triad', hexes: ['#f3e8ff', '#d8b4fe', '#a855f7', '#06b6d4', '#160826'] },
    { name: '🌌 Twilight Glow', harmony: 'Triad', hexes: ['#e2d6ff', '#b39ce3', '#8260bd', '#3cbfae', '#100b21'] },

    // 🌗 4. Split-Complementary (แยกตรงข้าม)
    { name: '🍬 Pastel Candy', harmony: 'Split-Comp.', hexes: ['#fff8f0', '#ffb3ba', '#ffffba', '#baffc9', '#bae1ff'] },
    { name: '🌙 Moonlight Serenade', harmony: 'Split-Comp.', hexes: ['#0c1021', '#1d2a44', '#3b537f', '#997ec3', '#e4ecf7'] },
    { name: '🍧 Strawberry Bingsu', harmony: 'Split-Comp.', hexes: ['#fff0f3', '#ffccd5', '#ff4d6d', '#4dffb2', '#800f2f'] },
    { name: '🍑 Sweet Peach', harmony: 'Split-Comp.', hexes: ['#fff3eb', '#fecdd3', '#fda4af', '#38bdf8', '#881337'] },
    { name: '💎 Crystal Sapphire', harmony: 'Split-Comp.', hexes: ['#b3e0ff', '#438ecb', '#1e4f8a', '#cb8a43', '#030f26'] },
    { name: '⚓ Royal Navy', harmony: 'Split-Comp.', hexes: ['#dce6f5', '#2c5d9e', '#1a3a6b', '#9e6a2c', '#050c1e'] },
    { name: '🌸 Cherry Blossom Dusk', harmony: 'Split-Comp.', hexes: ['#f7c5dd', '#c76899', '#803c6b', '#3c8051', '#1f1124'] },
    { name: '🐬 Tropical Cyan', harmony: 'Split-Comp.', hexes: ['#b3f7f8', '#22ccd3', '#0d808a', '#8a0d4c', '#02181c'] },
    { name: '🦩 Flamingo Sunset', harmony: 'Split-Comp.', hexes: ['#fce4ec', '#f06292', '#b33b70', '#3bb37e', '#2b0d1e'] },
    { name: '🌸 Cherry Blossom Light', harmony: 'Split-Comp.', hexes: ['#fff5f7', '#fecdd3', '#f472b6', '#34d399', '#831843'] },

    // 🔲 5. Square (สี่เหลี่ยม 4 ทิศทาง)
    { name: '🍇 Vintage Plum', harmony: 'Square', hexes: ['#1e0a1c', '#4a154b', '#7c2570', '#257c31', '#f3d1ec'] },
    { name: '🏜️ Sahara Dunes', harmony: 'Square', hexes: ['#f5e3d3', '#e8a87c', '#c47343', '#4394c4', '#2b1810'] },
    { name: '🍵 Warm Genmaicha', harmony: 'Square', hexes: ['#ede6d1', '#b5ac8b', '#756f59', '#595f75', '#1c1b17'] },
    { name: '🥐 Butter Croissant', harmony: 'Square', hexes: ['#f9f1e1', '#dfa85b', '#a67238', '#386ca6', '#26190e'] },
    { name: '🏜️ Canyon Sunset', harmony: 'Square', hexes: ['#fadbcf', '#e67b5a', '#b84a32', '#32a0b8', '#2e110d'] },
    { name: '🍁 Autumn Fire', harmony: 'Square', hexes: ['#ffbd59', '#f25c00', '#ab2a00', '#0081ab', '#2b0700'] },
    { name: '🌴 Palm Island', harmony: 'Square', hexes: ['#bbf2db', '#44a191', '#24706c', '#702428', '#07191d'] },
    { name: '🪵 Sandalwood', harmony: 'Square', hexes: ['#efe0d3', '#b58363', '#7e533b', '#3b667e', '#21150f'] },
    { name: '🥐 Honey Toast', harmony: 'Square', hexes: ['#fff3c4', '#e09d24', '#9e6911', '#11469e', '#291a03'] },
    { name: '🌋 Lava Core', harmony: 'Square', hexes: ['#ff8080', '#d92626', '#8a0f0f', '#0f8a8a', '#1f0303'] },

    // 🔘 6. Monochromatic (สีเดียวเฉดต่าง)
    { name: '🖤 Midnight Lux', harmony: 'Monochromatic', hexes: ['#f8fafc', '#94a3b8', '#3b82f6', '#1d4ed8', '#0f172a'] },
    { name: '🪐 Saturn Rings', harmony: 'Monochromatic', hexes: ['#eedbce', '#b09e99', '#6d657b', '#37323e', '#151419'] },
    { name: '🍨 Taro Ice Cream', harmony: 'Monochromatic', hexes: ['#f7f4fc', '#d8c5ed', '#b392d6', '#7e57c2', '#311b92'] },
    { name: '🪨 Basalt Stone', harmony: 'Monochromatic', hexes: ['#d3d6df', '#7a7f8c', '#454952', '#25282e', '#121316'] },
    { name: '🪐 Starlight Voyage', harmony: 'Monochromatic', hexes: ['#d6e5ff', '#4172b8', '#1e3a70', '#0c1a3a', '#040817'] },

    // 🌗 7. Shades (น้ำหนักเฉดสี)
    { name: '🫐 Blueberry Muffin', harmony: 'Shades', hexes: ['#cbd5e1', '#64748b', '#334155', '#1e293b', '#0f172a'] },
    { name: '🍷 Pinot Noir', harmony: 'Shades', hexes: ['#f07d8b', '#b02334', '#78101f', '#420811', '#1a0307'] },
    { name: '🏙️ Metropolis Noir', harmony: 'Shades', hexes: ['#d0d0dc', '#78788a', '#3c3c48', '#1e1e24', '#0a0a0c'] },
    { name: '🍫 Dark Chocolate', harmony: 'Shades', hexes: ['#dbb8a7', '#804935', '#542d1f', '#331b12', '#170c08'] },
    { name: '🍵 Imperial Jade', harmony: 'Shades', hexes: ['#b4f7d4', '#31a673', '#186947', '#0b3826', '#03140e'] }
  ];

  // ═══ UI UTILS ═══
  function autoFitInput(input) {
    if (!input) return;
    const len = input.value.length || 1;
    input.style.width = Math.max(len, 5) + 'ch';
  }

  // ═══ COLOR MATH ═══
  function hsvToRgb(h, s, v) {
    s /= 100; v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
  }

  function hsvToHex(h, s, v) {
    return rgbToHex(...hsvToRgb(h, s, v));
  }

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    if (isNaN(n)) return [0, 0, 0];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return {
      h: Math.round(h),
      s: Math.round((max === 0 ? 0 : d / max) * 100),
      v: Math.round(max * 100)
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // Determine text color for contrast
  function textColorFor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
  }

  // Get approximate Thai / English color name
  function getColorName(h, s, v) {
    // 1. Achromatic (Black, White, Grays)
    if (v <= 14) return 'ดำ / Black';
    if (s <= 8) {
      if (v >= 90) return 'ขาว / White';
      if (v >= 72) return 'ขาวควันบุหรี่ / Off-White';
      if (v >= 45) return 'เทา / Gray';
      return 'เทาเข้ม / Dark Gray';
    }

    // 2. Muted / Low Saturation Colors (s <= 35)
    if (s <= 35) {
      if (v <= 35) return 'เทาอมมืด / Charcoal';
      if (h >= 345 || h <= 15) return 'ชมพูกะปิ / Dusty Rose';
      if (h > 15 && h <= 45) return 'ส้มเบจ / Warm Beige';
      if (h > 45 && h <= 70) return 'เหลืองครีม / Cream';
      if (h > 70 && h <= 165) return 'เขียวพาสเทล / Sage Green';
      if (h > 165 && h <= 215) return 'ฟ้าเทา / Steel Blue';
      if (h > 215 && h <= 265) return 'ม่วงลาเวนเดอร์ / Lavender';
      if (h > 265 && h < 345) return 'ม่วงพาสเทล / Mauve';
    }

    // 3. Dark / Deep Shades (v <= 38)
    if (v <= 38) {
      if (h >= 345 || h <= 15) return 'แดงเลือดหมู / Maroon';
      if (h > 15 && h <= 45) return 'น้ำตาลเข้ม / Dark Brown';
      if (h > 45 && h <= 75) return 'เขียวขี้ม้า / Dark Olive';
      if (h > 75 && h <= 165) return 'เขียวแก่ / Dark Green';
      if (h > 165 && h <= 250) return 'น้ำเงินเข้ม / Navy Blue';
      if (h > 250 && h <= 315) return 'ม่วงเข้ม / Dark Purple';
      if (h > 315 && h < 345) return 'ชมพูเข้ม / Dark Magenta';
    }

    // 4. Vibrant Colors
    if (h >= 345 || h <= 12) {
      if (s <= 65) return 'ชมพูแดง / Dusty Rose';
      return 'แดงสด / Crimson Red';
    }
    if (h > 12 && h <= 28) {
      if (v >= 70) return 'ส้มแสด / Coral Orange';
      return 'น้ำตาลส้ม / Terracotta';
    }
    if (h > 28 && h <= 48) {
      if (s <= 55) return 'ส้มพีช / Peach';
      return 'ส้มทอง / Amber Gold';
    }
    if (h > 48 && h <= 68) {
      if (v >= 80) return 'เหลืองสด / Bright Yellow';
      return 'เหลืองมัสตาร์ด / Mustard Yellow';
    }
    if (h > 68 && h <= 90) return 'เขียวตอง / Lime Green';
    if (h > 90 && h <= 145) {
      if (v >= 70) return 'เขียวมรกต / Emerald Green';
      return 'เขียวไผ่ / Forest Green';
    }
    if (h > 145 && h <= 175) return 'เขียวมินต์ / Mint Green';
    if (h > 175 && h <= 198) return 'ฟ้าอมเขียว / Teal Blue';
    if (h > 198 && h <= 222) return 'ฟ้าสดใส / Sky Blue';
    if (h > 222 && h <= 252) {
      if (v >= 65) return 'น้ำเงินไพลิน / Sapphire Blue';
      return 'น้ำเงินคราม / Royal Blue';
    }
    if (h > 252 && h <= 285) return 'ม่วงอเมทิสต์ / Amethyst Purple';
    if (h > 285 && h <= 318) return 'ม่วงกล้วยไม้ / Orchid Purple';
    if (h > 318 && h < 345) return 'ชมพูสด / Hot Pink';

    return 'ชมพูแดง / Dusty Rose';
  }

  // ═══ CURATED SMART PALETTE ENGINE ═══

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickCuratedHue() {
    const zone = HUE_ZONES[Math.floor(Math.random() * HUE_ZONES.length)];
    return rand(zone.min, zone.max);
  }

  // ─── Tone Slot S & V Generator (Light, Pastel, Bright, Vivid, Muted, Dark, Deep, Neutral) ───
  function getToneSlotSV(tone, role, isDark, harmony) {
    if (paletteTargetMode === 'painting') {
      switch (tone) {
        case 'light':
          switch (role) {
            case 'deepShadow': return { s: rand(18, 35), v: rand(28, 45) };
            case 'coreShadow': return { s: rand(15, 30), v: rand(52, 68) };
            case 'baseTone':   return { s: rand(22, 42), v: rand(78, 90) };
            case 'keyLight':   return { s: rand(8, 20),  v: rand(92, 98) };
            case 'rimLight':   return { s: rand(22, 45), v: rand(88, 97) };
            default:           return { s: rand(15, 35), v: rand(60, 85) };
          }
        case 'pastel':
          switch (role) {
            case 'deepShadow': return { s: rand(22, 38), v: rand(32, 48) };
            case 'coreShadow': return { s: rand(18, 32), v: rand(58, 74) };
            case 'baseTone':   return { s: rand(20, 36), v: rand(85, 94) };
            case 'keyLight':   return { s: rand(8, 18),  v: rand(95, 99) };
            case 'rimLight':   return { s: rand(25, 42), v: rand(90, 98) };
            default:           return { s: rand(18, 35), v: rand(75, 92) };
          }
        case 'bright':
          switch (role) {
            case 'deepShadow': return { s: rand(45, 70), v: rand(15, 28) };
            case 'coreShadow': return { s: rand(40, 65), v: rand(32, 50) };
            case 'baseTone':   return { s: rand(58, 82), v: rand(72, 88) };
            case 'keyLight':   return { s: rand(20, 40), v: rand(90, 98) };
            case 'rimLight':   return { s: rand(65, 90), v: rand(85, 98) };
            default:           return { s: rand(45, 75), v: rand(50, 80) };
          }
        case 'vivid':
          switch (role) {
            case 'deepShadow': return { s: rand(65, 90), v: rand(10, 22) };
            case 'coreShadow': return { s: rand(60, 85), v: rand(26, 44) };
            case 'baseTone':   return { s: rand(78, 98), v: rand(62, 85) };
            case 'keyLight':   return { s: rand(35, 60), v: rand(88, 98) };
            case 'rimLight':   return { s: rand(85, 100),v: rand(80, 100) };
            default:           return { s: rand(60, 90), v: rand(40, 75) };
          }
        case 'muted':
          switch (role) {
            case 'deepShadow': return { s: rand(25, 45), v: rand(14, 25) };
            case 'coreShadow': return { s: rand(22, 40), v: rand(28, 44) };
            case 'baseTone':   return { s: rand(24, 44), v: rand(50, 68) };
            case 'keyLight':   return { s: rand(12, 25), v: rand(78, 88) };
            case 'rimLight':   return { s: rand(28, 48), v: rand(65, 80) };
            default:           return { s: rand(20, 40), v: rand(35, 65) };
          }
        case 'dark':
          switch (role) {
            case 'deepShadow': return { s: rand(35, 65), v: rand(5, 14) };
            case 'coreShadow': return { s: rand(30, 60), v: rand(15, 25) };
            case 'baseTone':   return { s: rand(40, 70), v: rand(28, 45) };
            case 'keyLight':   return { s: rand(20, 45), v: rand(55, 72) };
            case 'rimLight':   return { s: rand(45, 75), v: rand(65, 82) };
            default:           return { s: rand(30, 60), v: rand(20, 40) };
          }
        case 'deep':
          switch (role) {
            case 'deepShadow': return { s: rand(55, 80), v: rand(8, 16) };
            case 'coreShadow': return { s: rand(60, 85), v: rand(18, 32) };
            case 'baseTone':   return { s: rand(72, 96), v: rand(38, 58) };
            case 'keyLight':   return { s: rand(40, 65), v: rand(70, 88) };
            case 'rimLight':   return { s: rand(72, 96), v: rand(58, 82) };
            default:           return { s: rand(50, 80), v: rand(25, 50) };
          }
        case 'neutral':
          switch (role) {
            case 'deepShadow': return { s: rand(4, 12), v: rand(8, 18) };
            case 'coreShadow': return { s: rand(3, 10), v: rand(24, 38) };
            case 'baseTone':   return { s: rand(4, 14), v: rand(48, 65) };
            case 'keyLight':   return { s: rand(2, 8),  v: rand(78, 90) };
            case 'rimLight':   return { s: rand(3, 10), v: rand(88, 97) };
            default:           return { s: rand(2, 10), v: rand(40, 70) };
          }
        case 'all':
        default:
          switch (role) {
            case 'deepShadow': return { s: (harmony === 'monochromatic') ? rand(30, 55) : rand(45, 80), v: rand(8, 22) };
            case 'coreShadow': return { s: (harmony === 'monochromatic') ? rand(25, 50) : rand(40, 72), v: rand(24, 42) };
            case 'baseTone':   return { s: rand(35, 65), v: rand(55, 85) };
            case 'keyLight':   return { s: rand(22, 50), v: rand(82, 96) };
            case 'rimLight':   return { s: (harmony === 'monochromatic') ? rand(50, 80) : rand(55, 95), v: (harmony === 'shades') ? rand(50, 72) : rand(68, 95) };
            default:           return { s: rand(40, 80), v: rand(20, 50) };
          }
      }
    } else {
      // 📐 GRAPHIC MODE
      switch (tone) {
        case 'light':
          switch (role) {
            case 'bg':        return { s: rand(4, 12),  v: rand(96, 99) };
            case 'surface':   return { s: rand(10, 22), v: rand(90, 95) };
            case 'primary':   return { s: rand(25, 45), v: rand(86, 96) };
            case 'secondary': return { s: rand(22, 42), v: rand(85, 95) };
            case 'text':      return { s: rand(15, 30), v: rand(18, 30) };
            default:          return { s: rand(15, 35), v: rand(85, 95) };
          }
        case 'pastel':
          switch (role) {
            case 'bg':        return { s: rand(6, 14),  v: rand(97, 100) };
            case 'surface':   return { s: rand(14, 25), v: rand(92, 96) };
            case 'primary':   return { s: rand(22, 38), v: rand(90, 98) };
            case 'secondary': return { s: rand(18, 35), v: rand(90, 97) };
            case 'text':      return { s: rand(20, 40), v: rand(22, 38) };
            default:          return { s: rand(15, 35), v: rand(90, 98) };
          }
        case 'bright':
          switch (role) {
            case 'bg':        return { s: rand(6, 16),  v: rand(94, 98) };
            case 'surface':   return { s: rand(25, 45), v: rand(86, 94) };
            case 'primary':   return { s: rand(62, 88), v: rand(85, 98) };
            case 'secondary': return { s: rand(58, 85), v: rand(82, 96) };
            case 'text':      return { s: rand(70, 92), v: rand(15, 28) };
            default:          return { s: rand(50, 80), v: rand(75, 95) };
          }
        case 'vivid':
          switch (role) {
            case 'bg':        return { s: rand(25, 55), v: rand(10, 18) };
            case 'surface':   return { s: rand(60, 85), v: rand(25, 45) };
            case 'primary':   return { s: rand(85, 100),v: rand(85, 100) };
            case 'secondary': return { s: rand(82, 100),v: rand(80, 100) };
            case 'text':      return { s: rand(90, 100),v: rand(92, 100) };
            default:          return { s: rand(80, 100),v: rand(75, 98) };
          }
        case 'muted':
          switch (role) {
            case 'bg':        return { s: rand(8, 18),  v: rand(88, 94) };
            case 'surface':   return { s: rand(15, 28), v: rand(75, 85) };
            case 'primary':   return { s: rand(25, 48), v: rand(55, 75) };
            case 'secondary': return { s: rand(22, 45), v: rand(50, 72) };
            case 'text':      return { s: rand(12, 28), v: rand(18, 30) };
            default:          return { s: rand(20, 42), v: rand(45, 70) };
          }
        case 'dark':
          switch (role) {
            case 'bg':        return { s: rand(15, 35), v: rand(6, 14) };
            case 'surface':   return { s: rand(20, 45), v: rand(14, 24) };
            case 'primary':   return { s: rand(45, 75), v: rand(28, 48) };
            case 'secondary': return { s: rand(40, 70), v: rand(22, 42) };
            case 'text':      return { s: rand(10, 25), v: rand(86, 96) };
            default:          return { s: rand(35, 65), v: rand(20, 40) };
          }
        case 'deep':
          switch (role) {
            case 'bg':        return { s: rand(35, 60), v: rand(8, 16) };
            case 'surface':   return { s: rand(50, 75), v: rand(18, 30) };
            case 'primary':   return { s: rand(75, 98), v: rand(38, 58) };
            case 'secondary': return { s: rand(70, 95), v: rand(32, 52) };
            case 'text':      return { s: rand(60, 90), v: rand(78, 96) };
            default:          return { s: rand(65, 95), v: rand(30, 55) };
          }
        case 'neutral':
          switch (role) {
            case 'bg':        return { s: rand(2, 8),   v: rand(94, 98) };
            case 'surface':   return { s: rand(4, 12),  v: rand(82, 90) };
            case 'primary':   return { s: rand(6, 16),  v: rand(48, 68) };
            case 'secondary': return { s: rand(5, 14),  v: rand(28, 44) };
            case 'text':      return { s: rand(2, 10),  v: rand(10, 20) };
            default:          return { s: rand(3, 12),  v: rand(35, 75) };
          }
        case 'all':
        default:
          switch (role) {
            case 'bg':        return { s: isDark ? rand(5, 18) : rand(3, 12), v: isDark ? rand(6, 14) : rand(95, 99) };
            case 'surface':   return { s: isDark ? rand(8, 22) : rand(5, 18), v: isDark ? rand(16, 28) : rand(88, 95) };
            case 'primary':   return { s: rand(65, 92), v: rand(70, 95) };
            case 'secondary': return { s: (harmony === 'monochromatic') ? rand(40, 65) : rand(55, 85), v: (harmony === 'shades') ? rand(40, 60) : rand(60, 88) };
            case 'text':      return { s: isDark ? rand(2, 10) : rand(10, 25), v: isDark ? rand(88, 97) : rand(10, 22) };
            default:          return { s: isDark ? rand(30, 85) : rand(25, 80), v: isDark ? rand(45, 90) : rand(40, 95) };
          }
      }
    }
  }

  // Generate a beautiful palette using 60-30-10 rule (Graphic) or Hue Shifting (Painting) + Tone Mode
  function generateSmartPalette(count = 5, overrideBaseHue = null) {
    const baseHue = (overrideBaseHue !== null) ? overrideBaseHue : pickCuratedHue();
    const isDark = (activeTone === 'dark' || activeTone === 'vivid' || activeTone === 'deep') ? true :
      (activeTone === 'light' || activeTone === 'pastel' || activeTone === 'bright') ? false :
      (Math.random() > 0.5);

    const colors = [];

    // Helper for harmony offset
    function harmonyOffset(mode, angles) {
      switch (mode) {
        case 'complementary': return 180 + rand(-10, 10);
        case 'triad': return (angles || [120, 240])[0] + rand(-8, 8);
        case 'split': return (Math.random() > 0.5 ? 150 : 210) + rand(-8, 8);
        case 'square': return (angles || [90, 180, 270])[0] + rand(-8, 8);
        case 'monochromatic': return 0;
        case 'shades': return 0;
        case 'custom': return rand(30, 330);
        case 'analogous':
        default: return rand(18, 42);
      }
    }

    if (paletteTargetMode === 'painting') {
      // 🎨 PAINTING MODE — Beautiful Lighting Environment + Tone Constraints
      // Slot 0: Deep Shadow (Coolest, saturated dark)
      const dsHue = (activeTone === 'neutral') ? baseHue : (baseHue + rand(25, 45)) % 360;
      const dsSV = getToneSlotSV(activeTone, 'deepShadow', isDark, activeHarmony);
      colors.push({ h: dsHue, s: dsSV.s, v: dsSV.v });

      // Slot 1: Core Shadow (Moderate dark with harmony influence)
      const csOff = harmonyOffset(activeHarmony, [120]);
      const csHue = (activeTone === 'neutral') ? baseHue : (baseHue + Math.round(csOff * 0.15) + rand(15, 30) + 360) % 360;
      const csSV = getToneSlotSV(activeTone, 'coreShadow', isDark, activeHarmony);
      colors.push({ h: csHue, s: csSV.s, v: csSV.v });

      // Slot 2: Base Tone / Local Color
      const btSV = getToneSlotSV(activeTone, 'baseTone', isDark, activeHarmony);
      colors.push({ h: baseHue, s: btSV.s, v: btSV.v });

      // Slot 3: Key Light (Warm hue shift, brighter)
      const klHue = (activeTone === 'neutral') ? baseHue : (baseHue - rand(15, 30) + 360) % 360;
      const klSV = getToneSlotSV(activeTone, 'keyLight', isDark, activeHarmony);
      colors.push({ h: klHue, s: klSV.s, v: klSV.v });

      // Slot 4: Rim Light / Accent (Harmony-driven)
      const rimOff = harmonyOffset(activeHarmony, [120, 240]);
      const rimHue = (activeTone === 'neutral') ? baseHue : (baseHue + rimOff + 360) % 360;
      const rimSV = getToneSlotSV(activeTone, 'rimLight', isDark, activeHarmony);
      colors.push({ h: rimHue, s: rimSV.s, v: rimSV.v });
    } else {
      // 📐 GRAPHIC MODE — 60-30-10 Rule + Tone Constraints
      // Slot 0: Background
      const bgSV = getToneSlotSV(activeTone, 'bg', isDark, activeHarmony);
      colors.push({ h: baseHue, s: bgSV.s, v: bgSV.v });

      // Slot 1: Surface
      const surfSV = getToneSlotSV(activeTone, 'surface', isDark, activeHarmony);
      colors.push({ h: (baseHue + rand(-10, 10) + 360) % 360, s: surfSV.s, v: surfSV.v });

      // Slot 2: Primary Accent / Base Color
      const priSV = getToneSlotSV(activeTone, 'primary', isDark, activeHarmony);
      colors.push({ h: baseHue, s: priSV.s, v: priSV.v });

      // Slot 3: Secondary Accent (harmony-based)
      let secHue = baseHue;
      switch (activeHarmony) {
        case 'complementary': secHue = (baseHue + 180 + rand(-10, 10) + 360) % 360; break;
        case 'triad': secHue = (baseHue + 120 + rand(-10, 10) + 360) % 360; break;
        case 'split': secHue = (baseHue + 150 + rand(-10, 10) + 360) % 360; break;
        case 'square': secHue = (baseHue + 90 + rand(-10, 10) + 360) % 360; break;
        case 'monochromatic': secHue = baseHue; break;
        case 'shades': secHue = baseHue; break;
        case 'custom': secHue = pickCuratedHue(); break;
        case 'analogous':
        default: secHue = (baseHue + rand(25, 45)) % 360; break;
      }
      if (activeTone === 'neutral') secHue = (baseHue + 180) % 360;
      const secSV = getToneSlotSV(activeTone, 'secondary', isDark, activeHarmony);
      colors.push({ h: secHue, s: secSV.s, v: secSV.v });

      // Slot 4: Text / Accent
      const txtHue = (activeTone === 'pastel' || activeTone === 'vivid' || activeTone === 'deep')
        ? (baseHue + 180) % 360
        : baseHue;
      const txtSV = getToneSlotSV(activeTone, 'text', isDark, activeHarmony);
      colors.push({ h: txtHue, s: txtSV.s, v: txtSV.v });
    }

    // Slots 5+: Generate additional harmonious colors if count > 5
    while (colors.length < count) {
      const idx = colors.length;
      let extraHue = baseHue;
      if (activeHarmony === 'complementary') extraHue = (baseHue + 180 + (idx - 4) * 30) % 360;
      else if (activeHarmony === 'triad') extraHue = (baseHue + 240 + (idx - 4) * 30) % 360;
      else extraHue = (baseHue + (idx - 4) * 50 + rand(-15, 15) + 360) % 360;

      const extraSV = getToneSlotSV(activeTone, 'extra', isDark, activeHarmony);
      colors.push({ h: extraHue, s: extraSV.s, v: extraSV.v });
    }

    // 🎨 Painting mode: sort all colors by Value (dark → light)
    if (paletteTargetMode === 'painting') {
      colors.sort((a, b) => a.v - b.v);
    }

    return colors;
  }

  function initPalette() {
    palette = generateSmartPalette(5).map(c => ({
      ...c,
      hex: hsvToHex(c.h, c.s, c.v),
      locked: false
    }));
  }

  function randomizePalette() {
    // If Primary Accent (slot 2) or any color is locked, use its Hue as the base anchor!
    let lockedBaseHue = null;
    if (palette[2] && palette[2].locked) {
      lockedBaseHue = palette[2].h;
    } else {
      const firstLocked = palette.find(c => c.locked);
      if (firstLocked) lockedBaseHue = firstLocked.h;
    }

    const newColors = generateSmartPalette(palette.length, lockedBaseHue);
    palette.forEach((col, i) => {
      if (!col.locked && newColors[i]) {
        col.h = newColors[i].h;
        col.s = newColors[i].s;
        col.v = newColors[i].v;
        col.hex = hsvToHex(col.h, col.s, col.v);
      }
    });

    // 🎨 Painting mode: re-sort unlocked colors dark → light
    if (paletteTargetMode === 'painting') {
      const unlocked = [];
      const lockedMap = {};
      palette.forEach((col, i) => {
        if (col.locked) lockedMap[i] = col;
        else unlocked.push(col);
      });
      unlocked.sort((a, b) => a.v - b.v);
      let ui = 0;
      for (let i = 0; i < palette.length; i++) {
        if (!lockedMap[i]) {
          palette[i] = unlocked[ui++];
        }
      }
    }

    renderBars();
    updateInspector();
  }

  // Apply harmony from base (slot 2)
  function calculateHarmonyPalette(heroHex, harmonyMode) {
    const [r, g, b] = hexToRgb(heroHex);
    const base = rgbToHsv(r, g, b);
    const key = (harmonyMode || 'analogous').toLowerCase();
    const map = { 'analogous': 'analogous', 'complementary': 'complementary', 'triad': 'triad', 'split-comp.': 'split', 'split-comp': 'split', 'square': 'square', 'monochromatic': 'monochromatic', 'shades': 'shades' };
    const mode = map[key] || 'analogous';

    const isDarkBg = base.v < 50;
    
    // Slot 0: Background
    const bgH = base.h;
    const bgS = isDarkBg ? 12 : 6;
    const bgV = isDarkBg ? 10 : 96;

    // Slot 1: Surface
    const surfH = (base.h + 5 + 360) % 360;
    const surfS = isDarkBg ? 16 : 10;
    const surfV = isDarkBg ? 20 : 90;

    // Slot 2: Primary Accent (Hero)
    const priH = base.h;
    const priS = base.s;
    const priV = base.v;

    // Slot 3: Secondary Accent
    let secH = base.h;
    switch (mode) {
      case 'complementary': secH = (base.h + 180) % 360; break;
      case 'triad': secH = (base.h + 120) % 360; break;
      case 'split': secH = (base.h + 150) % 360; break;
      case 'square': secH = (base.h + 90) % 360; break;
      case 'monochromatic': secH = base.h; break;
      case 'shades': secH = base.h; break;
      case 'analogous':
      default: secH = (base.h + 35) % 360; break;
    }
    const secS = (mode === 'monochromatic') ? 50 : Math.min(100, Math.max(35, base.s));
    const secV = (mode === 'shades') ? 50 : Math.min(100, Math.max(35, base.v));

    // Slot 4: Text Accent
    const txtH = base.h;
    const txtS = isDarkBg ? 5 : 18;
    const txtV = isDarkBg ? 92 : 16;

    return [
      hsvToHex(bgH, bgS, bgV),
      hsvToHex(surfH, surfS, surfV),
      hsvToHex(priH, priS, priV),
      hsvToHex(secH, secS, secV),
      hsvToHex(txtH, txtS, txtV)
    ];
  }

  function applyHarmonyFromBase() {
    const base = palette[2]; // Primary accent is always the "hero"
    if (!base) return;

    palette.forEach((col, i) => {
      if (col.locked || i === 2) return;

      const isDarkBg = palette[0].v < 50;

      if (paletteTargetMode === 'painting') {
        // 🎨 PAINTING HARMONY ENGINE — Lighting Roles + Tone
        // Helper for harmony offset
        function _harmonyOff(mode, angles) {
          switch (mode) {
            case 'complementary': return 180 + rand(-10, 10);
            case 'triad': return (angles || [120, 240])[0] + rand(-8, 8);
            case 'split': return (Math.random() > 0.5 ? 150 : 210) + rand(-8, 8);
            case 'square': return (angles || [90, 180, 270])[0] + rand(-8, 8);
            case 'monochromatic': return 0;
            case 'shades': return 0;
            case 'custom': return rand(30, 330);
            case 'analogous':
            default: return rand(18, 42);
          }
        }

        if (i === 0) {
          // ─── Deep Shadow (Coolest, saturated dark) ───
          col.h = (activeTone === 'neutral') ? base.h : (base.h + rand(25, 45)) % 360;
          const sv = getToneSlotSV(activeTone, 'deepShadow', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 1) {
          // ─── Core Shadow (Moderate dark with harmony influence) ───
          const off = _harmonyOff(activeHarmony, [120]);
          col.h = (activeTone === 'neutral') ? base.h : (base.h + Math.round(off * 0.15) + rand(15, 30) + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'coreShadow', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 3) {
          // ─── Key Light (Warm hue shift, brighter) ───
          col.h = (activeTone === 'neutral') ? base.h : (base.h - rand(15, 30) + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'keyLight', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 4) {
          // ─── Rim Light / Accent (Harmony-driven, vivid) ───
          const rimOff = _harmonyOff(activeHarmony, [120, 240]);
          col.h = (activeTone === 'neutral') ? base.h : (base.h + rimOff + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'rimLight', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i >= 5) {
          // ─── Extra Accent (Harmony-shifted) ───
          const extraOff = _harmonyOff(activeHarmony, [120]);
          col.h = (base.h + extraOff + (i - 5) * 35 + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'extra', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        }
      } else {
        // 📐 GRAPHIC HARMONY ENGINE + Tone
        if (i === 0) {
          // Background
          col.h = base.h;
          const sv = getToneSlotSV(activeTone, 'bg', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 1) {
          // Surface
          col.h = (base.h + rand(-10, 10) + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'surface', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 3) {
          // Secondary
          let secHue = base.h;
          switch (activeHarmony) {
            case 'complementary': secHue = (base.h + 180) % 360; break;
            case 'triad': secHue = (base.h + 120) % 360; break;
            case 'split': secHue = (base.h + 150) % 360; break;
            case 'square': secHue = (base.h + 90) % 360; break;
            case 'monochromatic': secHue = base.h; break;
            case 'shades': secHue = base.h; break;
            case 'custom': secHue = pickCuratedHue(); break;
            case 'analogous':
            default: secHue = (base.h + rand(25, 45)) % 360; break;
          }
          if (activeTone === 'neutral') secHue = (base.h + 180) % 360;
          col.h = secHue;
          const sv = getToneSlotSV(activeTone, 'secondary', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i === 4) {
          // Text / Accent
          col.h = (activeTone === 'pastel' || activeTone === 'vivid' || activeTone === 'deep')
            ? (base.h + 180) % 360
            : base.h;
          const sv = getToneSlotSV(activeTone, 'text', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        } else if (i >= 5) {
          // Extra color slots
          col.h = (base.h + (i - 4) * 45 + rand(-15, 15) + 360) % 360;
          const sv = getToneSlotSV(activeTone, 'extra', isDarkBg, activeHarmony);
          col.s = sv.s; col.v = sv.v;
        }
      }

      col.hex = hsvToHex(col.h, col.s, col.v);
    });

    // 🎨 Painting mode: re-sort by Value (dark → light), preserving locked positions
    if (paletteTargetMode === 'painting') {
      const unlocked = [];
      const lockedMap = {};
      palette.forEach((col, i) => {
        if (col.locked) lockedMap[i] = col;
        else unlocked.push(col);
      });
      unlocked.sort((a, b) => a.v - b.v);
      let ui = 0;
      for (let i = 0; i < palette.length; i++) {
        if (!lockedMap[i]) {
          palette[i] = unlocked[ui++];
        }
      }
    }

    renderBars();
    updateInspector();
  }

  // ═══ RENDER COLOR BARS ═══

  function renderBars() {
    const container = document.getElementById('cp-bars-container');
    if (!container) return;

    container.innerHTML = '';

    palette.forEach((col, idx) => {
      const txtCol = textColorFor(col.hex);
      const colorName = getColorName(col.h, col.s, col.v);
      const roleNames = (paletteTargetMode === 'painting')
        ? ['Deep Shadow', 'Core Shadow', 'Base Tone ⭐', 'Key Light', 'Rim / Accent']
        : ['Background', 'Surface', 'Primary ⭐', 'Secondary', 'Text'];

      const bar = document.createElement('div');
      bar.className = 'cp-color-bar';
      bar.style.background = col.hex;
      bar.style.color = txtCol;
      bar.setAttribute('draggable', 'true');
      bar.dataset.idx = idx;

      if (inspectorIdx === idx) bar.classList.add('is-inspecting');

      bar.innerHTML = `
        <button class="cp-bar-lock ${col.locked ? 'is-locked' : ''}" data-lock="${idx}" title="${col.locked ? 'ปลดล็อค' : 'ล็อคสีนี้'}">
          ${col.locked ? '🔒' : '🔓'}
        </button>
        ${palette.length > 2 ? `<button class="cp-bar-remove" data-remove="${idx}" title="ลบแถบสีนี้">✕</button>` : ''}
        <div class="cp-bar-drag" title="ลากเพื่อสลับตำแหน่ง">
          <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>
        </div>
        ${idx < palette.length - 1 && palette.length < 10 ? `<button class="cp-add-bar-btn" data-add-after="${idx}" title="เพิ่มสีตรงนี้">+</button>` : ''}
        <span class="cp-bar-name" style="color:${txtCol}">${roleNames[idx] || ''}</span>
        <span class="cp-bar-hex-label" style="color:${txtCol}" data-copy-hex="${idx}">${col.hex}</span>
      `;

      // Click bar to open inspector
      bar.addEventListener('click', (e) => {
        if (e.target.closest('.cp-bar-lock') || e.target.closest('.cp-bar-remove') ||
            e.target.closest('.cp-bar-drag') || e.target.closest('.cp-add-bar-btn') ||
            e.target.closest('.cp-bar-hex-label')) return;
        openInspector(idx);
      });

      // Lock
      const lockBtn = bar.querySelector('[data-lock]');
      if (lockBtn) {
        lockBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          palette[idx].locked = !palette[idx].locked;
          renderBars();
        });
      }

      // Remove
      const removeBtn = bar.querySelector('[data-remove]');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (palette.length <= 2) return;
          palette.splice(idx, 1);
          if (inspectorIdx === idx) inspectorIdx = -1;
          else if (inspectorIdx > idx) inspectorIdx--;
          renderBars();
          updateInspector();
        });
      }

      // Add bar
      const addBtn = bar.querySelector('[data-add-after]');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (palette.length >= 10) return;
          const newH = rand(0, 360);
          const newCol = { h: newH, s: rand(50, 85), v: rand(60, 90), hex: '', locked: false };
          newCol.hex = hsvToHex(newCol.h, newCol.s, newCol.v);
          palette.splice(idx + 1, 0, newCol);
          renderBars();
        });
      }

      // Copy hex
      const hexLabel = bar.querySelector('[data-copy-hex]');
      if (hexLabel) {
        hexLabel.addEventListener('click', (e) => {
          e.stopPropagation();
          copyToClipboard(col.hex, `คัดลอก ${col.hex} แล้ว!`);
        });
      }

      // Drag events
      bar.addEventListener('dragstart', (e) => {
        dragSrcIdx = idx;
        bar.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      bar.addEventListener('dragend', () => {
        bar.classList.remove('dragging');
        dragSrcIdx = -1;
        document.querySelectorAll('.cp-color-bar').forEach(b => b.classList.remove('drag-over'));
      });

      bar.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragSrcIdx !== -1 && dragSrcIdx !== idx) {
          bar.classList.add('drag-over');
        }
      });

      bar.addEventListener('dragleave', () => {
        bar.classList.remove('drag-over');
      });

      bar.addEventListener('drop', (e) => {
        e.preventDefault();
        bar.classList.remove('drag-over');
        if (dragSrcIdx !== -1 && dragSrcIdx !== idx) {
          const movedItem = palette.splice(dragSrcIdx, 1)[0];
          palette.splice(idx, 0, movedItem);
          if (inspectorIdx === dragSrcIdx) inspectorIdx = idx;
          renderBars();
        }
      });

      container.appendChild(bar);
    });
  }

  // ═══ COLOR INSPECTOR ═══

  function openInspector(idx) {
    inspectorIdx = idx;
    const inspector = document.getElementById('cp-inspector');
    if (inspector) {
      inspector.classList.add('open');
      updateInspector();
    }
    renderBars();
    if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
  }

  function closeInspector() {
    inspectorIdx = -1;
    const inspector = document.getElementById('cp-inspector');
    if (inspector) inspector.classList.remove('open');
    renderBars();
    if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
  }

  function updateInspector() {
    const inspector = document.getElementById('cp-inspector');
    if (!inspector || inspectorIdx < 0 || inspectorIdx >= palette.length) return;

    const col = palette[inspectorIdx];
    const [r, g, b] = hexToRgb(col.hex);
    const hsl = rgbToHsl(r, g, b);

    // Update swatch
    const swatch = inspector.querySelector('.cp-inspector-swatch');
    if (swatch) swatch.style.background = col.hex;

    // Update title
    const title = inspector.querySelector('.cp-inspector-title span');
    const colorName = getColorName(col.h, col.s, col.v);
    if (title) title.textContent = `สี #${inspectorIdx + 1}${colorName ? ' — ' + colorName : ''}`;

    // Update slider backgrounds
    const satTrack = inspector.querySelector('.cp-slider-track.sat');
    if (satTrack) satTrack.style.background = `linear-gradient(to right, ${hsvToHex(col.h, 0, col.v)}, ${hsvToHex(col.h, 100, col.v)})`;

    const valTrack = inspector.querySelector('.cp-slider-track.val');
    if (valTrack) valTrack.style.background = `linear-gradient(to right, #000, ${hsvToHex(col.h, col.s, 100)})`;

    // Update slider positions
    const hThumb = inspector.querySelector('.cp-slider-thumb.h-thumb');
    if (hThumb) hThumb.style.left = `${(col.h / 360) * 100}%`;

    const sThumb = inspector.querySelector('.cp-slider-thumb.s-thumb');
    if (sThumb) sThumb.style.left = `${col.s}%`;

    const vThumb = inspector.querySelector('.cp-slider-thumb.v-thumb');
    if (vThumb) vThumb.style.left = `${col.v}%`;

    // Update slider values
    const hVal = inspector.querySelector('.cp-slider-value.h-val');
    if (hVal) hVal.textContent = `${col.h}°`;

    const sVal = inspector.querySelector('.cp-slider-value.s-val');
    if (sVal) sVal.textContent = `${col.s}%`;

    const vVal = inspector.querySelector('.cp-slider-value.v-val');
    if (vVal) vVal.textContent = `${col.v}%`;

    // Update code inputs
    const hexInput = inspector.querySelector('.cp-hex-field');
    if (hexInput && document.activeElement !== hexInput) {
      hexInput.value = col.hex;
      autoFitInput(hexInput);
    }

    const rgbInput = inspector.querySelector('.cp-rgb-field');
    if (rgbInput && document.activeElement !== rgbInput) {
      rgbInput.value = `${r}, ${g}, ${b}`;
      autoFitInput(rgbInput);
    }

    const hslInput = inspector.querySelector('.cp-hsl-field');
    if (hslInput && document.activeElement !== hslInput) {
      hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
      autoFitInput(hslInput);
    }
  }

  function handleSliderInteraction(e, type) {
    if (inspectorIdx < 0 || inspectorIdx >= palette.length) return;
    const track = e.currentTarget || e.target.closest('.cp-slider-track');
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const col = palette[inspectorIdx];

    if (type === 'h') col.h = Math.round(ratio * 360);
    else if (type === 's') col.s = Math.round(ratio * 100);
    else if (type === 'v') col.v = Math.round(ratio * 100);

    col.hex = hsvToHex(col.h, col.s, col.v);
    renderBars();
    updateInspector();
  }

  // ═══ PRESETS & SAVED PALETTES MANAGER ═══
  const STORAGE_KEY = 'toru_saved_color_palettes';
  let activeSavedTab = 'saved'; // 'saved' | 'presets'

  function getSavedPalettesFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function savePalettesToStorage(savedArray) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArray));
    } catch (e) {
      console.warn('Unable to write to localStorage', e);
    }
  }

  window.toggleSavedDrawer = function () {
    const drawer = document.getElementById('cp-saved-drawer');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
    } else {
      drawer.classList.add('open');
      renderSavedList();
    }
    if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
  };

  window.switchSavedTab = function (tab) {
    activeSavedTab = tab;
    const tabSaved = document.getElementById('cp-tab-saved');
    const tabPresets = document.getElementById('cp-tab-presets');
    if (tabSaved && tabPresets) {
      if (tab === 'saved') {
        tabSaved.classList.add('active');
        tabPresets.classList.remove('active');
      } else {
        tabSaved.classList.remove('active');
        tabPresets.classList.add('active');
      }
      tabPresets.textContent = `🎨 Presets สำเร็จรูป (${CURATED_PALETTES.length})`;
    }
    renderSavedList();
  };

  window.saveCurrentPaletteWithInput = function () {
    const input = document.getElementById('cp-palette-name-input');
    const name = input ? input.value.trim() : '';
    window.saveCurrentPalette(name);
  };

  window.saveCurrentPalette = function (customName) {
    const saved = getSavedPalettesFromStorage();
    const hexes = palette.map(c => c.hex);
    
    let finalName = customName;
    if (!finalName) {
      const heroColorName = (palette[2] ? getColorName(palette[2].h, palette[2].s, palette[2].v) : '') || 'Custom';
      finalName = `${heroColorName} Palette #${saved.length + 1}`;
    }

    const newItem = {
      id: 'palette_' + Date.now(),
      name: finalName,
      hexes: hexes,
      createdAt: new Date().toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    saved.unshift(newItem);
    savePalettesToStorage(saved);
    showToast(`บันทึกชุดสี "${finalName}" เรียบร้อยแล้ว! ⭐`);
    
    // Clear search/name input bar so all saved palettes are listed
    const input = document.getElementById('cp-palette-name-input');
    if (input) input.value = '';

    const drawer = document.getElementById('cp-saved-drawer');
    if (drawer && !drawer.classList.contains('open')) {
      drawer.classList.add('open');
    }
    window.switchSavedTab('saved');
  };

  window.deleteSavedPalette = function (id) {
    let saved = getSavedPalettesFromStorage();
    const item = saved.find(p => p.id === id);
    saved = saved.filter(p => p.id !== id);
    savePalettesToStorage(saved);
    showToast(`ลบชุดสี ${item ? item.name : ''} แล้ว`);
    renderSavedList();
  };

  window.loadPaletteHexes = function (hexArray, paletteName) {
    if (!Array.isArray(hexArray) || hexArray.length === 0) return;

    while (palette.length < hexArray.length && palette.length < 10) {
      palette.push({ h: 0, s: 0, v: 50, hex: '#808080', locked: false });
    }
    if (palette.length > hexArray.length && hexArray.length >= 2) {
      palette.splice(hexArray.length);
    }

    hexArray.forEach((hex, i) => {
      if (palette[i]) {
        palette[i].locked = false;
        const [r, g, b] = hexToRgb(hex);
        const hsv = rgbToHsv(r, g, b);
        palette[i] = { hex, h: hsv.h, s: hsv.s, v: hsv.v, locked: false };
      }
    });

    renderBars();
    updateInspector();
    showToast(`โหลดชุดสี "${paletteName}" เรียบร้อย! 🎨`);
  };

  function renderSavedList() {
    const listContainer = document.getElementById('cp-saved-list');
    const countSpan = document.getElementById('cp-saved-count');
    const nameInput = document.getElementById('cp-palette-name-input');
    const query = nameInput ? nameInput.value.trim().toLowerCase() : '';

    if (!listContainer) return;

    const saved = getSavedPalettesFromStorage();
    if (countSpan) countSpan.textContent = saved.length;

    listContainer.innerHTML = '';

    if (activeSavedTab === 'saved') {
      const itemsToRender = query
        ? saved.filter(item => (item.name && item.name.toLowerCase().includes(query)) || (item.hexes && item.hexes.some(h => h.toLowerCase().includes(query))))
        : saved;

      if (itemsToRender.length === 0) {
        if (query) {
          listContainer.innerHTML = `
            <div class="cp-empty-state">
              <div style="font-size:24px;margin-bottom:6px;">🔍</div>
              <div>ไม่พบชุดสีที่ตรงกับ "${query}"</div>
              <div style="font-size:11px;opacity:0.7;margin-top:2px;">ลองค้นหาชื่ออื่น หรือกด "บันทึกสีปัจจุบัน" เพื่อบันทึกชื่อนี้</div>
            </div>
          `;
        } else {
          listContainer.innerHTML = `
            <div class="cp-empty-state">
              <div style="font-size:24px;margin-bottom:6px;">⭐</div>
              <div>ยังไม่มีชุดสีที่บันทึกไว้</div>
              <div style="font-size:11px;opacity:0.7;margin-top:2px;">พิมพ์ชื่อแล้วกด "บันทึกสีปัจจุบัน" หรือกด "⭐ เซฟสีนี้" ด้านล่าง</div>
            </div>
          `;
        }
        return;
      }

      itemsToRender.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'cp-palette-card';

        const swatchesHtml = item.hexes.map(hex => `<div class="cp-card-swatch-item" style="background:${hex}" title="${hex}"></div>`).join('');
        const safeHexesArray = JSON.stringify(item.hexes).replace(/"/g, '&quot;');
        const safeName = item.name.replace(/'/g, "\\'");

        card.innerHTML = `
          <div class="cp-card-info">
            <div class="cp-card-name" title="${item.name}">${item.name}</div>
            <div class="cp-card-date">${item.createdAt || ''}</div>
          </div>
          <div class="cp-card-swatches">${swatchesHtml}</div>
          <div class="cp-card-actions">
            <button class="cp-card-btn primary" onclick="loadPaletteHexes(${safeHexesArray}, '${safeName}')">📥 โหลดชุดสี</button>
            <button class="cp-card-btn" onclick="copyColorHex('${item.hexes.join(', ')}')">📋 Copy</button>
            <button class="cp-card-btn danger" onclick="deleteSavedPalette('${item.id}')">🗑️</button>
          </div>
        `;
        listContainer.appendChild(card);
      });
    } else {
      const itemsToRender = query
        ? CURATED_PALETTES.map((item, originalIdx) => ({ item, originalIdx })).filter(({ item }) =>
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.harmony && item.harmony.toLowerCase().includes(query)) ||
            (item.hexes && item.hexes.some(h => h.toLowerCase().includes(query)))
          )
        : CURATED_PALETTES.map((item, originalIdx) => ({ item, originalIdx }));

      if (itemsToRender.length === 0) {
        listContainer.innerHTML = `
          <div class="cp-empty-state">
            <div style="font-size:24px;margin-bottom:6px;">🔍</div>
            <div>ไม่พบ Preset ที่ตรงกับ "${query}"</div>
            <div style="font-size:11px;opacity:0.7;margin-top:2px;">ลองค้นหาคำอื่น เช่น Pastel, Cyberpunk, Jade</div>
          </div>
        `;
        return;
      }

      itemsToRender.forEach(({ item, originalIdx }) => {
        const card = document.createElement('div');
        card.className = 'cp-palette-card';

        const heroHex = item.hexes[2] || item.hexes[0];
        const computedHexes = calculateHarmonyPalette(heroHex, item.harmony);
        const swatchesHtml = computedHexes.map(hex => `<div class="cp-card-swatch-item" style="background:${hex}" title="${hex}"></div>`).join('');
        const harmonyLabel = item.harmony || 'Custom';

        card.innerHTML = `
          <div class="cp-card-info">
            <div class="cp-card-name" title="${item.name}">${item.name}</div>
            <div class="cp-card-date"><span class="cp-harmony-badge">${harmonyLabel}</span></div>
          </div>
          <div class="cp-card-swatches">${swatchesHtml}</div>
          <div class="cp-card-actions">
            <button class="cp-card-btn primary" onclick="loadCuratedPreset(${originalIdx})">📥 โหลดชุดสี</button>
            <button class="cp-card-btn" onclick="copyColorHex('${computedHexes.join(', ')}')">📋 Copy</button>
          </div>
        `;
        listContainer.appendChild(card);
      });
    }
  }

  window.loadCuratedPreset = function (presetIndex) {
    const preset = CURATED_PALETTES[presetIndex];
    if (!preset) return;

    const heroHex = preset.hexes[2] || preset.hexes[0];
    const key = (preset.harmony || '').toLowerCase();
    const map = { 'analogous': 'analogous', 'complementary': 'complementary', 'triad': 'triad', 'split-comp.': 'split', 'split-comp': 'split', 'square': 'square', 'monochromatic': 'monochromatic', 'shades': 'shades' };
    const mode = map[key] || 'analogous';

    if (window.selectHarmony) {
      window.selectHarmony(mode);
    }
    
    // Explicitly set hero color and apply harmony
    const [r, g, b] = hexToRgb(heroHex);
    const hsv = rgbToHsv(r, g, b);
    palette[2] = { hex: heroHex, h: hsv.h, s: hsv.s, v: hsv.v, locked: false };
    applyHarmonyFromBase();

    showToast(`โหลดชุดสี "${preset.name}" เรียบร้อย! 🎨`);
  };

  // ═══ IMAGE EXTRACTION — Median Cut + Role Assignment ═══

  // ── Median Cut Color Quantization ──
  function medianCut(pixels, targetCount) {
    if (pixels.length === 0) return [];

    function getRange(box) {
      let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
      for (const p of box) {
        if (p[0] < minR) minR = p[0]; if (p[0] > maxR) maxR = p[0];
        if (p[1] < minG) minG = p[1]; if (p[1] > maxG) maxG = p[1];
        if (p[2] < minB) minB = p[2]; if (p[2] > maxB) maxB = p[2];
      }
      return { r: maxR - minR, g: maxG - minG, b: maxB - minB };
    }

    function splitBox(box) {
      if (box.length <= 1) return [box];
      const range = getRange(box);
      let channel = 0;
      if (range.g >= range.r && range.g >= range.b) channel = 1;
      else if (range.b >= range.r && range.b >= range.g) channel = 2;
      box.sort((a, b) => a[channel] - b[channel]);
      const mid = Math.floor(box.length / 2);
      return [box.slice(0, mid), box.slice(mid)];
    }

    let boxes = [pixels];
    while (boxes.length < targetCount) {
      let largestIdx = 0, largestSize = 0;
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].length > largestSize) {
          largestSize = boxes[i].length;
          largestIdx = i;
        }
      }
      if (largestSize <= 1) break;
      const [a, b] = splitBox(boxes[largestIdx]);
      boxes.splice(largestIdx, 1, a, b);
    }

    return boxes.map(box => {
      let rSum = 0, gSum = 0, bSum = 0;
      for (const p of box) { rSum += p[0]; gSum += p[1]; bSum += p[2]; }
      const len = box.length || 1;
      return {
        r: Math.round(rSum / len),
        g: Math.round(gSum / len),
        b: Math.round(bSum / len),
        count: box.length
      };
    });
  }

  // ── HSV Euclidean Distance (perceptually weighted) ──
  function hsvDistance(a, b) {
    const dH = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180;
    const dS = Math.abs(a.s - b.s) / 100;
    const dV = Math.abs(a.v - b.v) / 100;
    return Math.sqrt(dH * dH * 1.2 + dS * dS + dV * dV);
  }

  // ── Select distinct colors using HSV distance ──
  function selectDistinctColors(candidates, count, minDist) {
    minDist = minDist || 0.22;
    const selected = [];
    for (const c of candidates) {
      const isFar = selected.every(s => hsvDistance(s.hsv, c.hsv) > minDist);
      if (isFar || selected.length < 1) {
        selected.push(c);
      }
      if (selected.length >= count) break;
    }
    // Fallback: fill remaining with most distant available
    if (selected.length < count) {
      for (const c of candidates) {
        if (selected.some(s => s.hex === c.hex)) continue;
        selected.push(c);
        if (selected.length >= count) break;
      }
    }
    return selected;
  }

  // ── Role Assignment: sort extracted colors by slot function ──
  function assignColorRoles(colors, mode) {
    if (colors.length < 3) return colors;

    const items = colors.map(c => ({
      ...c,
      luminance: c.hsv.v,
      saturation: c.hsv.s
    }));

    if (mode === 'painting') {
      // Painting: Atmosphere(V extreme) → Shadow(V low) → Hero(S high) → KeyLight(V high S low) → RimLight(remaining)
      const sorted = [...items].sort((a, b) => a.luminance - b.luminance);
      const result = new Array(items.length);

      // Slot 0: Atmosphere — lowest or highest V depending on overall mood
      const avgV = items.reduce((s, c) => s + c.luminance, 0) / items.length;
      const atmosCandidate = avgV < 50 ? sorted[0] : sorted[sorted.length - 1];
      result[0] = atmosCandidate;

      // Slot 1: Shadow — lowest V (excluding atmosphere)
      const remaining1 = items.filter(c => c !== atmosCandidate);
      remaining1.sort((a, b) => a.luminance - b.luminance);
      result[1] = remaining1[0] || items[1];

      // Slot 2: Hero — highest saturation
      const remaining2 = items.filter(c => c !== result[0] && c !== result[1]);
      remaining2.sort((a, b) => b.saturation - a.saturation);
      result[2] = remaining2[0] || items[2];

      // Slot 3: Key Light — highest V & lowest S among remaining
      const remaining3 = items.filter(c => c !== result[0] && c !== result[1] && c !== result[2]);
      remaining3.sort((a, b) => (b.luminance - b.saturation * 0.3) - (a.luminance - a.saturation * 0.3));
      result[3] = remaining3[0] || items[3];

      // Slot 4+: Rim Light & extras — fill rest
      const usedSet = new Set([result[0], result[1], result[2], result[3]]);
      let fillIdx = 4;
      for (const c of items) {
        if (!usedSet.has(c) && fillIdx < items.length) {
          result[fillIdx++] = c;
        }
      }
      // Fill any nulls
      for (let i = 0; i < result.length; i++) {
        if (!result[i]) result[i] = items[i] || items[0];
      }
      return result;
    } else {
      // Graphic: Background(V extreme) → Surface(V near bg) → Primary(S high) → Secondary(S mid) → Text(V opposite bg)
      const sorted = [...items].sort((a, b) => a.luminance - b.luminance);
      const result = new Array(items.length);

      const avgV = items.reduce((s, c) => s + c.luminance, 0) / items.length;
      const isDark = avgV < 50;

      // Slot 0: Background — darkest or lightest
      result[0] = isDark ? sorted[0] : sorted[sorted.length - 1];

      // Slot 1: Surface — second darkest/lightest
      result[1] = isDark ? sorted[1] : sorted[sorted.length - 2];

      // Slot 2: Primary — most saturated
      const remaining2 = items.filter(c => c !== result[0] && c !== result[1]);
      remaining2.sort((a, b) => b.saturation - a.saturation);
      result[2] = remaining2[0] || items[2];

      // Slot 3: Secondary — second most saturated
      const remaining3 = items.filter(c => c !== result[0] && c !== result[1] && c !== result[2]);
      remaining3.sort((a, b) => b.saturation - a.saturation);
      result[3] = remaining3[0] || items[3];

      // Slot 4: Text — opposite luminance from background
      const remaining4 = items.filter(c => c !== result[0] && c !== result[1] && c !== result[2] && c !== result[3]);
      if (remaining4.length > 0) {
        remaining4.sort((a, b) => isDark ? (b.luminance - a.luminance) : (a.luminance - b.luminance));
        result[4] = remaining4[0];
      }

      // Fill remaining slots
      const usedSet = new Set(result.filter(Boolean));
      let fillIdx = 0;
      for (let i = 0; i < result.length; i++) {
        if (!result[i]) {
          while (fillIdx < items.length && usedSet.has(items[fillIdx])) fillIdx++;
          result[i] = items[fillIdx] || items[0];
          fillIdx++;
        }
      }
      return result;
    }
  }

  // ── Show Image Preview with Color Dots ──
  function showImagePreview(imgSrc, extractedColors) {
    let previewEl = document.getElementById('cp-img-preview');
    if (!previewEl) {
      previewEl = document.createElement('div');
      previewEl.id = 'cp-img-preview';
      previewEl.className = 'cp-img-preview';
      // Insert after action bar
      const actionBar = document.querySelector('.cp-action-bar');
      if (actionBar && actionBar.parentNode) {
        actionBar.parentNode.insertBefore(previewEl, actionBar.nextSibling);
      }
    }

    const dotsHtml = extractedColors.map((c, i) =>
      `<span class="cp-img-dot" style="background:${c.hex};" title="สล็อต ${i + 1}: ${c.hex}"></span>`
    ).join('');

    previewEl.innerHTML = `
      <div class="cp-img-preview-inner">
        <img src="${imgSrc}" alt="Extracted source" />
        <div class="cp-img-dots">${dotsHtml}</div>
        <button class="cp-img-close" onclick="this.closest('.cp-img-preview').remove()" title="ปิด">✕</button>
      </div>
    `;
  }

  // ── Main Extract Functions (supports File, URL, DataURL, Blob, and Ref Board Drag) ──
  window.extractPaletteFromImageSource = function (imgSrc) {
    if (!imgSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const sampleSize = 120;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const pixels = [];

      // Sample every 2nd pixel (skip pure transparent)
      for (let i = 0; i < imgData.length; i += 8) {
        const a = imgData[i + 3];
        if (a < 128) continue; // skip transparent
        pixels.push([imgData[i], imgData[i + 1], imgData[i + 2]]);
      }

      if (pixels.length === 0) {
        showToast('ไม่พบข้อมูลสีในรูปภาพ');
        return;
      }

      // Median Cut → get candidate buckets
      const targetBuckets = Math.max(palette.length * 3, 15);
      const buckets = medianCut(pixels, targetBuckets);

      // Convert to HSV + hex, sort by pixel count
      const candidates = buckets
        .map(b => {
          const hex = rgbToHex(b.r, b.g, b.b);
          const hsv = rgbToHsv(b.r, b.g, b.b);
          return { hex, hsv, count: b.count };
        })
        .sort((a, b) => b.count - a.count);

      // Select distinct colors
      const distinct = selectDistinctColors(candidates, palette.length, 0.22);

      // Assign roles based on current mode
      const assigned = assignColorRoles(distinct, paletteTargetMode);

      // Apply to palette (preserving locked slots)
      assigned.forEach((item, idx) => {
        if (palette[idx] && !palette[idx].locked) {
          palette[idx] = {
            hex: item.hex, h: item.hsv.h, s: item.hsv.s, v: item.hsv.v, locked: false
          };
        }
      });

      // If in painting mode, sort dark → light
      if (paletteTargetMode === 'painting') {
        const unlocked = [];
        const lockedMap = {};
        palette.forEach((col, i) => {
          if (col.locked) lockedMap[i] = col;
          else unlocked.push(col);
        });
        unlocked.sort((a, b) => a.v - b.v);
        let ui = 0;
        for (let i = 0; i < palette.length; i++) {
          if (!lockedMap[i]) {
            palette[i] = unlocked[ui++];
          }
        }
      }

      // Show preview badge
      showImagePreview(imgSrc, assigned.map(c => ({ hex: c.hex })));

      renderBars();
      updateInspector();

      // Ensure modal is open
      const modal = document.getElementById('color-palette-modal');
      if (modal && !modal.classList.contains('open') && typeof window.toggleColorPalette === 'function') {
        window.toggleColorPalette();
      }

      showToast('สกัดสีจากรูปภาพเรียบร้อย! 🎨');
    };
    img.onerror = function () {
      showToast('ไม่สามารถโหลดภาพเพื่อสกัดสีได้');
    };
    img.src = imgSrc;
  };

  window.extractPaletteFromImageFile = function (file) {
    if (!file) return;
    if (typeof file === 'string') {
      window.extractPaletteFromImageSource(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      window.extractPaletteFromImageSource(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Drag & Drop Support for Files & Reference Board Images ──
  (function initDragDrop() {
    const modal = document.getElementById('color-palette-modal');
    const fab = document.getElementById('palette-fab');

    function attachDropTarget(targetEl) {
      if (!targetEl) return;
      let dragCounter = 0;

      targetEl.addEventListener('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        targetEl.classList.add('cp-dragover');
      });

      targetEl.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter <= 0) {
          dragCounter = 0;
          targetEl.classList.remove('cp-dragover');
        }
      });

      targetEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      });

      targetEl.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        targetEl.classList.remove('cp-dragover');

        // 1. Check native dropped files
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            window.extractPaletteFromImageFile(file);
            return;
          } else {
            showToast('กรุณาลากไฟล์รูปภาพเท่านั้น');
            return;
          }
        }

        // 2. Check Reference Board Custom Drag or URLs / DataURLs
        if (e.dataTransfer) {
          const refImg = e.dataTransfer.getData('application/x-toruo-ref-image') ||
                         e.dataTransfer.getData('text/uri-list') ||
                         e.dataTransfer.getData('text/plain');

          if (refImg && (refImg.startsWith('data:image') || refImg.startsWith('blob:') || refImg.startsWith('http') || refImg.startsWith('./') || refImg.startsWith('/'))) {
            window.extractPaletteFromImageSource(refImg);
            return;
          }

          // 3. Check HTML snippet (e.g. dragging an <img> element)
          const html = e.dataTransfer.getData('text/html');
          if (html) {
            const m = html.match(/src=["']([^"']+)["']/i);
            if (m && m[1]) {
              window.extractPaletteFromImageSource(m[1]);
              return;
            }
          }
        }
      });
    }

    attachDropTarget(modal);
    attachDropTarget(fab);
  })();

  // ═══ COPY / EXPORT ═══

  function copyToClipboard(text, msg) {
    navigator.clipboard.writeText(text).then(() => showToast(msg || 'คัดลอกแล้ว!')).catch(() => showToast(text));
  }

  window.copyCssVariables = function () {
    const css = `:root {\n` + palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n') + `\n}`;
    copyToClipboard(css, 'คัดลอก CSS Variables แล้ว!');
  };

  window.copyColorArray = function () {
    const arr = JSON.stringify(palette.map(c => c.hex));
    copyToClipboard(arr, 'คัดลอก Array แล้ว!');
  };

  window.copyColorHex = function (hex) {
    copyToClipboard(hex, `คัดลอก ${hex} แล้ว!`);
  };

  // ═══ EXPORT PALETTE IMAGE MODAL ═══

  window.openExportImageModal = function () {
    const modal = document.getElementById('cp-export-modal');
    if (!modal) return;
    renderExportPaletteCanvas();
    modal.classList.add('open');
  };

  window.closeExportImageModal = function () {
    const modal = document.getElementById('cp-export-modal');
    if (modal) modal.classList.remove('open');
  };

  function renderExportPaletteCanvas() {
    const canvas = document.getElementById('cp-export-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = 1200;
    const H = 680;
    canvas.width = W;
    canvas.height = H;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#111116');
    bgGrad.addColorStop(1, '#181822');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle outer border inside canvas
    ctx.strokeStyle = '#282836';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Header Title
    ctx.font = 'bold 28px "Inter", "Prompt", sans-serif';
    ctx.fillStyle = '#f0f0f5';
    ctx.textAlign = 'left';
    ctx.fillText('TORU_O COLOR PALETTE', 40, 52);

    // Header Subtitle
    ctx.font = '500 14px "Inter", "Prompt", sans-serif';
    ctx.fillStyle = '#8888a5';
    const modeLabel = paletteTargetMode === 'painting' ? '🎨 PAINTING MODE' : '📐 GRAPHIC MODE (60-30-10)';
    const harmonyLabel = (activeHarmony || 'Analogous').toUpperCase();
    ctx.fillText(`HARMONY: ${harmonyLabel}  |  ${modeLabel}`, 40, 78);

    // Brand Tag
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = '#666685';
    ctx.textAlign = 'right';
    ctx.fillText('TORU_O WEB TOOLS', W - 40, 52);

    // Color Bars Section
    const N = palette.length || 5;
    const paddingX = 40;
    const barGap = 14;
    const availW = W - (paddingX * 2);
    const barW = (availW - (N - 1) * barGap) / N;
    const barY = 110;
    const barH = 400;
    const radius = 16;

    palette.forEach((col, idx) => {
      const x = paddingX + idx * (barW + barGap);

      // Draw Bar Body with rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, barY);
      ctx.lineTo(x + barW - radius, barY);
      ctx.quadraticCurveTo(x + barW, barY, x + barW, barY + radius);
      ctx.lineTo(x + barW, barY + barH - radius);
      ctx.quadraticCurveTo(x + barW, barY + barH, x + barW - radius, barY + barH);
      ctx.lineTo(x + radius, barY + barH);
      ctx.quadraticCurveTo(x, barY + barH, x, barY + barH - radius);
      ctx.lineTo(x, barY + radius);
      ctx.quadraticCurveTo(x, barY, x + radius, barY);
      ctx.closePath();
      ctx.fillStyle = col.hex;
      ctx.fill();

      // Bar Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Role Badge inside or below bar
      let roleLabel = '';
      if (paletteTargetMode === 'painting') {
        const pRoles = ['Atmosphere', 'Shadow', 'Hero ⭐', 'Key Light', 'Rim Light'];
        roleLabel = pRoles[idx] || `Color #${idx + 1}`;
      } else {
        const gRoles = ['Background', 'Surface', 'Primary ⭐', 'Secondary', 'Text'];
        roleLabel = gRoles[idx] || `Color #${idx + 1}`;
      }

      const colorName = getColorName(col.h, col.s, col.v);
      const contrastTxt = textColorFor(col.hex);

      // Role tag inside bar (at top of bar)
      ctx.save();
      ctx.font = 'bold 11px "Inter", "Prompt", sans-serif';
      ctx.fillStyle = contrastTxt;
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.85;
      ctx.fillText(roleLabel.toUpperCase(), x + barW / 2, barY + 28);
      ctx.restore();

      // HEX tag inside bar (at bottom of bar)
      ctx.save();
      ctx.font = 'bold 16px "SF Mono", "Consolas", monospace';
      ctx.fillStyle = contrastTxt;
      ctx.textAlign = 'center';
      ctx.fillText(col.hex.toUpperCase(), x + barW / 2, barY + barH - 24);
      ctx.restore();

      // Color Name below bar (Y = 535)
      ctx.save();
      ctx.font = '500 12px "Prompt", "Inter", sans-serif';
      ctx.fillStyle = '#d0d0e0';
      ctx.textAlign = 'center';
      
      // Split Thai / English if too wide
      const parts = colorName.split(' / ');
      if (parts.length === 2 && barW < 160) {
        ctx.fillText(parts[0], x + barW / 2, barY + barH + 28);
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillStyle = '#8888a0';
        ctx.fillText(parts[1], x + barW / 2, barY + barH + 46);
      } else {
        ctx.fillText(colorName, x + barW / 2, barY + barH + 32);
      }
      ctx.restore();
    });

    // Divider Line
    ctx.strokeStyle = '#222232';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 615);
    ctx.lineTo(W - 40, 615);
    ctx.stroke();

    // Footer Watermark
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#666680';
    ctx.textAlign = 'left';
    ctx.fillText('Exported from Color Generator', 40, 645);

    ctx.textAlign = 'right';
    ctx.fillText(new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }), W - 40, 645);

    // Update preview <img> element src
    const imgEl = document.getElementById('cp-export-img');
    if (imgEl) {
      imgEl.src = canvas.toDataURL('image/png');
    }
  }

  window.importExportImageToRefBoard = function () {
    const canvas = document.getElementById('cp-export-canvas');
    const imgEl = document.getElementById('cp-export-img');
    const dataUrl = (canvas ? canvas.toDataURL('image/png') : '') || (imgEl ? imgEl.src : '');

    if (!dataUrl) {
      showToast('ไม่พบข้อมูลภาพชุดสี');
      return;
    }

    if (window.addRefBoardImageFromDataUrl) {
      window.addRefBoardImageFromDataUrl(dataUrl);
      window.closeExportImageModal();

      // On mobile devices (<= 1024px), close the Color Palette modal after importing
      if (window.innerWidth <= 1024 && window.toggleColorPalette) {
        const cpModal = document.getElementById('color-palette-modal');
        if (cpModal && cpModal.classList.contains('open')) {
          window.toggleColorPalette();
        }
      }
    } else {
      showToast('กระดานเรฟยังไม่พร้อมใช้งาน');
    }
  };

  window.copyExportImageToClipboard = function () {
    const canvas = document.getElementById('cp-export-canvas');
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('ไม่สามารถสร้างไฟล์ภาพได้');
        return;
      }
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(() => {
          showToast('คัดลอกภาพชุดสีเข้า Clipboard เรียบร้อย! 📋');
        }).catch(() => {
          window.downloadExportImage();
        });
      } catch (e) {
        window.downloadExportImage();
      }
    }, 'image/png');
  };

  window.downloadExportImage = function () {
    const canvas = document.getElementById('cp-export-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `color-palette-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('ดาวน์โหลดภาพชุดสีเรียบร้อย! 📥');
  };

  // ═══ TOAST ═══

  function showToast(msg) {
    let toast = document.getElementById('cp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cp-toast';
      toast.className = 'cp-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ═══ MODAL WINDOW MANAGEMENT ═══

  function bringToFront(el) {
    highestZ += 2;
    el.style.zIndex = highestZ;
  }

  window.toggleColorPalette = function () {
    const modal = document.getElementById('color-palette-modal');
    const fab = document.getElementById('palette-fab');
    if (!modal) return;

    const isOpen = modal.classList.contains('open');
    if (isOpen) {
      modal.classList.remove('open');
      if (fab) fab.classList.remove('active');
      closeInspector();

      const toolsPage = document.getElementById('page-tools');
      if (toolsPage) {
        toolsPage.classList.remove('colorpalette-split');
        toolsPage.style.paddingTop = '';
      }
    } else {
      bringToFront(modal);
      modal.classList.add('open');
      if (fab) fab.classList.add('active');
      renderBars();

      if (window.innerWidth <= 1024) {
        // Mobile: Auto-open BOTH Color Inspector (Primary Accent index 2) and Saved Palettes drawer
        const heroIdx = palette.length > 2 ? 2 : 0;
        openInspector(heroIdx);
        const drawer = document.getElementById('cp-saved-drawer');
        if (drawer && !drawer.classList.contains('open')) {
          drawer.classList.add('open');
          renderSavedList();
        }
      } else {
        const toolsPage = document.getElementById('page-tools');
        if (toolsPage) toolsPage.classList.add('colorpalette-split');
      }
      if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
    }
  };

  function scrollBackUpFast() {
    if (window._didBothScroll) {
      window._didBothScroll = false;
      // Instant scroll back up (-200px) within 1-2 frames (< 5 frames)
      window.scrollBy({ top: -200, behavior: 'instant' });
    }
  }

  window.updateColorPaletteSplitLayout = function () {
    setTimeout(() => {
      const modal = document.getElementById('color-palette-modal');
      const toolsPage = document.getElementById('page-tools');
      if (!modal || !toolsPage) return;

      const isPaletteOpen = modal.classList.contains('open');
      const isBothOpen = toolsPage.classList.contains('refboard-split') && toolsPage.classList.contains('colorpalette-split');

      if (isPaletteOpen && window.innerWidth > 1024) {
        const modalHeight = modal.offsetHeight;
        const modalTop = modal.offsetTop || 60;
        const requiredPaddingTop = Math.max(480, modalTop + modalHeight + 35);

        if (isBothOpen) {
          toolsPage.style.paddingTop = requiredPaddingTop + 'px';

          // Smooth scroll down by 200px when both windows are open together
          if (!window._didBothScroll) {
            window._didBothScroll = true;
            setTimeout(() => {
              window.scrollBy({ top: 200, behavior: 'smooth' });
            }, 250);
          }
        } else {
          toolsPage.style.paddingTop = '';
          scrollBackUpFast();
        }
      } else {
        toolsPage.style.paddingTop = '';
        scrollBackUpFast();
      }
    }, 40);
  };

  window.minimizeColorPalette = function () {
    const modal = document.getElementById('color-palette-modal');
    if (modal) modal.classList.toggle('minimized');
  };

  function setupModalDragging() {
    const modal = document.getElementById('color-palette-modal');
    const header = document.getElementById('cp-modal-header');
    if (!modal || !header) return;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.cp-btn-icon') || e.target.closest('.cp-harmony-select')) return;
      isWindowDragging = true;
      bringToFront(modal);
      const rect = modal.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
      // Slider dragging
      if (activeSlider) {
        const track = document.querySelector(`.cp-slider-track.${activeSlider.type === 'h' ? 'hue' : activeSlider.type === 's' ? 'sat' : 'val'}`);
        if (track) {
          handleSliderInteraction({ clientX: e.clientX, currentTarget: track }, activeSlider.type);
        }
        return;
      }

      // Window dragging
      if (isWindowDragging && modal.classList.contains('open')) {
        const left = Math.max(10, Math.min(window.innerWidth - modal.offsetWidth - 10, e.clientX - dragOffset.x));
        const top = Math.max(10, Math.min(window.innerHeight - modal.offsetHeight - 10, e.clientY - dragOffset.y));
        modal.style.left = left + 'px';
        modal.style.top = top + 'px';
        modal.style.transform = 'none';
      }
    });

    document.addEventListener('mouseup', () => {
      isWindowDragging = false;
      activeSlider = null;
    });

    modal.addEventListener('mousedown', () => bringToFront(modal));
  }

  // ═══ MOBILE POPUP ═══

  window.toggleMobileToolsPopup = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('mobile-fab-popup');
    if (menu) menu.classList.toggle('open');
  };

  document.addEventListener('click', function (e) {
    const menu = document.getElementById('mobile-fab-popup');
    const fabBtn = document.getElementById('refboard-fab');
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && (!fabBtn || !fabBtn.contains(e.target))) {
        menu.classList.remove('open');
      }
    }
  });

  // ═══ KEYBOARD SHORTCUT ═══

  document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('color-palette-modal');
    if (modal && modal.classList.contains('open')) {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        randomizePalette();
      }
    }
  });

  // ═══ CUSTOM HARMONY SELECTOR ═══

  const HARMONY_DATA = {
    analogous: {
      name: 'Analogous',
      sub: 'สีข้างเคียง',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="5" r="1.8" fill="currentColor"/><circle cx="7" cy="15" r="1.8" fill="currentColor"/><circle cx="17" cy="15" r="1.8" fill="currentColor"/></svg>'
    },
    complementary: {
      name: 'Complementary',
      sub: 'สีตรงข้าม',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="6" y1="12" x2="18" y2="12"/><circle cx="6" cy="12" r="1.8" fill="currentColor"/><circle cx="18" cy="12" r="1.8" fill="currentColor"/></svg>'
    },
    triad: {
      name: 'Triad',
      sub: 'สามเหลี่ยม 3 ทิศทาง',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 4 20 18 4 18"/><circle cx="12" cy="4" r="1.8" fill="currentColor"/><circle cx="20" cy="18" r="1.8" fill="currentColor"/><circle cx="4" cy="18" r="1.8" fill="currentColor"/></svg>'
    },
    split: {
      name: 'Split-Comp.',
      sub: 'แยกตรงข้าม',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="5" x2="12" y2="12"/><line x1="12" y1="12" x2="6" y2="17"/><line x1="12" y1="12" x2="18" y2="17"/><circle cx="12" cy="5" r="1.8" fill="currentColor"/><circle cx="6" cy="17" r="1.8" fill="currentColor"/><circle cx="18" cy="17" r="1.8" fill="currentColor"/></svg>'
    },
    square: {
      name: 'Square',
      sub: 'สี่เหลี่ยม 4 ทิศทาง',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="14" height="14"/><circle cx="5" cy="5" r="1.8" fill="currentColor"/><circle cx="19" cy="5" r="1.8" fill="currentColor"/><circle cx="19" cy="19" r="1.8" fill="currentColor"/><circle cx="5" cy="19" r="1.8" fill="currentColor"/></svg>'
    },
    monochromatic: {
      name: 'Monochromatic',
      sub: 'สีเดียวเฉดต่าง',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>'
    },
    shades: {
      name: 'Shades',
      sub: 'น้ำหนักเฉดสี',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/></svg>'
    },
    custom: {
      name: 'Custom',
      sub: 'เลือกสุ่มอิสระ',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>'
    }
  };

  window.toggleHarmonyMenu = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('cp-harmony-menu');
    if (menu) menu.classList.toggle('open');
  };

  window.selectHarmony = function (mode) {
    if (!HARMONY_DATA[mode]) return;
    activeHarmony = mode;

    const iconEl = document.getElementById('cp-harmony-current-icon');
    const labelEl = document.getElementById('cp-harmony-current-label');
    if (iconEl) iconEl.innerHTML = HARMONY_DATA[mode].icon;
    if (labelEl) labelEl.textContent = HARMONY_DATA[mode].name;

    document.querySelectorAll('.cp-harmony-item').forEach(item => {
      item.classList.toggle('active', item.dataset.harmony === mode);
    });

    const menu = document.getElementById('cp-harmony-menu');
    if (menu) menu.classList.remove('open');

    applyHarmonyFromBase();
  };

  // ── Tone Metadata Dictionary ──
  const TONE_DATA = {
    all: { name: 'ทั้งหมด', sub: 'สุ่มอิสระตามทฤษฎีสี', icon: '✨' },
    light: { name: 'Light', sub: 'สว่างอ่อนนุ่ม คลีนโปร่ง', icon: '☀️' },
    pastel: { name: 'Pastel', sub: 'สีหวานละมุน นุ่มนวล', icon: '🌸' },
    bright: { name: 'Bright', sub: 'สว่างสดใส มีพลังชัดเจน', icon: '🌈' },
    vivid: { name: 'Vivid', sub: 'สดจัดจ้าน อิ่มตัวสูง', icon: '⚡' },
    muted: { name: 'Muted', sub: 'เอิร์ธโทน มัวคลาสสิก', icon: '🌫️' },
    dark: { name: 'Dark', sub: 'โทนมืด ลึกลับ ดาร์ก', icon: '🌑' },
    deep: { name: 'Deep', sub: 'เข้มลึก อัญมณี Jewel', icon: '🌌' },
    neutral: { name: 'Neutral', sub: 'โมโนโทน ธรรมชาติ เทา', icon: '🪨' }
  };

  window.toggleToneMenu = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('cp-tone-menu');
    if (menu) menu.classList.toggle('open');
    const harmMenu = document.getElementById('cp-harmony-menu');
    if (harmMenu) harmMenu.classList.remove('open');
    const modeMenu = document.getElementById('cp-target-mode-menu');
    if (modeMenu) modeMenu.classList.remove('open');
  };

  window.selectTone = function (tone) {
    if (!TONE_DATA[tone]) return;
    activeTone = tone;

    const iconEl = document.getElementById('cp-tone-current-icon');
    const labelEl = document.getElementById('cp-tone-current-label');
    if (iconEl) iconEl.textContent = TONE_DATA[tone].icon;
    if (labelEl) labelEl.textContent = TONE_DATA[tone].name;

    document.querySelectorAll('.cp-tone-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tone === tone);
    });

    const menu = document.getElementById('cp-tone-menu');
    if (menu) menu.classList.remove('open');

    showToast(`เลือกโทนสี "${TONE_DATA[tone].icon} ${TONE_DATA[tone].name}"`);
    randomizePalette();
  };

  document.addEventListener('click', function (e) {
    const menu = document.getElementById('cp-harmony-menu');
    const btn = document.getElementById('cp-harmony-btn');
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        menu.classList.remove('open');
      }
    }

    const toneMenu = document.getElementById('cp-tone-menu');
    const toneBtn = document.getElementById('cp-tone-btn');
    if (toneMenu && toneMenu.classList.contains('open')) {
      if (!toneMenu.contains(e.target) && (!toneBtn || !toneBtn.contains(e.target))) {
        toneMenu.classList.remove('open');
      }
    }

    const modeMenu = document.getElementById('cp-target-mode-menu');
    const modeBtn = document.getElementById('cp-target-mode-btn');
    if (modeMenu && modeMenu.classList.contains('open')) {
      if (!modeMenu.contains(e.target) && (!modeBtn || !modeBtn.contains(e.target))) {
        modeMenu.classList.remove('open');
      }
    }
  });

  window.toggleTargetModeMenu = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('cp-target-mode-menu');
    if (menu) menu.classList.toggle('open');
  };

  window.selectTargetMode = function (mode) {
    if (mode !== 'graphic' && mode !== 'painting') return;
    paletteTargetMode = mode;

    const labelEl = document.getElementById('cp-target-mode-label');
    if (labelEl) {
      labelEl.textContent = mode === 'painting' ? 'รูปแบบสี: ภาพวาด ▾' : 'รูปแบบสี: กราฟิก ▾';
    }

    document.querySelectorAll('.cp-mode-item').forEach(item => {
      item.classList.toggle('active', item.dataset.mode === mode);
    });

    const menu = document.getElementById('cp-target-mode-menu');
    if (menu) menu.classList.remove('open');

    showToast(`เปลี่ยนเป็นโหมด "${mode === 'painting' ? 'สีสำหรับภาพวาด 🎨' : 'สีสำหรับกราฟิก 📐'}"`);
    randomizePalette();
  };

  // ═══ INITIALIZATION ═══

  document.addEventListener('DOMContentLoaded', function () {
    // Init palette data
    initPalette();

    // Randomize button
    const randBtn = document.getElementById('cp-btn-random');
    if (randBtn) randBtn.addEventListener('click', randomizePalette);

    // Inspector close
    const inspClose = document.getElementById('cp-inspector-close');
    if (inspClose) inspClose.addEventListener('click', closeInspector);

    // Inspector sliders — mousedown
    document.querySelectorAll('.cp-slider-track').forEach(track => {
      const type = track.classList.contains('hue') ? 'h' : track.classList.contains('sat') ? 's' : 'v';
      track.addEventListener('mousedown', (e) => {
        handleSliderInteraction(e, type);
        activeSlider = { type };
      });

      // Touch support
      track.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          handleSliderInteraction({ clientX: e.touches[0].clientX, currentTarget: track }, type);
          activeSlider = { type };
        }
      }, { passive: true });

      track.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0 && activeSlider) {
          handleSliderInteraction({ clientX: e.touches[0].clientX, currentTarget: track }, activeSlider.type);
        }
      }, { passive: true });
    });

    document.addEventListener('touchend', () => { activeSlider = null; });

    // HEX input in inspector
    const hexInput = document.querySelector('.cp-hex-field');
    if (hexInput) {
      hexInput.addEventListener('input', function () {
        if (inspectorIdx < 0) return;
        let val = this.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          const [r, g, b] = hexToRgb(val);
          const hsv = rgbToHsv(r, g, b);
          palette[inspectorIdx].h = hsv.h;
          palette[inspectorIdx].s = hsv.s;
          palette[inspectorIdx].v = hsv.v;
          palette[inspectorIdx].hex = val;
          renderBars();
          updateInspector();
        }
      });
    }

    // RGB input in inspector
    const rgbInput = document.querySelector('.cp-rgb-field');
    if (rgbInput) {
      rgbInput.addEventListener('input', function () {
        if (inspectorIdx < 0) return;
        const parts = this.value.split(',').map(s => parseInt(s.trim()));
        if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
          const hsv = rgbToHsv(parts[0], parts[1], parts[2]);
          palette[inspectorIdx].h = hsv.h;
          palette[inspectorIdx].s = hsv.s;
          palette[inspectorIdx].v = hsv.v;
          palette[inspectorIdx].hex = rgbToHex(parts[0], parts[1], parts[2]);
          renderBars();
          updateInspector();
        }
      });
    }

    // Saved Drawer Event Listeners
    const quickSaveBtn = document.getElementById('cp-btn-quick-save');
    if (quickSaveBtn) quickSaveBtn.addEventListener('click', () => window.saveCurrentPalette());

    const toggleSavedBtn = document.getElementById('cp-btn-toggle-saved');
    if (toggleSavedBtn) toggleSavedBtn.addEventListener('click', window.toggleSavedDrawer);

    const saveSubmitBtn = document.getElementById('cp-btn-save-submit');
    if (saveSubmitBtn) saveSubmitBtn.addEventListener('click', window.saveCurrentPaletteWithInput);

    const nameInput = document.getElementById('cp-palette-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', renderSavedList);
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.saveCurrentPaletteWithInput();
        }
      });
    }

    const tabSavedBtn = document.getElementById('cp-tab-saved');
    if (tabSavedBtn) tabSavedBtn.addEventListener('click', () => window.switchSavedTab('saved'));

    const tabPresetsBtn = document.getElementById('cp-tab-presets');
    if (tabPresetsBtn) tabPresetsBtn.addEventListener('click', () => window.switchSavedTab('presets'));

    const savedCloseBtn = document.getElementById('cp-saved-close');
    if (savedCloseBtn) savedCloseBtn.addEventListener('click', window.toggleSavedDrawer);

    // Setup modal dragging & resizing
    setupModalDragging();
    setupModalResizing();
    renderBars();

    // Auto update split layout when modal height changes
    const modalEl = document.getElementById('color-palette-modal');
    if (modalEl && window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
      });
      ro.observe(modalEl);
    }
  });

  function setupModalResizing() {
    const modal = document.getElementById('color-palette-modal');
    const handleR = document.getElementById('cp-resize-r');
    if (!modal || !handleR) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    handleR.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startWidth = modal.offsetWidth;
      bringToFront(modal);
      document.body.style.cursor = 'ew-resize';
      handleR.classList.add('is-resizing');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(340, Math.min(window.innerWidth - modal.offsetLeft - 10, startWidth + deltaX));
      modal.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        if (handleR) handleR.classList.remove('is-resizing');
      }
    });
  }

})();
