// Pixel-art tile backgrounds rendered as inline SVG data-URIs (32x32 grid @ 32px).
// 16-bit look: crispEdges, multi-step palettes, dithering, outlines.

function px(x: number, y: number, w: number, h: number, c: string): string {
  return `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${c}'/>`;
}

function svgUrl(inner: string, w = 32, h = 32): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
}

/** Checkerboard dither fill — the signature 16-bit texture trick. */
function dither(x: number, y: number, w: number, h: number, c: string, cell = 2): string {
  let s = "";
  for (let j = y; j < y + h; j += cell) {
    for (let i = x + ((j / cell) % 2 === 0 ? 0 : cell); i < x + w; i += cell * 2) {
      const cw = Math.min(cell, x + w - i);
      const ch = Math.min(cell, y + h - j);
      s += px(i, j, cw, ch, c);
    }
  }
  return s;
}

/* ---------- shared base ---------- */

function grassBase(): string {
  let s = px(0, 0, 32, 32, "#4a8f42");
  s += dither(0, 0, 32, 32, "#44843c");
  // scattered grass tufts (2px blades with highlight + shadow)
  const tufts: [number, number][] = [
    [3, 4], [12, 2], [22, 6], [8, 14], [26, 12],
    [16, 20], [5, 24], [24, 26], [10, 28], [28, 20],
    [2, 18], [20, 10], [14, 8], [30, 28], [6, 10],
  ];
  for (const [x, y] of tufts) {
    s += px(x, y, 2, 3, "#559c4b");
    s += px(x, y, 1, 2, "#6cbf5e");
    s += px(x + 1, y + 2, 1, 1, "#3d7a36");
  }
  // light specks
  s += px(7, 9, 1, 1, "#7ed47a") + px(19, 15, 1, 1, "#7ed47a") +
    px(29, 4, 1, 1, "#7ed47a") + px(13, 25, 1, 1, "#7ed47a") +
    px(25, 17, 1, 1, "#7ed47a");
  return s;
}

/* ---------- tiles ---------- */

function grassVariant(v: number): string {
  let s = grassBase();
  if (v === 1) {
    // small white + yellow wildflowers
    s += px(14, 6, 2, 2, "#f0f0e8") + px(15, 7, 1, 1, "#ffd94a") + px(15, 9, 1, 2, "#3d7a36");
    s += px(22, 18, 2, 2, "#ffd94a") + px(23, 19, 1, 1, "#e8a830") + px(23, 21, 1, 2, "#3d7a36");
    s += px(6, 22, 2, 2, "#f0f0e8") + px(7, 23, 1, 1, "#ffd94a") + px(7, 25, 1, 2, "#3d7a36");
  } else if (v === 2) {
    // clover patch + pebble
    s += px(18, 8, 2, 2, "#6cbf5e") + px(20, 8, 2, 2, "#559c4b") + px(18, 10, 2, 2, "#559c4b") + px(20, 10, 2, 2, "#6cbf5e");
    s += px(19, 12, 1, 2, "#3d7a36");
    s += px(8, 20, 3, 2, "#b8b0a0") + px(8, 20, 2, 1, "#d0c8b8") + px(9, 21, 2, 1, "#98907e");
    s += px(26, 24, 2, 2, "#6cbf5e") + px(27, 26, 1, 2, "#3d7a36");
  }
  return s;
}

function pathTile(): string {
  let s = px(0, 0, 32, 32, "#cfa86e");
  s += dither(0, 0, 32, 32, "#c59e64");
  // light patches
  s += dither(2, 4, 10, 8, "#dbb87e", 4);
  s += dither(18, 16, 12, 10, "#dbb87e", 4);
  // pebbles
  const pebbles: [number, number][] = [
    [4, 4], [18, 6], [26, 14], [14, 18], [6, 24], [22, 26], [28, 4], [10, 12], [2, 16], [16, 28],
  ];
  for (const [x, y] of pebbles) {
    s += px(x, y, 2, 1, "#a8854e");
    s += px(x + 1, y + 1, 2, 1, "#b89660");
    s += px(x + 1, y, 1, 1, "#e8d0a0");
  }
  // sparkle sand
  s += px(9, 7, 1, 1, "#eed8a8") + px(24, 20, 1, 1, "#eed8a8") + px(12, 26, 1, 1, "#eed8a8");
  return s;
}

