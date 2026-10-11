// Pixel-art tile backgrounds rendered as inline SVG data-URIs (16x16 grid @ 32px).
// Modern 8-bit look: crispEdges, shaded palettes, no emoji.

function px(x: number, y: number, w: number, h: number, c: string): string {
  return `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${c}'/>`;
}

function svgUrl(inner: string, w = 16, h = 16): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
}

/* ---------- shared base ---------- */

function grassBase(): string {
  return (
    px(0, 0, 16, 16, "#4f8f46") +
    px(2, 3, 1, 2, "#5fa854") + px(3, 4, 2, 1, "#5fa854") +
    px(10, 2, 2, 1, "#3f7a3a") + px(11, 3, 1, 1, "#3f7a3a") +
    px(5, 8, 2, 1, "#5fa854") + px(6, 7, 1, 2, "#5fa854") +
    px(12, 10, 1, 2, "#5fa854") +
    px(3, 12, 2, 1, "#3f7a3a") +
    px(8, 13, 1, 1, "#5fa854") + px(9, 14, 2, 1, "#3f7a3a") +
    px(14, 5, 1, 1, "#5fa854") +
    px(1, 9, 1, 1, "#3f7a3a") +
    px(13, 1, 1, 1, "#5fa854") +
    px(6, 12, 1, 1, "#3f7a3a")
  );
}

/* ---------- tiles ---------- */

function grassVariant(v: number): string {
  let s = grassBase();
  if (v === 1) {
    s += px(7, 2, 1, 3, "#6ec87c") + px(6, 2, 1, 1, "#6ec87c") + px(8, 1, 1, 1, "#6ec87c");
    s += px(4, 10, 1, 1, "#74c87c");
  } else if (v === 2) {
    s += px(11, 7, 1, 1, "#74c87c") + px(12, 7, 1, 1, "#5fa854") + px(11, 8, 1, 1, "#5fa854");
    s += px(2, 6, 1, 1, "#6ec87c");
    s += px(9, 11, 1, 1, "#d8d8c0");
  }
  return s;
}

function pathTile(): string {
  return (
    px(0, 0, 16, 16, "#d2b07a") +
    px(2, 2, 2, 1, "#c5a272") + px(9, 3, 1, 1, "#c5a272") +
    px(13, 7, 2, 1, "#c5a272") + px(7, 9, 2, 1, "#c5a272") +
    px(0, 8, 1, 2, "#c5a272") + px(15, 3, 1, 2, "#c5a272") +
    px(4, 12, 1, 1, "#c5a272") + px(10, 14, 2, 1, "#c5a272") +
    px(5, 6, 1, 1, "#e2c694") + px(11, 11, 2, 1, "#e2c694") +
    px(3, 13, 1, 1, "#e2c694") + px(12, 4, 1, 1, "#e2c694") +
    px(1, 10, 1, 1, "#b8966a") + px(8, 5, 1, 1, "#b8966a")
  );
}

function waterFrame(shift: number): string {
  const m = (n: number) => (n + 16) % 16;
  return (
    px(0, 0, 16, 16, "#2465b4") +
    px(0, 10, 16, 6, "#1a4f92") +
    px(0, 9, 16, 1, "#1f5aa0") +
    px(m(2 + shift), 4, 5, 1, "#3d86d6") +
    px(m(9 + shift), 8, 4, 1, "#3d86d6") +
    px(m(5 + shift), 12, 3, 1, "#2f7ac4") +
    px(m(3 + shift), 5, 1, 1, "#a8d8f8") +
    px(m(11 + shift), 9, 1, 1, "#a8d8f8") +
    px(m(7 + shift), 3, 1, 1, "#7ec0f0") +
    px(m(1 + shift), 13, 1, 1, "#7ec0f0")
  );
}

function treeTile(): string {
  let s = grassBase();
  s += px(3, 13, 10, 2, "#3f7a3a");
  s += px(7, 10, 3, 5, "#6b4a2a") + px(9, 10, 1, 5, "#543a20") + px(7, 14, 3, 1, "#4a3018");
  s += px(6, 2, 4, 1, "#1d5c33") + px(4, 3, 8, 1, "#1d5c33") +
    px(3, 4, 10, 5, "#1d5c33") + px(4, 9, 8, 1, "#1d5c33") + px(5, 10, 6, 1, "#1d5c33");
  s += px(6, 3, 4, 1, "#2e8a46") + px(4, 4, 8, 3, "#2e8a46") +
    px(5, 7, 6, 2, "#2e8a46") + px(6, 9, 4, 1, "#2e8a46");
  s += px(5, 4, 5, 2, "#46a85a") + px(6, 6, 5, 2, "#46a85a") + px(6, 8, 4, 1, "#46a85a");
  s += px(6, 4, 2, 1, "#74c87c") + px(5, 5, 1, 1, "#74c87c") + px(8, 6, 1, 1, "#74c87c");
  s += px(10, 5, 1, 1, "#1d5c33") + px(4, 7, 1, 1, "#1d5c33");
  return s;
}

