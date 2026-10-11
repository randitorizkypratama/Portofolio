export interface Fish {
  id: string;
  name: string;
  /** Only catchable at night. */
  nightOnly?: boolean;
  /** Relative weight — higher = more common. */
  weight: number;
}

export const FISH: Fish[] = [
  { id: "pixel_trout", name: "Pixel Trout", weight: 30 },
  { id: "neon_koi", name: "Neon Koi", weight: 24 },
  { id: "byte_bass", name: "Byte Bass", weight: 20 },
  { id: "glitch_goldfish", name: "Glitch Goldfish", weight: 14 },
  { id: "eight_bit_salmon", name: "8-bit Salmon", weight: 10 },
  { id: "golden_koi", name: "Golden Koi", weight: 3 },
  { id: "moon_eel", name: "Moon Eel", weight: 6, nightOnly: true },
];

const KEY = "pq_fish_v1";

export function getCaughtFish(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

/** Returns true if this is a new species. */
export function addFish(id: string): boolean {
  const list = getCaughtFish();
  if (list.includes(id)) return false;
  list.push(id);
  localStorage.setItem(KEY, JSON.stringify(list));
  return true;
}

export function rollFish(isNight = false): Fish {
  const pool = FISH.filter((f) => !f.nightOnly || isNight);
  const total = pool.reduce((sum, f) => sum + f.weight, 0);
  let roll = Math.random() * total;
  for (const f of pool) {
    roll -= f.weight;
    if (roll <= 0) return f;
  }
  return pool[0];
}

/** Hook zone on the 0-100 bar. */
export const HOOK_ZONE = { start: 35, end: 55 };