function waterFrame(shift: number): string {
  const m = (n: number) => ((n % 32) + 32) % 32;
  let s = px(0, 0, 32, 32, "#1e5aa8");
  s += dither(0, 0, 32, 32, "#1c56a0");
  // deep band bottom
  s += px(0, 22, 32, 10, "#17498c");
  s += dither(0, 22, 32, 10, "#154584");
  // mid band
  s += px(0, 16, 32, 6, "#2260b0");
  // wave lines (2px thick)
  s += px(m(2 + shift), 6, 10, 2, "#2a6cbe");
  s += px(m(18 + shift), 12, 8, 2, "#2a6cbe");
  s += px(m(8 + shift), 22, 12, 2, "#2260b0");
  s += px(m(22 + shift), 26, 6, 2, "#1c5298");
  // crest highlights
  s += px(m(4 + shift), 5, 4, 1, "#4a8ed8");
  s += px(m(20 + shift), 11, 3, 1, "#4a8ed8");
  s += px(m(10 + shift), 21, 5, 1, "#2f7ac4");
  // sparkles
  s += px(m(6 + shift), 7, 2, 1, "#a8d8f8");
  s += px(m(23 + shift), 13, 1, 2, "#a8d8f8");
  s += px(m(13 + shift), 3, 1, 1, "#d0ecff");
  s += px(m(28 + shift), 24, 1, 1, "#d0ecff");
  s += px(m(2 + shift), 27, 1, 1, "#a8d8f8");
  return s;
}

function treeTile(): string {
  let s = grassBase();
  // ground shadow ring
  s += px(5, 26, 22, 3, "#3d7a36");
  s += px(7, 25, 18, 1, "#3d7a36");
  // trunk
  s += px(13, 20, 6, 9, "#6b4a2a");
  s += px(16, 20, 3, 9, "#543a20");
  s += px(13, 20, 2, 9, "#7d5836");
  s += px(14, 23, 1, 1, "#4a3018");
  s += px(17, 25, 1, 1, "#4a3018");
  s += px(12, 27, 8, 2, "#4a3018");
  // canopy — outline
  s += px(9, 2, 14, 2, "#163f26") + px(6, 4, 20, 2, "#163f26") +
    px(4, 6, 24, 14, "#163f26") + px(6, 20, 20, 2, "#163f26") + px(9, 22, 14, 2, "#163f26");
  // dark fill
  s += px(10, 4, 12, 2, "#1d5c33") + px(7, 6, 18, 14, "#1d5c33") + px(10, 20, 12, 2, "#1d5c33");
  // mid
  s += px(10, 6, 12, 2, "#2e8a46") + px(8, 8, 16, 8, "#2e8a46") + px(10, 16, 12, 4, "#2e8a46");
  // light
  s += px(10, 8, 10, 2, "#46a85a") + px(9, 10, 12, 4, "#46a85a") + px(11, 14, 8, 2, "#46a85a");
  // highlights
  s += px(11, 9, 4, 2, "#74c87c") + px(10, 11, 2, 2, "#74c87c") +
    px(16, 12, 2, 1, "#74c87c") + px(13, 7, 2, 1, "#74c87c");
  // leaf dither on edges
  s += dither(7, 6, 3, 12, "#2e8a46", 2) + dither(23, 6, 2, 12, "#1d5c33", 2);
  return s;
}