function fenceTile(): string {
  let s = grassBase();
  s += px(0, 5, 16, 2, "#8b6239") + px(0, 5, 16, 1, "#a5794a") + px(0, 7, 16, 1, "#6b4a2a");
  s += px(0, 9, 16, 2, "#8b6239") + px(0, 9, 16, 1, "#a5794a") + px(0, 11, 16, 1, "#6b4a2a");
  for (const x of [2, 11]) {
    s += px(x, 3, 2, 10, "#8b6239") + px(x, 3, 2, 1, "#a5794a") +
      px(x + 1, 4, 1, 9, "#7a5430") + px(x - 1, 3, 1, 10, "#5c3a1e") + px(x + 2, 3, 1, 10, "#5c3a1e");
  }
  return s;
}

function wallTile(hasWindow: boolean): string {
  let s =
    px(0, 0, 16, 16, "#e6d2a8") +
    px(0, 0, 16, 2, "#7a4f2a") + px(0, 1, 16, 1, "#8b5a33") +
    px(0, 14, 16, 2, "#6b4222") +
    px(0, 2, 1, 12, "#7a4f2a") + px(15, 2, 1, 12, "#7a4f2a") +
    px(0, 6, 16, 1, "#d4bc8c") + px(0, 10, 16, 1, "#d4bc8c");
  if (hasWindow) {
    s += px(4, 3, 8, 8, "#5c3a1e") + px(5, 4, 6, 6, "#7ec8e8") +
      px(5, 4, 6, 1, "#a8e0f0") + px(7, 4, 1, 6, "#5c3a1e") + px(5, 6, 6, 1, "#5c3a1e") +
      px(4, 11, 8, 1, "#5c3a1e");
  } else {
    s += px(6, 3, 4, 8, "#dcc492") + px(7, 4, 1, 6, "#d0b47e") + px(9, 4, 1, 6, "#d0b47e");
  }
  return s;
}

function flowerTile(color: string): string {
  let s = grassBase();
  s += px(7, 10, 1, 3, "#3f7a3a") + px(6, 11, 1, 1, "#5fa854") + px(8, 12, 1, 1, "#5fa854");
  s += px(6, 7, 3, 1, color) + px(7, 6, 1, 3, color) + px(6, 9, 3, 1, color);
  s += px(6, 7, 1, 1, "#ffffff22");
  s += px(7, 8, 1, 1, "#ffd94a");
  return s;
}

function signTile(): string {
  let s = grassBase();
  s += px(3, 13, 10, 2, "#3f7a3a");
  s += px(7, 10, 2, 5, "#6b4a2a") + px(8, 10, 1, 5, "#4a3018");
  s += px(2, 2, 12, 9, "#5c3a1e") + px(3, 3, 10, 7, "#a5794a") + px(4, 4, 8, 5, "#f0e0b8");
  s += px(5, 5, 6, 1, "#b09060") + px(5, 7, 4, 1, "#b09060");
  return s;
}

function stoneTile(): string {
  let s = grassBase();
  s += px(3, 12, 10, 2, "#3f7a3a");
  s += px(5, 4, 6, 1, "#3a4550") + px(4, 5, 8, 7, "#3a4550") + px(5, 12, 6, 1, "#3a4550");
  s += px(5, 5, 6, 6, "#8a97a4") + px(4, 6, 1, 4, "#8a97a4") + px(11, 6, 1, 4, "#8a97a4");
  s += px(5, 5, 4, 2, "#c0c9d4") + px(5, 10, 6, 1, "#5c6874") + px(10, 6, 1, 3, "#6e7a87");
  return s;
}

function bridgeTile(): string {
  let s = px(0, 0, 16, 16, "#1a4f92") + px(0, 0, 16, 1, "#2465b4");
  for (const y of [1, 4, 7, 10, 13]) {
    s += px(0, y, 16, 2, "#9c6b3f") + px(0, y, 16, 1, "#b8874f") + px(0, y + 1, 16, 1, "#6b4a2a");
  }
  s += px(1, 0, 1, 16, "#5c3a1e") + px(14, 0, 1, 16, "#5c3a1e");
  s += px(1, 0, 1, 1, "#8b6239") + px(14, 0, 1, 1, "#8b6239");
  return s;
}

function roofTile(): string {
  let s = px(0, 0, 16, 16, "#a54a4a") + px(0, 0, 16, 2, "#c86a5a") + px(0, 2, 16, 1, "#8c3b38");
  for (const y of [5, 9, 13]) s += px(0, y, 16, 1, "#8c3b38");
  s += px(3, 3, 1, 2, "#8c3b38") + px(11, 3, 1, 2, "#8c3b38");
  s += px(7, 6, 1, 3, "#8c3b38") + px(15, 6, 1, 3, "#8c3b38");
  s += px(2, 10, 1, 3, "#8c3b38") + px(10, 10, 1, 3, "#8c3b38");
  s += px(6, 14, 1, 2, "#8c3b38");
  s += px(1, 3, 2, 1, "#d47a6a") + px(8, 6, 3, 1, "#d47a6a") + px(4, 10, 3, 1, "#d47a6a");
  return s;
}

