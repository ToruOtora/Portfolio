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
  let redoStack = [];
  const MAX_HISTORY = 40;
  let inspectorIdx = 0;
  let paletteTargetMode = 'graphic'; // 'graphic' | 'painting'
  let isThemePreviewActive = false;
  let palette = [];
  let dragSrcIdx = -1;
  let isWindowDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let highestZ = 100000;
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

  // ── Curated Preset Palettes (120 total mapped across 7 Color Theory Harmony Modes & 8 Tones) ──
  const CURATED_PALETTES = [
    // 🌸 1. Analogous (สีข้างเคียง) - 18 Presets
    { name: '🌸 Sakura Blossom', harmony: 'Analogous', tone: 'pastel', hexes: ['#fdf2f4', '#fbc4ce', '#e56b8f', '#d84a75', '#3d1520'] },
    { name: '🍂 Warm Earth', harmony: 'Analogous', tone: 'muted', hexes: ['#faf5ef', '#e6c594', '#d97724', '#b85c14', '#2b1e17'] },
    { name: '🌲 Forest Pine', harmony: 'Analogous', tone: 'deep', hexes: ['#f0fdf4', '#dcfce7', '#22c55e', '#169846', '#14532d'] },
    { name: '🍵 Matcha Latte', harmony: 'Analogous', tone: 'muted', hexes: ['#fefae0', '#e9edc9', '#a3b18a', '#6b8e4e', '#2d3a27'] },
    { name: '🌾 Golden Harvest', harmony: 'Analogous', tone: 'bright', hexes: ['#fcf4de', '#f5d68b', '#e6b85c', '#c2852c', '#2e1f0e'] },
    { name: '🌲 Emerald Forest', harmony: 'Analogous', tone: 'deep', hexes: ['#d1fae5', '#50c878', '#228b57', '#134e32', '#091e13'] },
    { name: '☕ Espresso Roast', harmony: 'Analogous', tone: 'dark', hexes: ['#e8d5c4', '#c49a80', '#9c6b4e', '#613b2b', '#180e0a'] },
    { name: '🍁 Autumn Maple', harmony: 'Analogous', tone: 'vivid', hexes: ['#ffaa44', '#ff8800', '#e66000', '#a83a00', '#1c0a00'] },
    { name: '🌿 Olive Garden', harmony: 'Analogous', tone: 'muted', hexes: ['#e8f5e9', '#8fbc8f', '#556b2f', '#2d3b25', '#131a10'] },
    { name: '🍊 Orange Sunset', harmony: 'Analogous', tone: 'vivid', hexes: ['#f6ae2d', '#f26419', '#b83b0f', '#5c1704', '#210903'] },
    { name: '🍑 Peach Bellini', harmony: 'Analogous', tone: 'pastel', hexes: ['#fff4ed', '#fed7aa', '#fb923c', '#ea580c', '#431407'] },
    { name: '🌊 Coral Reef', harmony: 'Analogous', tone: 'bright', hexes: ['#fff1f2', '#fecdd3', '#fb7185', '#e11d48', '#4c0519'] },
    { name: '🍇 Lavender Mist', harmony: 'Analogous', tone: 'pastel', hexes: ['#f5f3ff', '#ddd6fe', '#a78bfa', '#7c3aed', '#2e1065'] },
    { name: '🍋 Lemon Zest', harmony: 'Analogous', tone: 'bright', hexes: ['#fefce8', '#fef08a', '#facc15', '#ca8a04', '#422006'] },
    { name: '🍃 Spearmint Breeze', harmony: 'Analogous', tone: 'light', hexes: ['#f0fdfa', '#ccfbf1', '#5eead4', '#0d9488', '#134e4a'] },
    { name: '🌅 Sunrise Horizon', harmony: 'Analogous', tone: 'bright', hexes: ['#fff7ed', '#ffedd5', '#fed7aa', '#f97316', '#7c2d12'] },
    { name: '🫐 Blue Berry Field', harmony: 'Analogous', tone: 'deep', hexes: ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#172554'] },
    { name: '🪐 Velvet Amethyst', harmony: 'Analogous', tone: 'deep', hexes: ['#faf5ff', '#e9d5ff', '#c084fc', '#9333ea', '#3b0764'] },

    // ⚡ 2. Complementary (สีตรงข้าม) - 18 Presets
    { name: '⚡ Cyberpunk Neon', harmony: 'Complementary', tone: 'vivid', hexes: ['#0a0a1a', '#1a0533', '#0fefca', '#ff007f', '#ffe600'] },
    { name: '🌊 Nordic Ocean', harmony: 'Complementary', tone: 'muted', hexes: ['#e0f2fe', '#38bdf8', '#0f766e', '#f97316', '#0c2d3f'] },
    { name: '🔥 Sunset Fire', harmony: 'Complementary', tone: 'bright', hexes: ['#fef3c7', '#fbbf24', '#f97316', '#3b82f6', '#450a0a'] },
    { name: '🍉 Summer Watermelon', harmony: 'Complementary', tone: 'vivid', hexes: ['#f9f8f6', '#ff8589', '#ff5a60', '#1e6f47', '#0c3823'] },
    { name: '🏮 Neon Cyber Alley', harmony: 'Complementary', tone: 'dark', hexes: ['#080914', '#1b1c3a', '#00f0ff', '#ff0055', '#ffe600'] },
    { name: '🌌 Cosmic Aurora', harmony: 'Complementary', tone: 'deep', hexes: ['#03141f', '#093a4b', '#3caea3', '#f6d55c', '#ed553b'] },
    { name: '🎴 Hanafuda Retro', harmony: 'Complementary', tone: 'muted', hexes: ['#f5f0eb', '#e6a100', '#c72c2c', '#1b4d3e', '#1a0505'] },
    { name: '🧪 Poison Ivy', harmony: 'Complementary', tone: 'dark', hexes: ['#c2f0c7', '#69b071', '#2f6e42', '#a8325a', '#08170e'] },
    { name: '🍨 Mango Sticky Rice', harmony: 'Complementary', tone: 'light', hexes: ['#fffbeb', '#ffc107', '#bd8924', '#5c3a93', '#2e2008'] },
    { name: '👑 Royal Gold & Velvet', harmony: 'Complementary', tone: 'deep', hexes: ['#fdf4dc', '#d4af37', '#731c77', '#3b1248', '#190a21'] },
    { name: '🌺 Tropical Hibiscus', harmony: 'Complementary', tone: 'bright', hexes: ['#f0fdf4', '#4ade80', '#16a34a', '#f43f5e', '#881337'] },
    { name: '🏜️ Desert Sky', harmony: 'Complementary', tone: 'muted', hexes: ['#fff7ed', '#fdba74', '#c2410c', '#0284c7', '#082f49'] },
    { name: '🫐 Blueberry & Lemon', harmony: 'Complementary', tone: 'bright', hexes: ['#fefce8', '#facc15', '#4338ca', '#312e81', '#1e1b4b'] },
    { name: '💎 Ruby & Emerald', harmony: 'Complementary', tone: 'deep', hexes: ['#022c22', '#059669', '#34d399', '#e11d48', '#4c0519'] },
    { name: '🏙️ City at Night', harmony: 'Complementary', tone: 'dark', hexes: ['#0f172a', '#1e293b', '#38bdf8', '#f59e0b', '#020617'] },
    { name: '🍓 Strawberry Kiwi', harmony: 'Complementary', tone: 'vivid', hexes: ['#fdf2f8', '#f472b6', '#db2777', '#84cc16', '#365314'] },
    { name: '🧁 Mint Chocolate', harmony: 'Complementary', tone: 'pastel', hexes: ['#f0fdf4', '#86efac', '#22c55e', '#78350f', '#451a03'] },
    { name: '🌅 Sun & Sea', harmony: 'Complementary', tone: 'light', hexes: ['#f0f9ff', '#7dd3fc', '#0284c7', '#f97316', '#7c2d12'] },

    // 🔺 3. Triad (สามเหลี่ยม 3 ทิศทาง) - 18 Presets
    { name: '🍧 Anime Dream', harmony: 'Triad', tone: 'bright', hexes: ['#fef9f0', '#fbc531', '#487eb0', '#e84118', '#2c2c54'] },
    { name: '🔮 Neon Retro Synth', harmony: 'Triad', tone: 'vivid', hexes: ['#180828', '#4c1d95', '#c084fc', '#f43f5e', '#fbbf24'] },
    { name: '🌌 Galaxy', harmony: 'Triad', tone: 'deep', hexes: ['#f0f0ff', '#a78bfa', '#7c3aed', '#06b6d4', '#0f0520'] },
    { name: '🌇 Tokyo Dusk', harmony: 'Triad', tone: 'dark', hexes: ['#190924', '#3f1651', '#8c2474', '#e24e75', '#ff9e9d'] },
    { name: '🛸 Deep Space Nebula', harmony: 'Triad', tone: 'dark', hexes: ['#050510', '#140c2d', '#683594', '#00d2ff', '#d89bfe'] },
    { name: '🦄 Pastel Unicorn', harmony: 'Triad', tone: 'pastel', hexes: ['#f5f0ff', '#e0c3fc', '#8ec5fc', '#ffb5e2', '#edafb8'] },
    { name: '🍸 Velvet Lounge', harmony: 'Triad', tone: 'deep', hexes: ['#120817', '#2a1130', '#9b3092', '#309b78', '#f48fb1'] },
    { name: '🫐 Wild Berry', harmony: 'Triad', tone: 'vivid', hexes: ['#12081d', '#321447', '#a83db5', '#3db5a8', '#f19eec'] },
    { name: '🔮 Mystic Quartz', harmony: 'Triad', tone: 'light', hexes: ['#f3e8ff', '#d8b4fe', '#a855f7', '#06b6d4', '#160826'] },
    { name: '🌌 Twilight Glow', harmony: 'Triad', tone: 'deep', hexes: ['#e2d6ff', '#b39ce3', '#8260bd', '#3cbfae', '#100b21'] },
    { name: '🎪 Carnival Fun', harmony: 'Triad', tone: 'vivid', hexes: ['#fef2f2', '#ef4444', '#3b82f6', '#eab308', '#1e293b'] },
    { name: '🍬 Bubblegum Pop', harmony: 'Triad', tone: 'pastel', hexes: ['#fff1f2', '#fda4af', '#93c5fd', '#fde047', '#475569'] },
    { name: '🎭 Venetian Masquerade', harmony: 'Triad', tone: 'deep', hexes: ['#1e1b4b', '#4338ca', '#b45309', '#047857', '#0f172a'] },
    { name: '🎨 Artist Atelier', harmony: 'Triad', tone: 'bright', hexes: ['#fafaf9', '#f97316', '#06b6d4', '#ec4899', '#292524'] },
    { name: '🦜 Tropical Macaw', harmony: 'Triad', tone: 'vivid', hexes: ['#0284c7', '#e11d48', '#eab308', '#16a34a', '#0f172a'] },
    { name: '🍨 Gelato Trio', harmony: 'Triad', tone: 'light', hexes: ['#fffbeb', '#fed7aa', '#bbf7d0', '#fbcfe8', '#334155'] },
    { name: '🕹️ Arcade 1984', harmony: 'Triad', tone: 'dark', hexes: ['#0f051d', '#9333ea', '#06b6d4', '#f97316', '#ffffff'] },
    { name: '🪷 Lotus Pavilion', harmony: 'Triad', tone: 'pastel', hexes: ['#fdf4ff', '#f0abfc', '#86efac', '#93c5fd', '#3b0764'] },

    // 🌗 4. Split-Complementary (แยกตรงข้าม) - 18 Presets
    { name: '🍬 Pastel Candy', harmony: 'Split-Comp.', tone: 'pastel', hexes: ['#fff8f0', '#ffb3ba', '#ffffba', '#baffc9', '#bae1ff'] },
    { name: '🌙 Moonlight Serenade', harmony: 'Split-Comp.', tone: 'dark', hexes: ['#0c1021', '#1d2a44', '#3b537f', '#997ec3', '#e4ecf7'] },
    { name: '🍧 Strawberry Bingsu', harmony: 'Split-Comp.', tone: 'pastel', hexes: ['#fff0f3', '#ffccd5', '#ff4d6d', '#4dffb2', '#800f2f'] },
    { name: '🍑 Sweet Peach', harmony: 'Split-Comp.', tone: 'light', hexes: ['#fff3eb', '#fecdd3', '#fda4af', '#38bdf8', '#881337'] },
    { name: '💎 Crystal Sapphire', harmony: 'Split-Comp.', tone: 'deep', hexes: ['#b3e0ff', '#438ecb', '#1e4f8a', '#cb8a43', '#030f26'] },
    { name: '⚓ Royal Navy', harmony: 'Split-Comp.', tone: 'deep', hexes: ['#dce6f5', '#2c5d9e', '#1a3a6b', '#9e6a2c', '#050c1e'] },
    { name: '🌸 Cherry Blossom Dusk', harmony: 'Split-Comp.', tone: 'muted', hexes: ['#f7c5dd', '#c76899', '#803c6b', '#3c8051', '#1f1124'] },
    { name: '🐬 Tropical Cyan', harmony: 'Split-Comp.', tone: 'bright', hexes: ['#b3f7f8', '#22ccd3', '#0d808a', '#8a0d4c', '#02181c'] },
    { name: '🦩 Flamingo Sunset', harmony: 'Split-Comp.', tone: 'vivid', hexes: ['#fce4ec', '#f06292', '#b33b70', '#3bb37e', '#2b0d1e'] },
    { name: '🌸 Cherry Blossom Light', harmony: 'Split-Comp.', tone: 'pastel', hexes: ['#fff5f7', '#fecdd3', '#f472b6', '#34d399', '#831843'] },
    { name: '🍹 Blue Lagoon', harmony: 'Split-Comp.', tone: 'bright', hexes: ['#e0f2fe', '#38bdf8', '#fb923c', '#f43f5e', '#0c4a6e'] },
    { name: '🪴 Terrarium Glass', harmony: 'Split-Comp.', tone: 'muted', hexes: ['#ecfdf5', '#6ee7b7', '#10b981', '#f43f5e', '#831843'] },
    { name: '🔮 Amethyst & Amber', harmony: 'Split-Comp.', tone: 'deep', hexes: ['#2e1065', '#7c3aed', '#f59e0b', '#10b981', '#0f172a'] },
    { name: '🪸 Sea Anemone', harmony: 'Split-Comp.', tone: 'vivid', hexes: ['#fff1f2', '#fb7185', '#e11d48', '#2dd4bf', '#134e4a'] },
    { name: '🍵 Matcha & Azuki', harmony: 'Split-Comp.', tone: 'muted', hexes: ['#f7fee7', '#bef264', '#65a30d', '#be185d', '#365314'] },
    { name: '🥞 Maple Syrup', harmony: 'Split-Comp.', tone: 'muted', hexes: ['#fffbeb', '#fde68a', '#b45309', '#4338ca', '#1e1b4b'] },
    { name: '🌌 Stardust Beam', harmony: 'Split-Comp.', tone: 'dark', hexes: ['#030712', '#1f2937', '#818cf8', '#fbbf24', '#06b6d4'] },
    { name: '🪷 Water Lily Pond', harmony: 'Split-Comp.', tone: 'pastel', hexes: ['#fdf2f8', '#fbcfe8', '#34d399', '#60a5fa', '#1e293b'] },

    // 🔲 5. Square (สี่เหลี่ยม 4 ทิศทาง) - 16 Presets
    { name: '🍇 Vintage Plum', harmony: 'Square', tone: 'deep', hexes: ['#1e0a1c', '#4a154b', '#7c2570', '#257c31', '#f3d1ec'] },
    { name: '🏜️ Sahara Dunes', harmony: 'Square', tone: 'muted', hexes: ['#f5e3d3', '#e8a87c', '#c47343', '#4394c4', '#2b1810'] },
    { name: '🍵 Warm Genmaicha', harmony: 'Square', tone: 'muted', hexes: ['#ede6d1', '#b5ac8b', '#756f59', '#595f75', '#1c1b17'] },
    { name: '🥐 Butter Croissant', harmony: 'Square', tone: 'light', hexes: ['#f9f1e1', '#dfa85b', '#a67238', '#386ca6', '#26190e'] },
    { name: '🏜️ Canyon Sunset', harmony: 'Square', tone: 'muted', hexes: ['#fadbcf', '#e67b5a', '#b84a32', '#32a0b8', '#2e110d'] },
    { name: '🍁 Autumn Fire', harmony: 'Square', tone: 'vivid', hexes: ['#ffbd59', '#f25c00', '#ab2a00', '#0081ab', '#2b0700'] },
    { name: '🌴 Palm Island', harmony: 'Square', tone: 'bright', hexes: ['#bbf2db', '#44a191', '#24706c', '#702428', '#07191d'] },
    { name: '🪵 Sandalwood', harmony: 'Square', tone: 'muted', hexes: ['#efe0d3', '#b58363', '#7e533b', '#3b667e', '#21150f'] },
    { name: '🥐 Honey Toast', harmony: 'Square', tone: 'bright', hexes: ['#fff3c4', '#e09d24', '#9e6911', '#11469e', '#291a03'] },
    { name: '🌋 Lava Core', harmony: 'Square', tone: 'dark', hexes: ['#ff8080', '#d92626', '#8a0f0f', '#0f8a8a', '#1f0303'] },
    { name: '🎡 Retro Fairground', harmony: 'Square', tone: 'vivid', hexes: ['#fef2f2', '#ef4444', '#10b981', '#3b82f6', '#f59e0b'] },
    { name: '🍰 Pastel Macaron', harmony: 'Square', tone: 'pastel', hexes: ['#fdf2f8', '#f9a8d4', '#93c5fd', '#a7f3d0', '#fde68a'] },
    { name: '🏰 Gothic Cathedral', harmony: 'Square', tone: 'dark', hexes: ['#0f172a', '#334155', '#991b1b', '#065f46', '#1e1b4b'] },
    { name: '🌊 Deep Coral Trench', harmony: 'Square', tone: 'deep', hexes: ['#082f49', '#0284c7', '#e11d48', '#059669', '#ca8a04'] },
    { name: '🏕️ Autumn Campfire', harmony: 'Square', tone: 'muted', hexes: ['#451a03', '#9a3412', '#d97706', '#0284c7', '#14532d'] },
    { name: '🏙️ Neon Tokyo City', harmony: 'Square', tone: 'vivid', hexes: ['#050510', '#ff007f', '#00f0ff', '#ffe600', '#7928ca'] },

    // 🔘 6. Monochromatic (สีเดียวเฉดต่าง) - 16 Presets
    { name: '🖤 Midnight Lux', harmony: 'Monochromatic', tone: 'dark', hexes: ['#f8fafc', '#94a3b8', '#3b82f6', '#1d4ed8', '#0f172a'] },
    { name: '🪐 Saturn Rings', harmony: 'Monochromatic', tone: 'neutral', hexes: ['#eedbce', '#b09e99', '#6d657b', '#37323e', '#151419'] },
    { name: '🍨 Taro Ice Cream', harmony: 'Monochromatic', tone: 'pastel', hexes: ['#f7f4fc', '#d8c5ed', '#b392d6', '#7e57c2', '#311b92'] },
    { name: '🪨 Basalt Stone', harmony: 'Monochromatic', tone: 'neutral', hexes: ['#d3d6df', '#7a7f8c', '#454952', '#25282e', '#121316'] },
    { name: '🪐 Starlight Voyage', harmony: 'Monochromatic', tone: 'dark', hexes: ['#d6e5ff', '#4172b8', '#1e3a70', '#0c1a3a', '#040817'] },
    { name: '🌸 Baby Pink', harmony: 'Monochromatic', tone: 'pastel', hexes: ['#fff1f2', '#fecdd3', '#f43f5e', '#be123c', '#4c0519'] },
    { name: '🌊 Ocean Deep Blue', harmony: 'Monochromatic', tone: 'deep', hexes: ['#f0f9ff', '#7dd3fc', '#0284c7', '#0369a1', '#082f49'] },
    { name: '🌿 Minty Fresh', harmony: 'Monochromatic', tone: 'light', hexes: ['#f0fdf4', '#86efac', '#22c55e', '#15803d', '#14532d'] },
    { name: '☕ Pure Mocha', harmony: 'Monochromatic', tone: 'muted', hexes: ['#faf5f0', '#d5bdaf', '#b08968', '#7f5539', '#382218'] },
    { name: '☀️ Sunny Amber', harmony: 'Monochromatic', tone: 'bright', hexes: ['#fffbeb', '#fde68a', '#f59e0b', '#d97706', '#78350f'] },
    { name: '💜 Royal Lavender', harmony: 'Monochromatic', tone: 'deep', hexes: ['#faf5ff', '#d8b4fe', '#9333ea', '#6b21a8', '#3b0764'] },
    { name: '🌫️ Foggy Morning', harmony: 'Monochromatic', tone: 'neutral', hexes: ['#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#0f172a'] },
    { name: '🍊 Citrus Punch', harmony: 'Monochromatic', tone: 'vivid', hexes: ['#fff7ed', '#fed7aa', '#f97316', '#ea580c', '#7c2d12'] },
    { name: '🫒 Mediterranean Olive', harmony: 'Monochromatic', tone: 'muted', hexes: ['#f7fee7', '#d9f99d', '#84cc16', '#4d7c0f', '#1a2e05'] },
    { name: '💎 Diamond Cyan', harmony: 'Monochromatic', tone: 'light', hexes: ['#ecfeff', '#a5f3fc', '#06b6d4', '#0891b2', '#164e63'] },
    { name: '🪨 Obsidian Charcoal', harmony: 'Monochromatic', tone: 'dark', hexes: ['#f4f4f5', '#a1a1aa', '#52525b', '#27272a', '#09090b'] },

    // 🌗 7. Shades (น้ำหนักเฉดสี) - 16 Presets
    { name: '🫐 Blueberry Muffin', harmony: 'Shades', tone: 'dark', hexes: ['#cbd5e1', '#64748b', '#334155', '#1e293b', '#0f172a'] },
    { name: '🍷 Pinot Noir', harmony: 'Shades', tone: 'deep', hexes: ['#f07d8b', '#b02334', '#78101f', '#420811', '#1a0307'] },
    { name: '🏙️ Metropolis Noir', harmony: 'Shades', tone: 'dark', hexes: ['#d0d0dc', '#78788a', '#3c3c48', '#1e1e24', '#0a0a0c'] },
    { name: '🍫 Dark Chocolate', harmony: 'Shades', tone: 'dark', hexes: ['#dbb8a7', '#804935', '#542d1f', '#331b12', '#170c08'] },
    { name: '🍵 Imperial Jade', harmony: 'Shades', tone: 'deep', hexes: ['#b4f7d4', '#31a673', '#186947', '#0b3826', '#03140e'] },
    { name: '☁️ Cloud White', harmony: 'Shades', tone: 'light', hexes: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8'] },
    { name: '🥀 Dried Crimson Rose', harmony: 'Shades', tone: 'deep', hexes: ['#fecdd3', '#e11d48', '#9f1239', '#881337', '#4c0519'] },
    { name: '🌊 Mariana Trench', harmony: 'Shades', tone: 'dark', hexes: ['#bae6fd', '#0284c7', '#0369a1', '#075985', '#082f49'] },
    { name: '🪵 Aged Oak', harmony: 'Shades', tone: 'muted', hexes: ['#e7dfd5', '#b5a18a', '#846f5b', '#5c4d3f', '#2c231b'] },
    { name: '🍇 Concord Grape', harmony: 'Shades', tone: 'deep', hexes: ['#e9d5ff', '#a855f7', '#7e22ce', '#581c87', '#2e1065'] },
    { name: '🍃 Eucalyptus', harmony: 'Shades', tone: 'muted', hexes: ['#d1fae5', '#6ee7b7', '#10b981', '#047857', '#064e3b'] },
    { name: '🏺 Terracotta Clay', harmony: 'Shades', tone: 'muted', hexes: ['#ffedd5', '#fb923c', '#c2410c', '#9a3412', '#431407'] },
    { name: '🪙 Silver Shadow', harmony: 'Shades', tone: 'neutral', hexes: ['#f1f5f9', '#cbd5e1', '#94a3b8', '#475569', '#1e293b'] },
    { name: '🪐 Deep Void', harmony: 'Shades', tone: 'dark', hexes: ['#e2e8f0', '#64748b', '#334155', '#1e293b', '#020617'] },
    { name: '🌸 Cherry Cream', harmony: 'Shades', tone: 'pastel', hexes: ['#fff1f2', '#fbcfe8', '#f472b6', '#db2777', '#831843'] },
    { name: '🌾 Raw Linen', harmony: 'Shades', tone: 'light', hexes: ['#fdfbf7', '#f4eee1', '#dfd5c2', '#b5a894', '#6b6151'] }
  ];
  window.CURATED_PALETTES = CURATED_PALETTES;

  // ═══ HARMONY METADATA DICTIONARY ═══
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

  // ── TONE METADATA DICTIONARY ──
  const TONE_DATA = {
    all: { name: 'ทั้งหมด', thName: 'สุ่มอิสระ', sub: 'สุ่มอิสระตามทฤษฎีสี', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>' },
    light: { name: 'Light', thName: 'สว่างนุ่ม', sub: 'สว่างอ่อนนุ่ม คลีนโปร่ง', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' },
    pastel: { name: 'Pastel', thName: 'พาสเทล', sub: 'สีหวานละมุน นุ่มนวล', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
    bright: { name: 'Bright', thName: 'สดใส', sub: 'สว่างสดใส มีพลังชัดเจน', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/></svg>' },
    vivid: { name: 'Vivid', thName: 'สดจัดจ้าน', sub: 'สดจัดจ้าน อิ่มตัวสูง', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    muted: { name: 'Muted', thName: 'เอิร์ธโทน', sub: 'เอิร์ธโทน มัวคลาสสิก', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>' },
    dark: { name: 'Dark', thName: 'มืด', sub: 'โทนมืด ลึกลับ ดาร์ก', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
    deep: { name: 'Deep', thName: 'เข้มลึก', sub: 'เข้มลึก อัญมณี Jewel', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 18 3 22 9 12 22 2 9 6 3"/></svg>' },
    neutral: { name: 'Neutral', thName: 'โมโนโทน', sub: 'โมโนโทน ธรรมชาติ เทา', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>' }
  };

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

  // WCAG relative luminance calculation (0.0 to 1.0)
  function getRelativeLuminance(hex) {
    if (!hex) return 0;
    const [r, g, b] = hexToRgb(hex);
    const toLinear = c => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }

  // WCAG contrast ratio between two hex colors (1:1 to 21:1)
  function getContrastRatio(hex1, hex2) {
    const l1 = getRelativeLuminance(hex1);
    const l2 = getRelativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Determine guaranteed high-contrast text color for any background hex
  function textColorFor(hex) {
    if (!hex) return '#ffffff';
    const contrastWhite = getContrastRatio(hex, '#ffffff');
    const contrastBlack = getContrastRatio(hex, '#0d0d0d');
    return contrastWhite >= contrastBlack ? '#ffffff' : '#0d0d0d';
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

  // ── History (Undo / Redo) Engine ──
  function capturePaletteState() {
    return {
      palette: palette.map(c => ({ ...c })),
      activeHarmony,
      activeTone,
      paletteTargetMode
    };
  }

  function pushHistory() {
    if (palette.length === 0) return;
    historyStack.push(capturePaletteState());
    if (historyStack.length > MAX_HISTORY) {
      historyStack.shift();
    }
    redoStack = [];
  }

  function undo() {
    if (historyStack.length === 0) {
      showToast('ไม่มีประวัติย้อนกลับแล้ว');
      return;
    }
    redoStack.push(capturePaletteState());
    const prev = historyStack.pop();
    palette = prev.palette.map(c => ({ ...c }));
    activeHarmony = prev.activeHarmony || activeHarmony;
    activeTone = prev.activeTone || activeTone;
    paletteTargetMode = prev.paletteTargetMode || paletteTargetMode;

    // Sync harmony dropdown
    const harmIconEl = document.getElementById('cp-harmony-current-icon');
    const harmLabelEl = document.getElementById('cp-harmony-current-label');
    if (typeof HARMONY_DATA !== 'undefined' && HARMONY_DATA[activeHarmony]) {
      if (harmIconEl) harmIconEl.innerHTML = HARMONY_DATA[activeHarmony].icon;
      if (harmLabelEl) harmLabelEl.textContent = HARMONY_DATA[activeHarmony].name;
      document.querySelectorAll('.cp-harmony-item').forEach(item => {
        item.classList.toggle('active', item.dataset.harmony === activeHarmony);
      });
    }

    // Sync tone dropdown
    const toneIconEl = document.getElementById('cp-tone-current-icon');
    const toneLabelEl = document.getElementById('cp-tone-current-label');
    if (typeof TONE_DATA !== 'undefined' && TONE_DATA[activeTone]) {
      if (toneIconEl) toneIconEl.innerHTML = TONE_DATA[activeTone].icon;
      if (toneLabelEl) toneLabelEl.textContent = TONE_DATA[activeTone].name;
      document.querySelectorAll('.cp-tone-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tone === activeTone);
      });
    }

    // Sync target mode label
    const modeLabelEl = document.getElementById('cp-target-mode-label');
    if (modeLabelEl) {
      modeLabelEl.textContent = paletteTargetMode === 'painting' ? 'รูปแบบสี: ภาพวาด ▾' : 'รูปแบบสี: กราฟิก ▾';
    }
    document.querySelectorAll('.cp-mode-item').forEach(item => {
      item.classList.toggle('active', item.dataset.mode === paletteTargetMode);
    });

    if (inspectorIdx >= palette.length) inspectorIdx = palette.length - 1;

    renderBars();
    updateInspector();
  }

  function redo() {
    if (redoStack.length === 0) {
      showToast('ไม่มีการทำซ้ำแล้ว');
      return;
    }
    historyStack.push(capturePaletteState());
    const next = redoStack.pop();
    palette = next.palette.map(c => ({ ...c }));
    activeHarmony = next.activeHarmony || activeHarmony;
    activeTone = next.activeTone || activeTone;
    paletteTargetMode = next.paletteTargetMode || paletteTargetMode;

    // Sync harmony dropdown
    const harmIconEl = document.getElementById('cp-harmony-current-icon');
    const harmLabelEl = document.getElementById('cp-harmony-current-label');
    if (typeof HARMONY_DATA !== 'undefined' && HARMONY_DATA[activeHarmony]) {
      if (harmIconEl) harmIconEl.innerHTML = HARMONY_DATA[activeHarmony].icon;
      if (harmLabelEl) harmLabelEl.textContent = HARMONY_DATA[activeHarmony].name;
      document.querySelectorAll('.cp-harmony-item').forEach(item => {
        item.classList.toggle('active', item.dataset.harmony === activeHarmony);
      });
    }

    // Sync tone dropdown
    const toneIconEl = document.getElementById('cp-tone-current-icon');
    const toneLabelEl = document.getElementById('cp-tone-current-label');
    if (typeof TONE_DATA !== 'undefined' && TONE_DATA[activeTone]) {
      if (toneIconEl) toneIconEl.innerHTML = TONE_DATA[activeTone].icon;
      if (toneLabelEl) toneLabelEl.textContent = TONE_DATA[activeTone].name;
      document.querySelectorAll('.cp-tone-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tone === activeTone);
      });
    }

    const modeLabelEl = document.getElementById('cp-target-mode-label');
    if (modeLabelEl) {
      modeLabelEl.textContent = paletteTargetMode === 'painting' ? 'รูปแบบสี: ภาพวาด ▾' : 'รูปแบบสี: กราฟิก ▾';
    }
    document.querySelectorAll('.cp-mode-item').forEach(item => {
      item.classList.toggle('active', item.dataset.mode === paletteTargetMode);
    });

    if (inspectorIdx >= palette.length) inspectorIdx = palette.length - 1;

    renderBars();
    updateInspector();
  }

  window.cpUndo = undo;
  window.cpRedo = redo;

  function randomizePalette() {
    pushHistory();
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

    const titleBtn = document.getElementById('cp-title-randomize-btn');
    if (titleBtn) {
      titleBtn.classList.remove('spinning');
      void titleBtn.offsetWidth;
      titleBtn.classList.add('spinning');
    }
  }

  window.randomizePalette = function () {
    randomizePalette();
  };

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
        ? ['Deep Shadow', 'Core Shadow', 'Base Tone (Primary)', 'Key Light', 'Rim / Accent']
        : ['Background', 'Surface', 'Primary', 'Secondary', 'Text'];

      const lockIcon = col.locked
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;

      const bar = document.createElement('div');
      bar.className = 'cp-color-bar';
      bar.style.background = col.hex;
      bar.style.color = txtCol;
      bar.setAttribute('draggable', 'true');
      bar.dataset.idx = idx;

      if (inspectorIdx === idx) bar.classList.add('is-inspecting');

      bar.innerHTML = `
        <button class="cp-bar-lock ${col.locked ? 'is-locked' : ''}" data-lock="${idx}" title="${col.locked ? 'ปลดล็อค' : 'ล็อคสีนี้'}">
          ${lockIcon}
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
          pushHistory();
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
          pushHistory();
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
        e.dataTransfer.setData('text/plain', 'palette-bar:' + idx);
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
        e.stopPropagation();
        bar.classList.remove('drag-over');
        if (dragSrcIdx !== -1 && dragSrcIdx !== idx) {
          pushHistory();
          const movedItem = palette.splice(dragSrcIdx, 1)[0];
          palette.splice(idx, 0, movedItem);
          if (inspectorIdx === dragSrcIdx) inspectorIdx = idx;
          renderBars();
          updateInspector();
        }
      });

      container.appendChild(bar);
    });

    if (isThemePreviewActive && palette && palette.length > 0) {
      applyThemePreview(false);
    }
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
      const presetsCountEl = document.getElementById('cp-presets-count');
      if (presetsCountEl) presetsCountEl.textContent = CURATED_PALETTES.length;
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

    const harmObj = HARMONY_DATA[activeHarmony] || {};
    const toneObj = TONE_DATA[activeTone] || {};

    const newItem = {
      id: 'palette_' + Date.now(),
      name: finalName,
      hexes: hexes,
      harmony: activeHarmony || 'analogous',
      harmonyName: harmObj.name || activeHarmony || 'Analogous',
      harmonySub: harmObj.sub || 'สีข้างเคียง',
      tone: activeTone || 'all',
      toneName: toneObj.name || activeTone || 'ทั้งหมด',
      toneTh: toneObj.thName || 'สุ่มอิสระ',
      toneSub: toneObj.sub || 'สุ่มอิสระตามทฤษฎีสี',
      createdAt: new Date().toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    saved.unshift(newItem);
    savePalettesToStorage(saved);
    showToast(`บันทึกชุดสี "${finalName}" เรียบร้อยแล้ว!`);
    
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
    pushHistory();

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
    showToast(`โหลดชุดสี "${paletteName}" เรียบร้อย!`);
  };

  // ── Color Keyword Matcher for Search ──
  const COLOR_KEYWORD_MAP = [
    {
      terms: ['ส้ม', 'orange', 'แสด', 'พีช', 'peach', 'amber', 'ส้มแสด', 'ส้มทอง', 'ส้มพีช', 'ส้มเบจ', 'โอรส', 'โอลด์โรส'],
      test: (h, s, v) => (s > 15 && v > 20 && ((h >= 14 && h <= 48) || (h >= 10 && h <= 52 && s > 30)))
    },
    {
      terms: ['แดง', 'red', 'เลือดหมู', 'maroon', 'crimson', 'แดงสด', 'ชมพูแดง', 'ทับทิม', 'แดงเข้ม'],
      test: (h, s, v) => (s > 20 && v > 15 && ((h >= 345 || h <= 14) || (h <= 18 && v <= 55)))
    },
    {
      terms: ['ชมพู', 'pink', 'rose', 'magenta', 'บานเย็น', 'ชมพูกะปิ', 'ชมพูสด', 'ชมพูเข้ม', 'ชมพูหวาน'],
      test: (h, s, v) => (s > 12 && v > 25 && (h >= 315 && h < 345))
    },
    {
      terms: ['เหลือง', 'yellow', 'ทอง', 'gold', 'mustard', 'มัสตาร์ด', 'เหลืองสด', 'เหลืองครีม'],
      test: (h, s, v) => (s > 15 && v > 35 && (h >= 45 && h <= 68))
    },
    {
      terms: ['เขียว', 'green', 'ตอง', 'lime', 'มินต์', 'มิ้นต์', 'mint', 'emerald', 'olive', 'ขี้ม้า', 'เขียวตอง', 'เขียวมรกต', 'เขียวไผ่', 'เขียวแก่', 'เขียวพาสเทล', 'เขียวขี้ม้า'],
      test: (h, s, v) => (s > 12 && v > 15 && (h >= 68 && h <= 170))
    },
    {
      terms: ['ฟ้า', 'cyan', 'sky', 'teal', 'azure', 'ฟ้าอมเขียว', 'ฟ้าสดใส', 'ฟ้าเทา', 'น้ำทะเล'],
      test: (h, s, v) => (s > 12 && v > 20 && (h >= 170 && h <= 218))
    },
    {
      terms: ['น้ำเงิน', 'blue', 'navy', 'sapphire', 'คราม', 'น้ำเงินไพลิน', 'น้ำเงินคราม', 'น้ำเงินเข้ม'],
      test: (h, s, v) => (s > 15 && v > 15 && (h >= 218 && h <= 255))
    },
    {
      terms: ['ม่วง', 'purple', 'violet', 'lavender', 'ลาเวนเดอร์', 'orchid', 'กล้วยไม้', 'ม่วงอเมทิสต์', 'ม่วงกล้วยไม้', 'ม่วงลาเวนเดอร์', 'ม่วงพาสเทล', 'ม่วงเข้ม'],
      test: (h, s, v) => (s > 12 && v > 15 && (h >= 255 && h <= 315))
    },
    {
      terms: ['น้ำตาล', 'brown', 'ช็อกโกแลต', 'chocolate', 'coffee', 'กาแฟ', 'earth', 'น้ำตาลเข้ม', 'น้ำตาลส้ม'],
      test: (h, s, v) => (s > 15 && v <= 55 && (h >= 10 && h <= 45))
    },
    {
      terms: ['ดำ', 'black', 'มืด', 'charcoal', 'เทาอมมืด'],
      test: (h, s, v) => (v <= 18)
    },
    {
      terms: ['ขาว', 'white', 'สว่าง', 'ขาวควันบุหรี่'],
      test: (h, s, v) => (s <= 14 && v >= 82)
    },
    {
      terms: ['เทา', 'gray', 'grey', 'ควันบุหรี่', 'เทาเข้ม'],
      test: (h, s, v) => (s <= 18 && v > 18 && v < 82)
    },
    {
      terms: ['ครีม', 'cream', 'เบจ', 'beige'],
      test: (h, s, v) => (s <= 35 && s >= 6 && v >= 75 && (h >= 25 && h <= 65))
    }
  ];

  function matchColorSwatch(hex, q) {
    if (!hex || !q) return false;
    const cleanHex = hex.replace('#', '').toLowerCase();
    const cleanQ = q.replace('#', '').trim();
    if (cleanQ && cleanHex.includes(cleanQ)) return true;

    const [r, g, b] = hexToRgb(hex);
    const hsv = rgbToHsv(r, g, b);
    const colorName = getColorName(hsv.h, hsv.s, hsv.v).toLowerCase();
    if (colorName.includes(q)) return true;

    // Check if query starts with "สี" (e.g. "สีส้ม", "สีฟ้า") and strip it for keyword matching
    const strippedQ = q.startsWith('สี') && q.length > 2 ? q.slice(2).trim() : q;

    for (const km of COLOR_KEYWORD_MAP) {
      const isTermMatch = km.terms.some(t => {
        const tLower = t.toLowerCase();
        return tLower === q || 
               tLower === strippedQ || 
               q.includes(tLower) || 
               (q.length >= 2 && tLower.startsWith(strippedQ));
      });
      if (isTermMatch && km.test(hsv.h, hsv.s, hsv.v)) {
        return true;
      }
    }
    return false;
  }

  // ── Ranked Search Match Scoring ──
  // Priority: 1. ชื่อหลัก (Title) > 2. สีที่อยู่ในช่อง (Colors) > 3. รูปแบบการจับคู่สี (Harmony) > 4. หมวดหมู่โทนสี (Tone) > 5. วันที่ (Date)
  function calculatePaletteSearchMatch(item, query) {
    if (!query) return { matched: true, score: 0 };
    const q = query.toLowerCase().trim();

    let score = 0;

    // 1. ชื่อหลัก (Main Name / Title) - Highest Priority (10,000+)
    if (item.name) {
      const nameLower = item.name.toLowerCase();
      if (nameLower === q) {
        score += 100000;
      } else if (nameLower.startsWith(q)) {
        score += 50000;
      } else if (nameLower.includes(q)) {
        score += 10000;
      }
    }

    // 2. สีที่อยู่ในช่อง (Colors in slots) - Second Priority (1,000+)
    const hexList = item.hexes || [];
    if (Array.isArray(hexList)) {
      let matchCount = 0;
      for (const hex of hexList) {
        if (matchColorSwatch(hex, q)) {
          matchCount++;
        }
      }
      if (matchCount > 0) {
        score += 1000 + (matchCount - 1) * 50;
      }
    }

    // 3. รูปแบบการจับคู่สี (Harmony / Pairing Rule) - Third Priority (100+)
    const harmKey = (item.harmony || '').toLowerCase().replace('-comp.', '').replace('-comp', '');
    const harmObj = HARMONY_DATA[harmKey] || HARMONY_DATA[item.harmony] || {};
    const harmTerms = [
      item.harmony,
      item.harmonyName,
      item.harmonySub,
      harmObj.name,
      harmObj.sub
    ].filter(Boolean).map(s => s.toLowerCase());

    if (harmTerms.some(t => t.includes(q) || q.includes(t))) {
      score += 100;
    }

    // 4. หมวดหมู่โทนสี (Tone Category) - Fourth Priority (10+)
    const toneKey = (item.tone || '').toLowerCase();
    const toneObj = TONE_DATA[toneKey] || TONE_DATA[item.tone] || {};
    const toneTerms = [
      item.tone,
      item.toneName,
      item.toneTh,
      item.toneSub,
      toneObj.name,
      toneObj.thName,
      toneObj.sub
    ].filter(Boolean).map(s => s.toLowerCase());

    if (toneTerms.some(t => t.includes(q) || q.includes(t))) {
      score += 10;
    }

    // 5. วันที่ (Date / CreatedAt) - Fifth Priority (1+)
    if (item.createdAt && item.createdAt.toLowerCase().includes(q)) {
      score += 1;
    }

    return { matched: score > 0, score };
  }

  window.matchColorSwatch = matchColorSwatch;
  window.calculatePaletteSearchMatch = calculatePaletteSearchMatch;

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
      let itemsToRender = [];
      if (query) {
        itemsToRender = saved
          .map((item, originalIndex) => {
            const { matched, score } = calculatePaletteSearchMatch(item, query);
            return { item, originalIndex, score, matched };
          })
          .filter(r => r.matched)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.originalIndex - b.originalIndex;
          })
          .map(r => r.item);
      } else {
        itemsToRender = saved;
      }

      if (itemsToRender.length === 0) {
        if (query) {
          listContainer.innerHTML = `
            <div class="cp-empty-state">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <div>ไม่พบชุดสีที่ตรงกับ "${query}"</div>
              <div style="font-size:11px;opacity:0.7;margin-top:2px;">ลองค้นหาด้วยชื่อชุดสี, ชื่อสีในช่อง (เช่น ส้ม, ชมพู), รูปแบบสี หรือโทนสี</div>
            </div>
          `;
        } else {
          listContainer.innerHTML = `
            <div class="cp-empty-state">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <div>ยังไม่มีชุดสีที่บันทึกไว้</div>
              <div style="font-size:11px;opacity:0.7;margin-top:2px;">พิมพ์ชื่อแล้วกด "บันทึกสีปัจจุบัน" เพื่อเก็บชุดสีโปรดของคุณ</div>
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

        const harmLabel = item.harmonySub || item.harmonyName || (HARMONY_DATA[item.harmony] && (HARMONY_DATA[item.harmony].sub || HARMONY_DATA[item.harmony].name)) || '';
        const toneLabel = item.toneTh || item.toneName || (TONE_DATA[item.tone] && (TONE_DATA[item.tone].thName || TONE_DATA[item.tone].name)) || (item.tone && item.tone !== 'all' ? item.tone : '');

        const metaParts = [];
        if (item.createdAt) metaParts.push(`<span class="cp-card-date">${item.createdAt}</span>`);
        if (harmLabel) metaParts.push(`<span class="cp-card-meta-dot">•</span><span class="cp-card-harmony" title="รูปแบบการจับคู่สี: ${harmLabel}">${harmLabel}</span>`);
        if (toneLabel) metaParts.push(`<span class="cp-card-meta-dot">•</span><span class="cp-card-tone" title="หมวดหมู่โทนสี: ${item.toneSub || toneLabel}">${toneLabel}</span>`);

        card.innerHTML = `
          <div class="cp-card-info">
            <div class="cp-card-name" title="${item.name}">${item.name}</div>
            <div class="cp-card-meta">${metaParts.join('')}</div>
          </div>
          <div class="cp-card-swatches">${swatchesHtml}</div>
          <div class="cp-card-actions">
            <button class="cp-card-btn primary" onclick="loadPaletteHexes(${safeHexesArray}, '${safeName}')" title="โหลดชุดสีนี้มาใช้งาน">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>โหลดชุดสี</span>
            </button>
            <button class="cp-card-btn" onclick="copyColorHex('${item.hexes.join(', ')}')" title="คัดลอกรหัสสี">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
            <button class="cp-card-btn danger" onclick="deleteSavedPalette('${item.id}')" title="ลบชุดสีนี้">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        `;
        listContainer.appendChild(card);
      });
    } else {
      let itemsToRender = [];
      if (query) {
        itemsToRender = CURATED_PALETTES
          .map((item, originalIdx) => {
            const { matched, score } = calculatePaletteSearchMatch(item, query);
            return { item, originalIdx, score, matched };
          })
          .filter(r => r.matched)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.originalIdx - b.originalIdx;
          });
      } else {
        itemsToRender = CURATED_PALETTES.map((item, originalIdx) => ({ item, originalIdx }));
      }

      if (itemsToRender.length === 0) {
        listContainer.innerHTML = `
          <div class="cp-empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <div>ไม่พบ Preset ที่ตรงกับ "${query}"</div>
            <div style="font-size:11px;opacity:0.7;margin-top:2px;">ลองค้นหาคำอื่น เช่น ส้ม, ชมพู, Pastel, Cyberpunk, Jade</div>
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
        const harmKey = (item.harmony || '').toLowerCase().replace('-comp.', '').replace('-comp', '');
        const harmObj = HARMONY_DATA[harmKey] || HARMONY_DATA[item.harmony] || {};
        const harmLabel = item.harmony || 'Custom';
        const harmSub = harmObj.sub || '';

        const toneKey = (item.tone || '').toLowerCase();
        const toneObj = TONE_DATA[toneKey] || {};
        const toneLabel = toneObj.thName || toneObj.name || item.tone || '';

        const metaParts = [];
        metaParts.push(`<span class="cp-card-harmony" title="รูปแบบการจับคู่สี: ${harmSub ? `${harmLabel} (${harmSub})` : harmLabel}">${harmLabel}</span>`);
        if (toneLabel) {
          metaParts.push(`<span class="cp-card-meta-dot">•</span><span class="cp-card-tone" title="หมวดหมู่โทนสี: ${toneObj.sub || toneLabel}">${toneLabel}</span>`);
        }

        card.innerHTML = `
          <div class="cp-card-info">
            <div class="cp-card-name" title="${item.name}">${item.name}</div>
            <div class="cp-card-meta">${metaParts.join('')}</div>
          </div>
          <div class="cp-card-swatches">${swatchesHtml}</div>
          <div class="cp-card-actions">
            <button class="cp-card-btn primary" onclick="loadCuratedPreset(${originalIdx})" title="โหลดชุดสีนี้มาใช้งาน">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>โหลดชุดสี</span>
            </button>
            <button class="cp-card-btn" onclick="copyColorHex('${computedHexes.join(', ')}')" title="คัดลอกรหัสสี">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
          </div>
        `;
        listContainer.appendChild(card);
      });
    }
  }

  window.loadCuratedPreset = function (presetIndex) {
    const preset = CURATED_PALETTES[presetIndex];
    if (!preset) return;
    pushHistory();

    // 1. Activate tone in Tone Menu UI if preset defines tone
    if (preset.tone && TONE_DATA[preset.tone]) {
      activeTone = preset.tone;
      const iconEl = document.getElementById('cp-tone-current-icon');
      const labelEl = document.getElementById('cp-tone-current-label');
      if (iconEl) iconEl.innerHTML = TONE_DATA[preset.tone].icon;
      if (labelEl) labelEl.textContent = TONE_DATA[preset.tone].name;
      document.querySelectorAll('.cp-tone-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tone === preset.tone);
      });
    }

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

    showToast(`โหลดชุดสี "${preset.name}" เรียบร้อย!`);
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

      pushHistory();
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
        // If we are dragging an internal color bar, DO NOT trigger image drop overlay!
        if (dragSrcIdx !== -1) return;

        const types = e.dataTransfer ? Array.from(e.dataTransfer.types || []) : [];
        const isFileOrRef = types.includes('Files') || types.includes('application/x-toruo-ref-image');
        if (!isFileOrRef) return;

        dragCounter++;
        targetEl.classList.add('cp-dragover');
      });

      targetEl.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (dragSrcIdx !== -1) return;
        dragCounter--;
        if (dragCounter <= 0) {
          dragCounter = 0;
          targetEl.classList.remove('cp-dragover');
        }
      });

      targetEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (dragSrcIdx !== -1) {
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
          return;
        }
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      });

      targetEl.addEventListener('drop', function (e) {
        if (dragSrcIdx !== -1) return; // Internal bar reordering handled by bar drop listener
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

  let currentExportTheme = 'auto'; // 'auto' | 'light' | 'dark'

  function getCurrentWebsiteTheme() {
    if (document.documentElement.getAttribute('data-theme-preview') === 'active') {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      if (bg) {
        return textColorFor(bg) === '#0d0d0d' ? 'light' : 'dark';
      }
    }
    const systemTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    return systemTheme === 'light' ? 'light' : 'dark';
  }

  window.openExportImageModal = function () {
    const modal = document.getElementById('cp-export-modal');
    if (!modal) return;
    currentExportTheme = 'auto';
    updateExportThemeButton();
    renderExportPaletteCanvas();
    modal.classList.add('open');
  };

  window.closeExportImageModal = function () {
    const modal = document.getElementById('cp-export-modal');
    if (modal) modal.classList.remove('open');
  };

  window.toggleExportImageTheme = function () {
    const currentSiteTheme = getCurrentWebsiteTheme();
    const effective = currentExportTheme === 'auto' ? currentSiteTheme : currentExportTheme;
    currentExportTheme = effective === 'dark' ? 'light' : 'dark';
    updateExportThemeButton();
    renderExportPaletteCanvas();
  };

  function updateExportThemeButton() {
    const btn = document.getElementById('cp-export-theme-btn');
    const label = document.getElementById('cp-export-theme-label');
    if (!btn || !label) return;

    const currentSiteTheme = getCurrentWebsiteTheme();
    const effective = currentExportTheme === 'auto' ? currentSiteTheme : currentExportTheme;

    btn.setAttribute('data-theme-mode', effective);
    label.textContent = effective === 'light' ? 'ธีมภาพ: สว่าง' : 'ธีมภาพ: มืด';
  }

  window.onWebsiteThemeChanged = function () {
    const modal = document.getElementById('cp-export-modal');
    if (modal && modal.classList.contains('open')) {
      currentExportTheme = 'auto';
      updateExportThemeButton();
      renderExportPaletteCanvas();
    }
  };

  // Live observe document theme changes for automatic real-time sync
  if (typeof MutationObserver !== 'undefined') {
    const themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'data-theme' || m.attributeName === 'data-theme-preview')) {
          if (typeof window.onWebsiteThemeChanged === 'function') {
            window.onWebsiteThemeChanged();
          }
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-theme-preview'] });
  }

  function renderExportPaletteCanvas() {
    const canvas = document.getElementById('cp-export-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = 1200;
    const H = 680;
    canvas.width = W;
    canvas.height = H;

    const currentSiteTheme = getCurrentWebsiteTheme();
    const isLight = (currentExportTheme === 'auto' ? currentSiteTheme : currentExportTheme) === 'light';

    // Theme-based canvas colors matching website aesthetic
    let bg0, bg1, borderColor, titleColor, subColor, brandColor, barBorderColor, nameColor, nameSubColor, dividerColor, footerColor;

    if (isLight) {
      bg0 = '#fafafa';
      bg1 = '#f0f0f4';
      borderColor = '#e0e0e6';
      titleColor = '#0a0a0a';
      subColor = '#666677';
      brandColor = '#888899';
      barBorderColor = 'rgba(0, 0, 0, 0.08)';
      nameColor = '#1a1a24';
      nameSubColor = '#666677';
      dividerColor = '#e2e2ea';
      footerColor = '#888899';
    } else {
      bg0 = '#111116';
      bg1 = '#181822';
      borderColor = '#282836';
      titleColor = '#f0f0f5';
      subColor = '#8888a5';
      brandColor = '#666685';
      barBorderColor = 'rgba(255, 255, 255, 0.1)';
      nameColor = '#d0d0e0';
      nameSubColor = '#8888a0';
      dividerColor = '#222232';
      footerColor = '#666680';
    }

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, bg0);
    bgGrad.addColorStop(1, bg1);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle outer border inside canvas
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Header Title
    ctx.font = 'bold 28px "Inter", "Prompt", sans-serif';
    ctx.fillStyle = titleColor;
    ctx.textAlign = 'left';
    ctx.fillText('TORU_O COLOR PALETTE', 40, 52);

    // Header Subtitle (Strict rule: No emojis)
    ctx.font = '500 14px "Inter", "Prompt", sans-serif';
    ctx.fillStyle = subColor;
    const modeLabel = paletteTargetMode === 'painting' ? 'PAINTING MODE' : 'GRAPHIC MODE (60-30-10)';
    const harmonyLabel = (activeHarmony || 'Analogous').toUpperCase();
    ctx.fillText(`HARMONY: ${harmonyLabel}  |  ${modeLabel}`, 40, 78);

    // Brand Tag
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = brandColor;
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
      ctx.strokeStyle = barBorderColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Role Badge inside or below bar (Strict rule: No emojis)
      let roleLabel = '';
      if (paletteTargetMode === 'painting') {
        const pRoles = ['Atmosphere', 'Shadow', 'Hero', 'Key Light', 'Rim Light'];
        roleLabel = pRoles[idx] || `Color #${idx + 1}`;
      } else {
        const gRoles = ['Background', 'Surface', 'Primary', 'Secondary', 'Text'];
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
      ctx.fillStyle = nameColor;
      ctx.textAlign = 'center';

      // Split Thai / English if too wide
      const parts = colorName.split(' / ');
      if (parts.length === 2 && barW < 160) {
        ctx.fillText(parts[0], x + barW / 2, barY + barH + 28);
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillStyle = nameSubColor;
        ctx.fillText(parts[1], x + barW / 2, barY + barH + 46);
      } else {
        ctx.fillText(colorName, x + barW / 2, barY + barH + 32);
      }
      ctx.restore();
    });

    // Divider Line
    ctx.strokeStyle = dividerColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 615);
    ctx.lineTo(W - 40, 615);
    ctx.stroke();

    // Footer Watermark
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = footerColor;
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

  // ═══ THEME PREVIEW ENGINE (Live Website Theme Mapping) ═══

  function mixHex(hexA, hexB, weightB) {
    const [rA, gA, bA] = hexToRgb(hexA);
    const [rB, gB, bB] = hexToRgb(hexB);
    const r = Math.round(rA * (1 - weightB) + rB * weightB);
    const g = Math.round(gA * (1 - weightB) + gB * weightB);
    const b = Math.round(bA * (1 - weightB) + bB * weightB);
    return rgbToHex(r, g, b);
  }

  function hexWithAlpha(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getThemeMappingFromPalette() {
    if (!palette || palette.length === 0) return null;
    const pLen = palette.length;
    let bg, surface, primary, secondary, text;

    if (pLen >= 5 && paletteTargetMode === 'graphic') {
      bg = palette[0].hex;
      surface = palette[1].hex;
      primary = palette[2].hex;
      secondary = palette[3].hex;
      text = palette[4].hex;
    } else {
      const sorted = [...palette].sort((a, b) => a.v - b.v);
      const avgV = palette.reduce((acc, c) => acc + c.v, 0) / pLen;
      const isDark = avgV < 50;

      bg = isDark ? sorted[0].hex : sorted[sorted.length - 1].hex;
      surface = isDark ? (sorted[1] ? sorted[1].hex : sorted[0].hex) : (sorted[sorted.length - 2] ? sorted[sorted.length - 2].hex : sorted[0].hex);
      text = isDark ? sorted[sorted.length - 1].hex : sorted[0].hex;

      const satSorted = [...palette].sort((a, b) => b.s - a.s);
      primary = satSorted[0] ? satSorted[0].hex : text;
      secondary = satSorted[1] ? satSorted[1].hex : surface;
    }

    // Ensure contrast between body text and bg is at least 4.5:1 (WCAG AA standard)
    if (getContrastRatio(bg, text) < 4.5) {
      const bgLum = getRelativeLuminance(bg);
      text = bgLum < 0.4 ? '#f5f5f7' : '#0d0d0d';
    }

    return { bg, surface, primary, secondary, text };
  }

  function applyThemePreview(showToastFlag = false) {
    const mapping = getThemeMappingFromPalette();
    if (!mapping) return;

    // Calculate guaranteed high-contrast text color for elements on top of Primary/Accent
    const accentTextColor = textColorFor(mapping.primary);
    const bgTextColor = textColorFor(mapping.bg);

    const themeProps = {
      '--bg': mapping.bg,
      '--bg2': mapping.surface,
      '--bg3': mixHex(mapping.surface, mapping.text, 0.08),
      '--line': mixHex(mapping.surface, mapping.text, 0.16),
      '--line2': mixHex(mapping.surface, mapping.text, 0.24),
      '--text': mapping.text,
      '--text2': mixHex(mapping.bg, mapping.text, 0.62),
      '--text3': mixHex(mapping.bg, mapping.text, 0.38),
      '--accent': mapping.primary,
      '--accent-text': accentTextColor,
      '--primary': mapping.primary,
      '--primary-text': accentTextColor,
      '--secondary': mapping.secondary,
      '--inv': bgTextColor,
      '--inv-bg': mapping.text,
      '--lb-bg': hexWithAlpha(mapping.bg, 0.96),
      '--lb-close-bg': hexWithAlpha(mapping.text, 0.08),
      '--lb-close-border': hexWithAlpha(mapping.text, 0.15),
      '--lb-close-color': mapping.text,
      '--lb-close-hover': hexWithAlpha(mapping.text, 0.18),
      '--lb-title-color': mapping.text,
      '--lb-desc-color': mixHex(mapping.bg, mapping.text, 0.62),
      '--lb-price-bg': hexWithAlpha(mapping.text, 0.08),
      '--lb-price-border': hexWithAlpha(mapping.text, 0.15),
      '--lb-price-color': mapping.text,
      '--lb-divider': hexWithAlpha(mapping.text, 0.08),
      '--lb-card-bg': hexWithAlpha(mapping.text, 0.03),
      '--lb-card-border': hexWithAlpha(mapping.text, 0.06)
    };

    const docEl = document.documentElement;
    for (const [key, val] of Object.entries(themeProps)) {
      docEl.style.setProperty(key, val);
    }
    const isLight = textColorFor(mapping.bg) === '#0d0d0d';
    docEl.setAttribute('data-theme', isLight ? 'light' : 'dark');
    docEl.setAttribute('data-theme-preview', 'active');
    docEl.setAttribute('data-theme-mode', 'random');

    const previewBtn = document.getElementById('cp-btn-preview-theme');
    if (previewBtn) {
      previewBtn.classList.add('active');
      previewBtn.title = 'ปิดการแสดงตัวอย่างธีมเว็บ (กลับสู่ธีมเดิม)';
    }

    const fab = document.getElementById('palette-fab');
    if (fab) fab.classList.add('theme-previewing');

    try {
      localStorage.setItem('cp_theme_preview_enabled', 'true');
      localStorage.setItem('cp_theme_preview_active', 'true');
      localStorage.setItem('cp_theme_preview_mapping', JSON.stringify(mapping));
      localStorage.setItem('theme_mode', 'random');
    } catch (e) {}

    const navThemeBtn = document.getElementById('nav-theme-btn');
    if (navThemeBtn) {
      navThemeBtn.setAttribute('title', 'โหมดตัวอย่างชุดสี (คลิกเพื่อเปลี่ยนเป็นธีมมืด)');
      navThemeBtn.setAttribute('aria-label', 'โหมดตัวอย่างชุดสี');
    }

    if (typeof window.onWebsiteThemeChanged === 'function') {
      window.onWebsiteThemeChanged();
    }

    if (showToastFlag) {
      showToast('เปิดการแสดงตัวอย่างธีมเว็บ');
    }
  }

  function revertThemePreview(showToastFlag = true) {
    const keys = [
      '--bg', '--bg2', '--bg3', '--line', '--line2',
      '--text', '--text2', '--text3', '--accent', '--accent-text',
      '--primary', '--primary-text',
      '--secondary', '--inv', '--inv-bg', '--lb-bg',
      '--lb-close-bg', '--lb-close-border', '--lb-close-color',
      '--lb-close-hover', '--lb-title-color', '--lb-desc-color',
      '--lb-price-bg', '--lb-price-border', '--lb-price-color',
      '--lb-divider', '--lb-card-bg', '--lb-card-border'
    ];

    const docEl = document.documentElement;
    keys.forEach(k => docEl.style.removeProperty(k));
    docEl.removeAttribute('data-theme-preview');

    const baseTheme = localStorage.getItem('theme') || 'dark';
    docEl.setAttribute('data-theme', baseTheme);
    docEl.setAttribute('data-theme-mode', baseTheme);

    const previewBtn = document.getElementById('cp-btn-preview-theme');
    if (previewBtn) {
      previewBtn.classList.remove('active');
      previewBtn.title = 'ดูตัวอย่างการใช้ชุดสีกับทั้งเว็บไซต์';
    }

    const fab = document.getElementById('palette-fab');
    if (fab) fab.classList.remove('theme-previewing');

    try {
      localStorage.removeItem('cp_theme_preview_enabled');
      localStorage.removeItem('cp_theme_preview_active');
      localStorage.removeItem('cp_theme_preview_mapping');
      localStorage.setItem('theme_mode', baseTheme);
    } catch (e) {}

    const navThemeBtn = document.getElementById('nav-theme-btn');
    if (navThemeBtn) {
      navThemeBtn.setAttribute('title', baseTheme === 'dark' ? 'ธีมมืด (คลิกเพื่อเปลี่ยนเป็นธีมสว่าง)' : 'ธีมสว่าง (คลิกเพื่อเปลี่ยนเป็นธีมมืด)');
      navThemeBtn.setAttribute('aria-label', baseTheme === 'dark' ? 'ธีมมืด' : 'ธีมสว่าง');
    }

    if (typeof window.onWebsiteThemeChanged === 'function') {
      window.onWebsiteThemeChanged();
    }

    if (showToastFlag) {
      showToast('ปิดการแสดงตัวอย่างธีม คืนค่าสีเดิมเรียบร้อย');
    }
  }

  window.toggleThemePreview = function () {
    isThemePreviewActive = !isThemePreviewActive;
    if (isThemePreviewActive) {
      applyThemePreview(true);
    } else {
      revertThemePreview(true);
    }
  };

  window.isPaletteThemePreviewActive = function () {
    return isThemePreviewActive;
  };

  // Exposed for navbar theme switcher (only when Theme Preview is active)
  window.applyRandomPaletteTheme = function (forceNew = true) {
    if (forceNew || palette.length === 0) {
      randomizePalette();
    }
    isThemePreviewActive = true;
    applyThemePreview(false);
  };

  window.revertRandomPaletteTheme = function () {
    isThemePreviewActive = false;
    revertThemePreview(false);
  };

  // ═══ MODAL WINDOW MANAGEMENT ═══

  function bringToFront(el) {
    highestZ += 2;
    el.style.zIndex = highestZ;
  }

  window.toggleColorPalette = function (fromUserAction = true) {
    const modal = document.getElementById('color-palette-modal');
    const fab = document.getElementById('palette-fab');
    if (!modal) return;

    const isOpen = modal.classList.contains('open');
    if (isOpen) {
      modal.classList.remove('open');
      if (fab) fab.classList.remove('active');
      closeInspector();
      closeAllDropdowns();

      const toolsPage = document.getElementById('page-tools');
      if (toolsPage) {
        toolsPage.classList.remove('colorpalette-split');
        toolsPage.style.paddingTop = '';
      }

      const drawer = document.getElementById('cp-saved-drawer');
      if (drawer) drawer.classList.remove('open');

      if (fromUserAction && history.state && history.state.colorPaletteModalOpen) {
        history.back();
      }
    } else {
      bringToFront(modal);
      modal.classList.add('open');
      try {
        history.pushState({ colorPaletteModalOpen: true }, '');
      } catch (err) {}
      if (fab) fab.classList.add('active');
      renderBars();

      const previewBtn = document.getElementById('cp-btn-preview-theme');
      if (previewBtn) previewBtn.classList.toggle('active', isThemePreviewActive);

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
      const refModal = document.getElementById('refboard-modal');
      if (!modal) return;

      const isPaletteOpen = modal.classList.contains('open');
      const isRefOpen = refModal && refModal.classList.contains('open') && !refModal.classList.contains('floating-mode') && !refModal.classList.contains('pip-mode');
      const isBothOpen = isPaletteOpen && isRefOpen;

      if (window.innerWidth > 1024) {
        if (isBothOpen) {
          document.body.classList.add('refboard-split');
          modal.style.left = '15px';
          modal.style.width = 'calc(42vw - 25px)';
          modal.style.maxWidth = 'calc(43vw - 20px)';
        } else if (!isRefOpen) {
          document.body.classList.remove('refboard-split');
          modal.style.maxWidth = '95vw';
          if (!modal.dataset.userResized) {
            modal.style.width = 'calc(45vw - 30px)';
          }
        }

        if (toolsPage) {
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
        }
      } else if (toolsPage) {
        toolsPage.style.paddingTop = '';
        scrollBackUpFast();
      }
    }, 40);
  };

  window.minimizeColorPalette = function () {
    const modal = document.getElementById('color-palette-modal');
    if (!modal) return;
    const isMin = modal.classList.toggle('minimized');
    const minBtn = document.getElementById('cp-btn-minimize');
    if (minBtn) {
      minBtn.title = isMin ? 'ขยายหน้าต่างกลับ' : 'ย่อหน้าต่าง';
    }
  };

  function setupModalDragging() {
    const modal = document.getElementById('color-palette-modal');
    const header = document.getElementById('cp-modal-header');
    if (!modal || !header) return;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.cp-btn-icon') || e.target.closest('.cp-harmony-select') || e.target.closest('.cp-title-icon-btn')) return;
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
    modal.addEventListener('touchstart', () => bringToFront(modal), { passive: true });
  }

  // Handle mobile / browser back button to close Color Palette modal if open
  window.addEventListener('popstate', () => {
    const modal = document.getElementById('color-palette-modal');
    if (modal && modal.classList.contains('open')) {
      window.toggleColorPalette(false);
    }
  });

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

  // ═══ KEYBOARD SHORTCUTS ═══

  document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('color-palette-modal');
    if (modal && modal.classList.contains('open')) {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
      if (!isInput) {
        const isOverModal = modal.contains(e.target) ||
                            modal.contains(document.activeElement) ||
                            modal.matches(':hover') ||
                            (document.querySelector('#color-palette-modal:hover') !== null);
        if (isOverModal) {
          if (e.code === 'Space') {
            e.preventDefault();
            e.stopPropagation();
            randomizePalette();
          } else if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyZ' || e.key.toLowerCase() === 'z')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          } else if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || e.key.toLowerCase() === 'y')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            redo();
          } else if (e.key === 'Escape') {
            closeAllDropdowns();
          }
        }
      }
    }
  });

  // ═══ CUSTOM HARMONY & TONE SELECTORS ═══

  function closeAllDropdowns(exceptMenuId) {
    const dropdowns = [
      { menuId: 'cp-harmony-menu', btnId: 'cp-harmony-btn', wrapId: 'cp-harmony-dropdown-wrap' },
      { menuId: 'cp-tone-menu', btnId: 'cp-tone-btn', wrapId: 'cp-tone-dropdown-wrap' },
      { menuId: 'cp-target-mode-menu', btnId: 'cp-target-mode-btn', wrapId: 'cp-target-mode-wrap' }
    ];

    dropdowns.forEach(d => {
      if (!exceptMenuId || d.menuId !== exceptMenuId) {
        const menu = document.getElementById(d.menuId);
        if (menu) menu.classList.remove('open');
        if (d.wrapId) {
          const wrap = document.getElementById(d.wrapId);
          if (wrap) wrap.classList.remove('open');
        }
        if (d.btnId) {
          const btn = document.getElementById(d.btnId);
          if (btn) btn.classList.remove('active');
        }
      }
    });
  }

  window.toggleHarmonyMenu = function (e) {
    e = e || window.event;
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('cp-harmony-menu');
    const wrap = document.getElementById('cp-harmony-dropdown-wrap');
    const btn = document.getElementById('cp-harmony-btn');
    const willOpen = menu ? !menu.classList.contains('open') : false;

    closeAllDropdowns('cp-harmony-menu');

    if (menu) menu.classList.toggle('open', willOpen);
    if (wrap) wrap.classList.toggle('open', willOpen);
    if (btn) btn.classList.toggle('active', willOpen);
  };

  window.selectHarmony = function (mode) {
    if (!HARMONY_DATA[mode]) return;
    pushHistory();
    activeHarmony = mode;

    const iconEl = document.getElementById('cp-harmony-current-icon');
    const labelEl = document.getElementById('cp-harmony-current-label');
    if (iconEl) iconEl.innerHTML = HARMONY_DATA[mode].icon;
    if (labelEl) labelEl.textContent = HARMONY_DATA[mode].name;

    document.querySelectorAll('.cp-harmony-item').forEach(item => {
      item.classList.toggle('active', item.dataset.harmony === mode);
    });

    closeAllDropdowns();
    applyHarmonyFromBase();
  };

  window.toggleToneMenu = function (e) {
    e = e || window.event;
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('cp-tone-menu');
    const wrap = document.getElementById('cp-tone-dropdown-wrap');
    const btn = document.getElementById('cp-tone-btn');
    const willOpen = menu ? !menu.classList.contains('open') : false;

    closeAllDropdowns('cp-tone-menu');

    if (menu) menu.classList.toggle('open', willOpen);
    if (wrap) wrap.classList.toggle('open', willOpen);
    if (btn) btn.classList.toggle('active', willOpen);
  };

  window.selectTone = function (tone) {
    if (!TONE_DATA[tone]) return;
    activeTone = tone;

    const iconEl = document.getElementById('cp-tone-current-icon');
    const labelEl = document.getElementById('cp-tone-current-label');
    if (iconEl) iconEl.innerHTML = TONE_DATA[tone].icon;
    if (labelEl) labelEl.textContent = TONE_DATA[tone].name;

    document.querySelectorAll('.cp-tone-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tone === tone);
    });

    closeAllDropdowns();
    showToast(`เลือกโทนสี "${TONE_DATA[tone].name} (${TONE_DATA[tone].thName})"`);
    randomizePalette();
  };

  document.addEventListener('click', function (e) {
    const dropdowns = [
      { menuId: 'cp-harmony-menu', btnId: 'cp-harmony-btn', wrapId: 'cp-harmony-dropdown-wrap' },
      { menuId: 'cp-tone-menu', btnId: 'cp-tone-btn', wrapId: 'cp-tone-dropdown-wrap' },
      { menuId: 'cp-target-mode-menu', btnId: 'cp-target-mode-btn', wrapId: 'cp-target-mode-wrap' }
    ];

    dropdowns.forEach(d => {
      const menu = document.getElementById(d.menuId);
      const btn = document.getElementById(d.btnId);
      if (menu && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
          menu.classList.remove('open');
          if (d.wrapId) {
            const wrap = document.getElementById(d.wrapId);
            if (wrap) wrap.classList.remove('open');
          }
          if (btn) btn.classList.remove('active');
        }
      }
    });
  });

  window.toggleTargetModeMenu = function (e) {
    e = e || window.event;
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('cp-target-mode-menu');
    const wrap = document.getElementById('cp-target-mode-wrap');
    const btn = document.getElementById('cp-target-mode-btn');
    const willOpen = menu ? !menu.classList.contains('open') : false;

    closeAllDropdowns('cp-target-mode-menu');

    if (menu) menu.classList.toggle('open', willOpen);
    if (wrap) wrap.classList.toggle('open', willOpen);
    if (btn) btn.classList.toggle('active', willOpen);
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

    closeAllDropdowns();
    showToast(`เปลี่ยนเป็นโหมด "${mode === 'painting' ? 'สีสำหรับภาพวาด' : 'สีสำหรับกราฟิก'}"`);
    randomizePalette();
  };

  // ═══ INITIALIZATION ═══

  document.addEventListener('DOMContentLoaded', function () {
    // Init palette data
    initPalette();

    // Check saved theme preview state
    try {
      if (localStorage.getItem('cp_theme_preview_active') === 'true') {
        isThemePreviewActive = true;
        applyThemePreview(false);
      }
    } catch (e) {}

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

    // Setup Touch Gestures (Option A: Inspector Swipe | Option B: 2/3 Finger Tap)
    setupInspectorGestures();
    setupMultiFingerTapGestures(modalEl, undo, redo);

    // Auto update split layout when modal height changes
    if (modalEl && window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
      });
      ro.observe(modalEl);
    }
  });

  // ── Option A: Inspector Swipe Gesture (Swipe Left: Undo | Swipe Right: Redo) ──
  function setupInspectorGestures() {
    const insp = document.getElementById('cp-inspector');
    const card = document.getElementById('cp-inspector-card') || insp;
    const slotRedo = document.getElementById('cp-slot-redo');
    const slotUndo = document.getElementById('cp-slot-undo');
    const actionRedo = document.getElementById('cp-action-redo');
    const actionUndo = document.getElementById('cp-action-undo');

    if (!insp || !card) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isHorizontalGesture = false;
    let activePointerId = null;

    const threshold = 45;
    const maxOffset = 115;

    card.setAttribute('title', 'เลื่อนซ้าย: (Undo) | เลื่อนขวา: (Redo)');

    function handleStart(clientX, clientY, target, pointerId) {
      // Don't drag if interacting with interactive controls or slider tracks/thumbs
      if (target.closest('input, button, .cp-slider-track, .cp-slider-thumb, .cp-slider-row, a')) {
        return false;
      }
      isDragging = true;
      startX = clientX;
      startY = clientY;
      currentX = 0;
      isHorizontalGesture = false;
      activePointerId = pointerId;

      card.classList.add('is-dragging');
      card.style.transition = 'none';
      if (slotUndo) slotUndo.style.transition = 'none';
      if (slotRedo) slotRedo.style.transition = 'none';
      if (actionUndo) actionUndo.style.transition = 'none';
      if (actionRedo) actionRedo.style.transition = 'none';
      return true;
    }

    function handleMove(clientX, clientY) {
      if (!isDragging) return;
      const diffX = clientX - startX;
      const diffY = clientY - startY;

      if (!isHorizontalGesture) {
        if (Math.abs(diffX) > 6 && Math.abs(diffX) > Math.abs(diffY)) {
          isHorizontalGesture = true;
        } else if (Math.abs(diffY) > 8) {
          // Vertical movement dominates -> allow page/modal scroll
          handleEnd(false);
          return;
        }
      }

      if (isHorizontalGesture) {
        currentX = Math.max(-maxOffset, Math.min(maxOffset, diffX * 0.65));
        card.style.transform = `translateX(${currentX}px)`;

        const gapWidth = Math.abs(currentX);
        const isReady = gapWidth >= threshold;

        if (currentX < 0) {
          // Card moved Left -> Reveal Right Slot: (Undo)
          if (slotUndo) slotUndo.style.width = gapWidth + 'px';
          if (slotRedo) slotRedo.style.width = '0px';

          if (actionUndo) {
            actionUndo.style.opacity = Math.min(1, gapWidth / 28);
            actionUndo.style.transform = `scale(${Math.min(1, 0.8 + (gapWidth / threshold) * 0.2)})`;
            actionUndo.classList.toggle('ready', isReady);
          }
          if (actionRedo) {
            actionRedo.style.opacity = '0';
            actionRedo.classList.remove('ready');
          }
        } else if (currentX > 0) {
          // Card moved Right -> Reveal Left Slot: (Redo)
          if (slotRedo) slotRedo.style.width = gapWidth + 'px';
          if (slotUndo) slotUndo.style.width = '0px';

          if (actionRedo) {
            actionRedo.style.opacity = Math.min(1, gapWidth / 28);
            actionRedo.style.transform = `scale(${Math.min(1, 0.8 + (gapWidth / threshold) * 0.2)})`;
            actionRedo.classList.toggle('ready', isReady);
          }
          if (actionUndo) {
            actionUndo.style.opacity = '0';
            actionUndo.classList.remove('ready');
          }
        } else {
          if (slotUndo) slotUndo.style.width = '0px';
          if (slotRedo) slotRedo.style.width = '0px';
          if (actionUndo) { actionUndo.style.opacity = '0'; actionUndo.classList.remove('ready'); }
          if (actionRedo) { actionRedo.style.opacity = '0'; actionRedo.classList.remove('ready'); }
        }
      }
    }

    function handleEnd(commit = true) {
      if (!isDragging) return;
      isDragging = false;
      activePointerId = null;
      card.classList.remove('is-dragging');

      if (commit && isHorizontalGesture) {
        if (currentX <= -threshold) {
          undo();
        } else if (currentX >= threshold) {
          redo();
        }
      }

      // Smooth return transition: ~0.5s with zero spring overshoot
      const easeCurve = 'cubic-bezier(0.25, 1, 0.5, 1)';
      card.style.transition = `transform 0.5s ${easeCurve}`;
      card.style.transform = 'translateX(0px)';

      if (slotUndo) {
        slotUndo.style.transition = `width 0.5s ${easeCurve}`;
        slotUndo.style.width = '0px';
      }
      if (slotRedo) {
        slotRedo.style.transition = `width 0.5s ${easeCurve}`;
        slotRedo.style.width = '0px';
      }

      if (actionUndo) {
        actionUndo.classList.remove('ready');
        actionUndo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        actionUndo.style.opacity = '0';
        actionUndo.style.transform = 'scale(0.85)';
      }
      if (actionRedo) {
        actionRedo.classList.remove('ready');
        actionRedo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        actionRedo.style.opacity = '0';
        actionRedo.style.transform = 'scale(0.85)';
      }

      setTimeout(() => {
        card.style.transition = '';
        if (slotUndo) slotUndo.style.transition = '';
        if (slotRedo) slotRedo.style.transition = '';
        if (actionUndo) actionUndo.style.transition = '';
        if (actionRedo) actionRedo.style.transition = '';
      }, 520);
    }

    // Pointer events binding (supports mouse, touch, pen unified)
    card.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (handleStart(e.clientX, e.clientY, e.target, e.pointerId)) {
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    card.addEventListener('pointermove', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        handleMove(e.clientX, e.clientY);
        if (isHorizontalGesture && e.cancelable) {
          e.preventDefault();
        }
      }
    });

    card.addEventListener('pointerup', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}
        handleEnd(true);
      }
    });

    card.addEventListener('pointercancel', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}
        handleEnd(false);
      }
    });
  }

  // ── Option B: Multi-Finger Tap Gesture (2-finger tap: Undo | 3-finger tap: Redo) ──
  function setupMultiFingerTapGestures(containerEl, undoFn, redoFn) {
    if (!containerEl) return;

    let maxTouches = 0;
    let startTime = 0;
    let startPoints = [];
    let hasMoved = false;

    containerEl.addEventListener('touchstart', (e) => {
      const currentTouches = e.touches.length;
      if (currentTouches > maxTouches) maxTouches = currentTouches;

      if (currentTouches >= 2) {
        startTime = Date.now();
        hasMoved = false;
        startPoints = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
      }
    }, { passive: true });

    containerEl.addEventListener('touchmove', (e) => {
      if (hasMoved || startPoints.length < 2) return;
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const p = startPoints[i];
        if (p && Math.hypot(t.clientX - p.x, t.clientY - p.y) > 15) {
          hasMoved = true;
          break;
        }
      }
    }, { passive: true });

    containerEl.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        const duration = Date.now() - startTime;
        if (!hasMoved && duration >= 40 && duration <= 380) {
          if (maxTouches === 2) {
            undoFn();
          } else if (maxTouches === 3) {
            redoFn();
          }
        }
        maxTouches = 0;
        hasMoved = false;
        startPoints = [];
      }
    }, { passive: true });

    containerEl.addEventListener('touchcancel', () => {
      maxTouches = 0;
      hasMoved = false;
      startPoints = [];
    });
  }

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