function fenceTile(): string {
  let s = grassBase();
  // horizontal rails
  for (const y of [10, 18]) {
    s += px(0, y, 32, 4, "#8b6239");
    s += px(0, y, 32, 1, "#a5794a");
    s += px(0, y + 1, 32, 1, "#99703f");
    s += px(0, y + 3, 32, 1, "#6b4a2a");
    // wood grain
    s += px(5, y + 1, 3, 1, "#7a5430") + px(18, y + 2, 4, 1, "#7a5430") + px(27, y + 1, 2, 1, "#7a5430");
  }
  // posts
  for (const x of [4, 22]) {
    s += px(x, 6, 4, 20, "#8b6239");
    s += px(x, 6, 4, 1, "#b8874f");
    s += px(x + 1, 7, 2, 19, "#99703f");
    s += px(x + 3, 7, 1, 19, "#6b4a2a");
    s += px(x - 1, 6, 1, 20, "#5c3a1e");
    s += px(x + 4, 6, 1, 20, "#5c3a1e");
    s += px(x + 1, 12, 1, 1, "#5c3a1e");
    s += px(x + 2, 20, 1, 1, "#5c3a1e");
  }
  return s;
}

function wallTile(hasWindow: boolean): string {
  let s = px(0, 0, 32, 32, "#e8d4ac");
  s += dither(0, 0, 32, 32, "#e0caa0", 4);
  // timber frame
  s += px(0, 0, 32, 3, "#7a4f2a") + px(0, 1, 32, 1, "#8b5a33");
  s += px(0, 28, 32, 4, "#6b4222");
  s += px(0, 3, 2, 25, "#7a4f2a") + px(30, 3, 2, 25, "#7a4f2a");
  // horizontal beams
  s += px(0, 12, 32, 2, "#8b5a33") + px(0, 13, 32, 1, "#6b4222");
  s += px(0, 22, 32, 2, "#8b5a33") + px(0, 23, 32, 1, "#6b4222");
  // brick dither texture
  s += dither(2, 4, 28, 8, "#dcc49a", 4);
  s += dither(2, 14, 28, 8, "#dcc49a", 4);
  s += dither(2, 24, 28, 4, "#dcc49a", 4);
  if (hasWindow) {
    // window frame
    s += px(8, 5, 16, 16, "#5c3a1e");
    s += px(9, 6, 14, 14, "#3a2510");
    // glass
    s += px(10, 7, 12, 12, "#5aa8d0");
    s += px(10, 7, 12, 4, "#7ec8e8");
    s += px(10, 7, 4, 4, "#a8e0f0");
    s += px(12, 9, 3, 3, "#c8ecf8");
    // mullions
    s += px(15, 6, 2, 14, "#5c3a1e");
    s += px(10, 12, 12, 2, "#5c3a1e");
    // sill
    s += px(7, 20, 18, 3, "#8b5a33") + px(7, 20, 18, 1, "#a5794a");
    // flower box
    s += px(9, 18, 14, 3, "#6b4a2a") + px(9, 18, 14, 1, "#8b6239");
    s += px(11, 16, 2, 2, "#ff7eb6") + px(15, 15, 2, 3, "#ffd94a") + px(19, 16, 2, 2, "#c084fc");
    s += px(12, 18, 1, 1, "#559c4b") + px(16, 18, 1, 1, "#559c4b") + px(20, 18, 1, 1, "#559c4b");
  } else {
    // wooden shutter / plank detail
    s += px(12, 5, 8, 18, "#c8b088");
    s += px(13, 6, 2, 16, "#b8a078") + px(17, 6, 2, 16, "#b8a078");
    s += px(12, 5, 8, 1, "#d8c49c");
    s += px(12, 12, 8, 1, "#a89068") + px(12, 18, 8, 1, "#a89068");
  }
  return s;
}

function flowerTile(color: string): string {
  let s = grassBase();
  // stem + leaves
  s += px(15, 18, 2, 8, "#3d7a36");
  s += px(14, 20, 1, 2, "#559c4b") + px(17, 23, 1, 2, "#559c4b");
  s += px(13, 25, 6, 2, "#3d7a36");
  // petals (plus shape + corners for roundness)
  s += px(14, 8, 4, 2, color) + px(12, 10, 8, 4, color) + px(14, 14, 4, 2, color);
  s += px(13, 9, 1, 1, color) + px(18, 9, 1, 1, color) + px(13, 14, 1, 1, color) + px(18, 14, 1, 1, color);
  // petal shade + highlight
  s += px(12, 13, 8, 1, "rgba(0,0,0,0.15)");
  s += px(14, 9, 2, 1, "rgba(255,255,255,0.35)");
  // center
  s += px(14, 11, 4, 3, "#ffd94a");
  s += px(15, 12, 2, 1, "#e8a830");
  s += px(15, 11, 1, 1, "#fff3b0");
  return s;
}

