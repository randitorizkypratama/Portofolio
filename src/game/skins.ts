export interface SkinColors {
  body: string;
  dark: string;
  highlight: string;
  scarf: string;
  scarfLight: string;
  scarfDark: string;
}

export interface Skin {
  id: string;
  name: string;
  desc: string;
  price: number;
  colors: SkinColors;
}

/** Default hoodie palette — keep in sync with PlayerSprite base colors. */
const KNIGHT: SkinColors = {
  body: "#3d3d72",
  dark: "#33335e",
  highlight: "#4a4a88",
  scarf: "#d4a847",
  scarfLight: "#e8c86a",
  scarfDark: "#b88e35",
};

export const SKINS: Skin[] = [
  { id: "knight", name: "Forest Knight", desc: "Starting gear", price: 0, colors: KNIGHT },
  {
    id: "crimson",
    name: "Crimson Guard",
    desc: "Red armor of the royal guard",
    price: 100,
    colors: { body: "#a8434a", dark: "#7d3239", highlight: "#c8636a", scarf: "#f0d080", scarfLight: "#f8e0a8", scarfDark: "#c8a858" },
  },
  {
    id: "royal",
    name: "Royal Mage",
    desc: " robes woven with starlight",
    price: 150,
    colors: { body: "#6c5ce7", dark: "#4f42b5", highlight: "#8f7ff5", scarf: "#e8e0c8", scarfLight: "#f4efe2", scarfDark: "#c0b698" },
  },
  {
    id: "shadow",
    name: "Shadow Rogue",
    desc: "Moves unseen, strikes silent",
    price: 200,
    colors: { body: "#2d3240", dark: "#1e222c", highlight: "#454e63", scarf: "#74b9ff", scarfLight: "#a8d4ff", scarfDark: "#4a8fd4" },
  },
  {
    id: "slime",
    name: "Slime Suit",
    desc: "Official slime-rider uniform",
    price: 300,
    colors: { body: "#3f9e50", dark: "#2d7a38", highlight: "#5ec26a", scarf: "#c8f0f5", scarfLight: "#e2f8fa", scarfDark: "#98ccd4" },
  },
];

const KEY = "pq_skin";
const OWNED_KEY = "pq_owned_skins";
const EVENT = "pq-skin-changed";

let cache: Skin | null = null;

export function getActiveSkin(): Skin {
  if (!cache) {
    const id = localStorage.getItem(KEY) || "knight";
    cache = SKINS.find((s) => s.id === id) ?? SKINS[0];
  }
  return cache;
}

export function getOwnedSkins(): string[] {
  try {
    return JSON.parse(localStorage.getItem(OWNED_KEY) || '["knight"]') as string[];
  } catch {
    return ["knight"];
  }
}

/** Buy (if needed) and equip a skin. Returns a result message. */
export function purchaseSkin(id: string, spend: (n: number) => boolean): { ok: boolean; msg: string } {
  const skin = SKINS.find((s) => s.id === id);
  if (!skin) return { ok: false, msg: "Unknown skin." };
  const owned = getOwnedSkins();
  if (owned.includes(id)) {
    cache = skin;
    localStorage.setItem(KEY, id);
    window.dispatchEvent(new CustomEvent(EVENT));
    return { ok: true, msg: `Equipped ${skin.name}!` };
  }
  if (!spend(skin.price)) return { ok: false, msg: `Need ${skin.price}G — not enough gold!` };
  const next = [...owned, id];
  localStorage.setItem(OWNED_KEY, JSON.stringify(next));
  cache = skin;
  localStorage.setItem(KEY, id);
  window.dispatchEvent(new CustomEvent(EVENT));
  return { ok: true, msg: `Unlocked ${skin.name}!` };
}

export function subscribeSkin(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
