/* ═══════════════════════════════════════════════════════════════════════════
   COOLORS-STYLE COLOR GENERATOR — CURATED SMART ENGINE
   File: color-palette.js
   Toru_O Web Tools — Simple, Beautiful, Practical
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──
  let activeHarmony = 'analogous';
  let inspectorIdx = -1; // Which bar is being inspected (-1 = closed)
  let palette = [];
  let dragSrcIdx = -1;
  let isWindowDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let highestZ = 100;
  let activeSlider = null; // { type: 'h'|'s'|'v', idx: number }

  // ── Curated Hue Zones (designer-approved beautiful zones) ──
  const HUE_ZONES = [
    { min: 0, max: 25, name: 'Coral' },
    { min: 25, max: 50, name: 'Amber' },
    { min: 80, max: 140, name: 'Green' },
    { min: 160, max: 200, name: 'Teal' },
    { min: 200, max: 240, name: 'Blue' },
    { min: 250, max: 280, name: 'Lavender' },
    { min: 310, max: 350, name: 'Rose' }
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

  // Get approximate color name
  function getColorName(h, s, v) {
    for (const entry of COLOR_NAMES) {
      const hInRange = (entry.h[0] <= entry.h[1])
        ? (h >= entry.h[0] && h <= entry.h[1])
        : (h >= entry.h[0] || h <= entry.h[1]);
      if (hInRange && s >= entry.s[0] && s <= entry.s[1] && v >= entry.v[0] && v <= entry.v[1]) {
        return entry.name;
      }
    }
    return '';
  }

  // ═══ CURATED SMART PALETTE ENGINE ═══

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickCuratedHue() {
    const zone = HUE_ZONES[Math.floor(Math.random() * HUE_ZONES.length)];
    return rand(zone.min, zone.max);
  }

  // Generate a beautiful 5-color palette using 60-30-10 rule
  // Generate a beautiful palette using 60-30-10 rule and optional target count & base hue
  function generateSmartPalette(count = 5, overrideBaseHue = null) {
    const baseHue = (overrideBaseHue !== null) ? overrideBaseHue : pickCuratedHue();
    const isDark = Math.random() > 0.5; // Random light/dark theme

    const colors = [];

    // Slot 0: Background (60%) — very light or very dark
    if (isDark) {
      colors.push({ h: baseHue, s: rand(5, 18), v: rand(6, 14) });
    } else {
      colors.push({ h: baseHue, s: rand(3, 12), v: rand(95, 99) });
    }

    // Slot 1: Surface (30%) — slightly different from background
    if (isDark) {
      colors.push({ h: (baseHue + rand(-10, 10) + 360) % 360, s: rand(8, 22), v: rand(16, 28) });
    } else {
      colors.push({ h: (baseHue + rand(-10, 10) + 360) % 360, s: rand(5, 18), v: rand(88, 95) });
    }

    // Slot 2: Primary Accent (10%) — the HERO color, vivid & beautiful
    colors.push({ h: baseHue, s: rand(65, 92), v: rand(70, 95) });

    // Slot 3: Secondary — harmony-based offset
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

    if (activeHarmony === 'monochromatic') {
      colors.push({ h: secHue, s: rand(40, 65), v: rand(50, 75) });
    } else if (activeHarmony === 'shades') {
      colors.push({ h: secHue, s: rand(30, 90), v: rand(40, 60) });
    } else {
      colors.push({ h: secHue, s: rand(55, 85), v: rand(60, 88) });
    }

    // Slot 4: Text/Contrast — opposite brightness from background
    if (isDark) {
      colors.push({ h: baseHue, s: rand(2, 10), v: rand(88, 97) });
    } else {
      colors.push({ h: baseHue, s: rand(10, 25), v: rand(10, 22) });
    }

    // Slots 5+: Generate additional harmonious colors if count > 5
    while (colors.length < count) {
      const idx = colors.length;
      let extraHue = baseHue;
      if (activeHarmony === 'complementary') extraHue = (baseHue + 180 + (idx - 4) * 30) % 360;
      else if (activeHarmony === 'triad') extraHue = (baseHue + 240 + (idx - 4) * 30) % 360;
      else extraHue = (baseHue + (idx - 4) * 50 + rand(-15, 15) + 360) % 360;

      const extraS = isDark ? rand(30, 85) : rand(25, 80);
      const extraV = isDark ? rand(45, 90) : rand(40, 95);
      colors.push({ h: extraHue, s: extraS, v: extraV });
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

      if (i === 0) {
        // Background
        col.h = base.h;
        col.s = isDarkBg ? rand(5, 18) : rand(3, 12);
        col.v = isDarkBg ? rand(6, 14) : rand(95, 99);
      } else if (i === 1) {
        // Surface
        col.h = (base.h + rand(-10, 10) + 360) % 360;
        col.s = isDarkBg ? rand(8, 22) : rand(5, 18);
        col.v = isDarkBg ? rand(16, 28) : rand(88, 95);
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
        col.h = secHue;
        col.s = (activeHarmony === 'monochromatic') ? rand(40, 65) : rand(55, 85);
        col.v = (activeHarmony === 'shades') ? rand(40, 60) : rand(60, 88);
      } else if (i === 4) {
        // Text
        col.h = base.h;
        col.s = isDarkBg ? rand(2, 10) : rand(10, 25);
        col.v = isDarkBg ? rand(88, 97) : rand(10, 22);
      } else if (i >= 5) {
        // Extra color slots
        col.h = (base.h + (i - 4) * 45 + rand(-15, 15) + 360) % 360;
        col.s = isDarkBg ? rand(30, 85) : rand(25, 80);
        col.v = isDarkBg ? rand(45, 90) : rand(40, 95);
      }

      col.hex = hsvToHex(col.h, col.s, col.v);
    });

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
      const roleNames = ['Background', 'Surface', 'Primary ⭐', 'Secondary', 'Text'];

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
    if (title) title.textContent = `สี #${inspectorIdx + 1}`;

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
    if (hexInput && document.activeElement !== hexInput) hexInput.value = col.hex;

    const rgbInput = inspector.querySelector('.cp-rgb-field');
    if (rgbInput && document.activeElement !== rgbInput) rgbInput.value = `${r}, ${g}, ${b}`;

    const hslInput = inspector.querySelector('.cp-hsl-field');
    if (hslInput && document.activeElement !== hslInput) hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
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
    if (input) input.value = '';
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
    if (!listContainer) return;

    const saved = getSavedPalettesFromStorage();
    if (countSpan) countSpan.textContent = saved.length;

    listContainer.innerHTML = '';

    if (activeSavedTab === 'saved') {
      if (saved.length === 0) {
        listContainer.innerHTML = `
          <div class="cp-empty-state">
            <div style="font-size:24px;margin-bottom:6px;">⭐</div>
            <div>ยังไม่มีชุดสีที่บันทึกไว้</div>
            <div style="font-size:11px;opacity:0.7;margin-top:2px;">พิมพ์ชื่อแล้วกด "บันทึกสีปัจจุบัน" หรือกด "⭐ เซฟสีนี้" ด้านล่าง</div>
          </div>
        `;
        return;
      }

      saved.forEach((item) => {
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
      CURATED_PALETTES.forEach((item, idx) => {
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
            <button class="cp-card-btn primary" onclick="loadCuratedPreset(${idx})">📥 โหลดชุดสี</button>
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

  // ═══ IMAGE EXTRACTION ═══

  window.extractPaletteFromImageFile = function (file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imgData = ctx.getImageData(0, 0, 100, 100).data;
        const buckets = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = Math.round(imgData[i] / 16) * 16;
          const g = Math.round(imgData[i + 1] / 16) * 16;
          const b = Math.round(imgData[i + 2] / 16) * 16;
          const hex = rgbToHex(r, g, b);
          buckets[hex] = (buckets[hex] || 0) + 1;
        }

        const sorted = Object.keys(buckets).sort((a, b) => buckets[b] - buckets[a]);
        const distinct = [];

        for (const hex of sorted) {
          const [r, g, b] = hexToRgb(hex);
          const hsv = rgbToHsv(r, g, b);
          const isFar = distinct.every(d =>
            Math.abs(d.hsv.h - hsv.h) > 25 || Math.abs(d.hsv.v - hsv.v) > 20
          );
          if (isFar || distinct.length < 2) {
            distinct.push({ hex, hsv });
          }
          if (distinct.length >= palette.length) break;
        }

        while (distinct.length < palette.length && sorted[distinct.length]) {
          const hex = sorted[distinct.length];
          const [r, g, b] = hexToRgb(hex);
          distinct.push({ hex, hsv: rgbToHsv(r, g, b) });
        }

        distinct.forEach((item, idx) => {
          if (palette[idx] && !palette[idx].locked) {
            palette[idx] = {
              hex: item.hex, h: item.hsv.h, s: item.hsv.s, v: item.hsv.v, locked: false
            };
          }
        });

        renderBars();
        updateInspector();
        showToast('สกัดสีจากรูปภาพเรียบร้อย!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

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

  document.addEventListener('click', function (e) {
    const menu = document.getElementById('cp-harmony-menu');
    const btn = document.getElementById('cp-harmony-btn');
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        menu.classList.remove('open');
      }
    }
  });

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