function signTile(): string {
  let s = grassBase();
  s += px(12, 22, 8, 8, "#6b4a2a");
  s += px(14, 22, 3, 8, "#543a20");
  s += px(13, 24, 1, 1, "#4a3018") + px(16, 27, 1, 1, "#4a3018");
  s += px(10, 29, 12, 2, "#3d7a36");
  // board
  s += px(4, 4, 24, 18, "#5c3a1e");
  s += px(5, 5, 22, 16, "#a5794a");
  s += px(5, 5, 22, 1, "#c08a4a");
  s += px(6, 6, 20, 14, "#f0e0b8");
  s += px(6, 6, 20, 1, "#f8ecd0");
  // text lines
  s += px(8, 9, 14, 2, "#b09060");
  s += px(8, 13, 12, 2, "#b09060");
  s += px(8, 17, 9, 2, "#b09060");
  // gold seal
  s += px(20, 17, 4, 3, "#d4a847") + px(21, 18, 2, 1, "#e8c86a");
  return s;
}

function stoneTile(): string {
  let s = grassBase();
  s += px(3, 24, 26, 3, "#3d7a36");
  // flagstones with mortar
  const stones: [number, number, number, number][] = [
    [4, 6, 10, 8], [16, 6, 12, 8],
    [4, 16, 12, 10], [18, 16, 10, 10],
  ];
  for (const [x, y, w, h] of stones) {
    s += px(x, y, w, h, "#8a97a4");
    s += px(x, y, w, 2, "#a8b4c0");
    s += px(x, y, 2, h, "#98a4b0");
    s += px(x + w - 2, y + 2, 2, h - 2, "#6e7a87");
    s += px(x + 2, y + h - 2, w - 4, 2, "#5c6874");
    s += px(x + 2, y + 2, 2, 1, "#c8d2dc");
    // speckle
    s += px(x + 4, y + 4, 1, 1, "#7a8794") + px(x + 6, y + 5, 1, 1, "#98a4b0");
  }
  // mortar lines between
  s += px(14, 6, 2, 8, "#5c6874") + px(4, 14, 24, 2, "#5c6874") + px(16, 16, 2, 10, "#5c6874");
  return s;
}

function bridgeTile(): string {
  // water beneath
  let s = px(0, 0, 32, 32, "#17498c");
  s += dither(0, 0, 32, 32, "#154584");
  s += px(0, 2, 32, 1, "#1e5aa8") + px(0, 28, 32, 1, "#1e5aa8");
  // planks
  for (let y = 2; y < 32; y += 6) {
    s += px(0, y, 32, 5, "#9c6b3f");
    s += px(0, y, 32, 1, "#c08a4f");
    s += px(0, y + 1, 32, 1, "#b8874f");
    s += px(0, y + 4, 32, 1, "#6b4a2a");
    // grain + nails
    s += px(6, y + 2, 4, 1, "#8a5c34") + px(20, y + 3, 5, 1, "#8a5c34");
    s += px(2, y + 1, 1, 1, "#4a3018") + px(29, y + 1, 1, 1, "#4a3018");
  }
  // side rails
  s += px(1, 0, 2, 32, "#5c3a1e") + px(29, 0, 2, 32, "#5c3a1e");
  s += px(1, 0, 1, 32, "#8b6239") + px(29, 0, 1, 32, "#7a5430");
  return s;
}