function eavesTile(): string {
  return (
    px(0, 0, 16, 16, "#e6d2a8") +
    px(0, 0, 16, 2, "#8c3b38") +
    px(0, 2, 16, 2, "#7a4f2a") + px(0, 2, 16, 1, "#8b5a33") +
    px(0, 4, 16, 1, "#3a2510") +
    px(0, 6, 16, 1, "#d4bc8c") + px(0, 10, 16, 1, "#d4bc8c") +
    px(0, 2, 1, 2, "#5c3a1e") + px(15, 2, 1, 2, "#5c3a1e")
  );
}

function doorTile(): string {
  let s = px(0, 0, 16, 16, "#e6d2a8");
  s += px(0, 0, 16, 1, "#7a4f2a") + px(0, 15, 16, 1, "#6b4222");
  s += px(0, 1, 1, 14, "#7a4f2a") + px(15, 1, 1, 14, "#7a4f2a");
  s += px(4, 2, 8, 13, "#5c3a1e");
  s += px(5, 3, 6, 12, "#8b5a2b");
  s += px(6, 3, 1, 12, "#7a4f2a") + px(9, 3, 1, 12, "#7a4f2a");
  s += px(5, 3, 6, 1, "#a5794a");
  s += px(10, 9, 1, 2, "#d4a847");
  s += px(5, 14, 6, 1, "#8a97a4");
  return s;
}

function fountainFrame(shift: number): string {
  const m = (n: number) => (n + 16) % 16;
  return (
    px(0, 0, 16, 16, "#4aa8d8") +
    px(0, 11, 16, 5, "#2f86c4") +
    px(m(3 + shift), 4, 5, 1, "#7ec8f0") +
    px(m(8 + shift), 8, 4, 1, "#7ec8f0") +
    px(m(5 + shift), 13, 3, 1, "#3d96d0") +
    px(m(4 + shift), 5, 1, 1, "#d0f0ff") +
    px(m(10 + shift), 9, 1, 1, "#d0f0ff") +
    px(7, 6, 2, 4, "#a8e0f8")
  );
}

function fountainRimTile(): string {
  let s = px(0, 0, 16, 16, "#9aa5b1");
  s += px(0, 0, 16, 2, "#c0c9d4") + px(0, 14, 16, 2, "#5c6874");
  s += px(0, 2, 2, 12, "#8a97a4") + px(14, 2, 2, 12, "#6e7a87");
  s += px(4, 2, 1, 12, "#7a8794") + px(11, 2, 1, 12, "#7a8794");
  s += px(2, 5, 12, 1, "#7a8794") + px(2, 10, 12, 1, "#7a8794");
  s += px(6, 3, 2, 2, "#b0bac4") + px(8, 8, 2, 2, "#b0bac4");
  return s;
}

function lampTile(): string {
  let s = grassBase();
  s += px(5, 14, 6, 2, "#5c6874") + px(6, 14, 4, 1, "#8a97a4");
  s += px(7, 6, 2, 9, "#3a4550") + px(8, 6, 1, 9, "#2a3440");
  s += px(6, 2, 4, 4, "#3a4550") + px(7, 3, 2, 2, "#ffd94a");
  s += px(5, 3, 1, 2, "#ffd94a") + px(10, 3, 1, 2, "#ffd94a");
  s += px(6, 1, 4, 1, "#2a3440") + px(5, 6, 6, 1, "#2a3440");
  return s;
}

function benchTile(): string {
  let s = grassBase();
  s += px(3, 11, 2, 3, "#5c3a1e") + px(11, 11, 2, 3, "#5c3a1e");
  s += px(2, 8, 12, 2, "#a5794a") + px(2, 8, 12, 1, "#c08a4a") + px(2, 10, 12, 1, "#7a5430");
  s += px(2, 4, 12, 2, "#a5794a") + px(2, 4, 12, 1, "#c08a4a");
  s += px(3, 6, 1, 2, "#7a5430") + px(12, 6, 1, 2, "#7a5430");
  return s;
}

/* ---------- prebuilt assets ---------- */

const GRASS = [0, 1, 2].map((v) => svgUrl(grassVariant(v)));
const PATH = svgUrl(pathTile());
const WATER = svgUrl(
  `<g>${waterFrame(0)}</g><g transform='translate(16,0)'>${waterFrame(5)}</g>`,
  32,
  16
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
  `<g>${fountainFrame(0)}</g><g transform='translate(16,0)'>${fountainFrame(4)}</g>`,
  32,
  16
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