function roofTile(): string {
  let s = px(0, 0, 32, 32, "#a54a4a");
  // shingle rows
  for (let y = 0; y < 32; y += 4) {
    const off = (y / 4) % 2 === 0 ? 0 : 4;
    s += px(0, y, 32, 1, "#8c3b38");
    s += px(0, y + 1, 32, 2, "#a54a4a");
    s += px(0, y + 3, 32, 1, "#7a3230");
    // staggered tab lines
    for (let x = off; x < 32; x += 8) {
      s += px(x, y + 1, 1, 3, "#8c3b38");
    }
    // top highlight on some shingles
    if ((y / 4) % 2 === 0) {
      s += px(2, y + 1, 4, 1, "#c86a5a") + px(18, y + 1, 4, 1, "#c86a5a");
    }
  }
  // ridge highlight
  s += px(0, 0, 32, 1, "#d47a6a");
  return s;
}

function eavesTile(): string {
  let s = px(0, 0, 32, 32, "#e8d4ac");
  s += dither(0, 0, 32, 32, "#e0caa0", 4);
  // roof remnant
  s += px(0, 0, 32, 3, "#8c3b38");
  s += px(0, 1, 32, 1, "#a54a4a");
  // beam
  s += px(0, 3, 32, 3, "#7a4f2a") + px(0, 3, 32, 1, "#8b5a33");
  // shadow under eaves
  s += px(0, 6, 32, 3, "#3a2510");
  s += dither(0, 6, 32, 3, "#2e1c0c", 2);
  // wall below
  s += px(0, 9, 32, 2, "#d8c49c");
  s += px(0, 12, 32, 2, "#8b5a33") + px(0, 13, 32, 1, "#6b4222");
  s += px(0, 14, 32, 14, "#e8d4ac");
  s += dither(0, 14, 32, 14, "#dcc49a", 4);
  s += px(0, 28, 32, 4, "#6b4222");
  // corner posts
  s += px(0, 9, 2, 22, "#7a4f2a") + px(30, 9, 2, 22, "#7a4f2a");
  return s;
}

function doorTile(): string {
  let s = px(0, 0, 32, 32, "#e8d4ac");
  s += dither(0, 0, 32, 32, "#e0caa0", 4);
  s += px(0, 0, 32, 2, "#7a4f2a");
  s += px(0, 30, 32, 2, "#6b4222");
  s += px(0, 2, 2, 28, "#7a4f2a") + px(30, 2, 2, 28, "#7a4f2a");
  // door frame
  s += px(7, 3, 18, 28, "#5c3a1e");
  s += px(8, 4, 16, 27, "#3a2510");
  // door planks
  s += px(9, 4, 14, 27, "#8b5a2b");
  s += px(9, 4, 14, 1, "#a5794a");
  s += px(12, 4, 1, 27, "#7a4f2a") + px(15, 4, 1, 27, "#6b4222") + px(18, 4, 1, 27, "#7a4f2a");
  // iron hinges
  s += px(9, 7, 5, 2, "#2a3440") + px(19, 7, 4, 2, "#2a3440");
  s += px(9, 22, 5, 2, "#2a3440") + px(19, 22, 4, 2, "#2a3440");
  // handle
  s += px(19, 14, 2, 3, "#d4a847") + px(20, 15, 1, 1, "#e8c86a");
  // step
  s += px(7, 29, 18, 3, "#8a97a4") + px(7, 29, 18, 1, "#a8b4c0");
  return s;
}

function fountainFrame(shift: number): string {
  const m = (n: number) => ((n % 32) + 32) % 32;
  let s = px(0, 0, 32, 32, "#3d96d0");
  s += dither(0, 0, 32, 32, "#3890c8");
  // deep bottom
  s += px(0, 24, 32, 8, "#2f86c4");
  s += dither(0, 24, 32, 8, "#2a7ebc", 2);
  // ripples
  s += px(m(4 + shift), 6, 10, 2, "#5ab0e0");
  s += px(m(18 + shift), 12, 8, 2, "#5ab0e0");
  s += px(m(8 + shift), 20, 12, 2, "#4aa8d8");
  s += px(m(6 + shift), 7, 4, 1, "#7ec8f0");
  s += px(m(20 + shift), 13, 3, 1, "#7ec8f0");
  // sparkles
  s += px(m(8 + shift), 8, 2, 1, "#d0f0ff");
  s += px(m(22 + shift), 14, 1, 2, "#d0f0ff");
  s += px(m(12 + shift), 22, 1, 1, "#e8f8ff");
  // central spout column
  s += px(14, 8, 4, 14, "#a8e0f8");
  s += px(15, 8, 2, 14, "#d0f0ff");
  s += px(13, 8, 1, 14, "#7ec8f0");
  s += px(12, 6, 8, 3, "#c0c9d4") + px(13, 5, 6, 1, "#dce4ec");
  // spray
  s += px(11, 4, 2, 1, "#d0f0ff") + px(19, 4, 2, 1, "#d0f0ff") +
    px(9, 5, 1, 1, "#a8e0f8") + px(22, 5, 1, 1, "#a8e0f8");
  return s;
}

function fountainRimTile(): string {
  let s = px(0, 0, 32, 32, "#9aa5b1");
  // top highlight
  s += px(0, 0, 32, 3, "#c8d2dc");
  s += px(0, 3, 32, 1, "#b0bac4");
  // base shadow
  s += px(0, 27, 32, 5, "#5c6874");
  s += px(0, 26, 32, 1, "#6e7a87");
  // block joints
  s += px(8, 3, 2, 23, "#7a8794") + px(22, 3, 2, 23, "#7a8794");
  s += px(0, 14, 32, 1, "#7a8794") + px(0, 15, 32, 1, "#8a97a4");
  // carved detail
  s += px(3, 6, 3, 3, "#b0bac4") + px(26, 6, 3, 3, "#b0bac4");
  s += px(14, 18, 4, 4, "#b0bac4") + px(15, 19, 2, 2, "#c8d2dc");
  // speckle
  s += px(5, 20, 1, 1, "#6e7a87") + px(28, 10, 1, 1, "#6e7a87") + px(16, 8, 1, 1, "#b0bac4");
  return s;
}

function lampTile(): string {
  let s = grassBase();
  // base
  s += px(10, 26, 12, 4, "#3a4550");
  s += px(11, 26, 10, 1, "#5c6874");
  s += px(12, 27, 8, 1, "#4a5560");
  s += px(9, 29, 14, 2, "#2a3440");
  // post
  s += px(14, 12, 4, 14, "#3a4550");
  s += px(15, 12, 2, 14, "#4a5560");
  s += px(14, 12, 1, 14, "#5c6874");
  s += px(18, 12, 1, 14, "#2a3440");
  // collar
  s += px(13, 11, 6, 2, "#2a3440") + px(13, 11, 6, 1, "#4a5560");
  // lantern housing
  s += px(11, 3, 10, 8, "#2a3440");
  s += px(12, 4, 8, 6, "#ffd94a");
  s += px(13, 5, 6, 4, "#ffe88a");
  s += px(14, 6, 3, 2, "#fff3b0");
  s += px(12, 4, 8, 1, "#e8b830");
  // frame lines on glass
  s += px(15, 4, 1, 6, "#2a3440") + px(12, 6, 8, 1, "#2a3440");
  // cap + finial
  s += px(10, 2, 12, 2, "#2a3440") + px(10, 2, 12, 1, "#4a5560");
  s += px(15, 0, 2, 2, "#2a3440");
  // warm glow hint on grass
  s += px(8, 28, 2, 1, "#6a7a3a") + px(22, 28, 2, 1, "#6a7a3a");
  return s;
}

function benchTile(): string {
  let s = grassBase();
  // legs
  s += px(6, 22, 3, 7, "#3a2510");
  s += px(23, 22, 3, 7, "#3a2510");
  s += px(6, 22, 1, 7, "#5c3a1e") + px(23, 22, 1, 7, "#5c3a1e");
  // seat slats
  for (let i = 0; i < 3; i++) {
    const y = 16 + i * 3;
    s += px(4, y, 24, 3, "#a5794a");
    s += px(4, y, 24, 1, "#c08a4a");
    s += px(4, y + 2, 24, 1, "#7a5430");
  }
  // backrest
  s += px(5, 6, 22, 3, "#a5794a");
  s += px(5, 6, 22, 1, "#c08a4a");
  s += px(5, 8, 22, 1, "#7a5430");
  s += px(5, 11, 22, 3, "#a5794a");
  s += px(5, 11, 22, 1, "#c08a4a");
  s += px(5, 13, 22, 1, "#7a5430");
  // supports
  s += px(6, 9, 2, 8, "#8b6239") + px(24, 9, 2, 8, "#8b6239");
  // grass under
  s += px(4, 29, 24, 2, "#3d7a36");
  return s;
}

/* ---------- prebuilt assets ---------- */

const GRASS = [0, 1, 2].map((v) => svgUrl(grassVariant(v)));
const PATH = svgUrl(pathTile());
const WATER = svgUrl(
  `<g>${waterFrame(0)}</g><g transform='translate(32,0)'>${waterFrame(7)}</g>`,
  64,
  32
);
const TREE = [svgUrl(treeTile())];
const FENCE = svgUrl(fenceTile());
const WALL = [svgUrl(wallTile(false)), svgUrl(wallTile(true))];
const FLOWER = ["#ff7eb6", "#ffd94a", "#c084fc"].map((c) => svgUrl(flowerTile(c)));
const SIGN = svgUrl(signTile());
const STONE = svgUrl(stoneTile());
const BRIDGE = svgUrl(bridgeTile());
const ROOF = svgUrl(roofTile());
const EAVES = svgUrl(eavesTile());
const DOOR = svgUrl(doorTile());
const FOUNTAIN_WATER = svgUrl(
  `<g>${fountainFrame(0)}</g><g transform='translate(32,0)'>${fountainFrame(6)}</g>`,
  64,
  32
);
const RIM = svgUrl(fountainRimTile());
const LAMP = svgUrl(lampTile());
const BENCH = svgUrl(benchTile());

const NO_BG = { backgroundImage: "none", backgroundSize: "32px 32px" };

export function tileBackground(
  type: number,
  x: number,
  y: number
): { backgroundImage: string; backgroundSize: string } {
  const v = (x * 7 + y * 13) % 97;
  switch (type) {
    case 0: return { backgroundImage: GRASS[v % GRASS.length], backgroundSize: "32px 32px" };
    case 1: return { backgroundImage: PATH, backgroundSize: "32px 32px" };
    case 2: return { backgroundImage: WATER, backgroundSize: "64px 32px" };
    case 3: return { backgroundImage: TREE[v % TREE.length], backgroundSize: "32px 32px" };
    case 4: return { backgroundImage: FENCE, backgroundSize: "32px 32px" };
    case 5: return { backgroundImage: WALL[v % WALL.length], backgroundSize: "32px 32px" };
    case 6: return { backgroundImage: FLOWER[v % FLOWER.length], backgroundSize: "32px 32px" };
    case 7: return { backgroundImage: SIGN, backgroundSize: "32px 32px" };
    case 8: return { backgroundImage: STONE, backgroundSize: "32px 32px" };
    case 9: return { backgroundImage: BRIDGE, backgroundSize: "32px 32px" };
    case 10: return { backgroundImage: ROOF, backgroundSize: "32px 32px" };
    case 11: return { backgroundImage: EAVES, backgroundSize: "32px 32px" };
    case 12: return { backgroundImage: DOOR, backgroundSize: "32px 32px" };
    case 13: return { backgroundImage: FOUNTAIN_WATER, backgroundSize: "64px 32px" };
    case 14: return { backgroundImage: RIM, backgroundSize: "32px 32px" };
    case 15: return { backgroundImage: LAMP, backgroundSize: "32px 32px" };
    case 16: return { backgroundImage: BENCH, backgroundSize: "32px 32px" };
    default: return NO_BG;
  }
}
