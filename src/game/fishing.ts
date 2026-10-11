export interface Fish {
  id: string;
  name: string;
}

export const FISH: Fish[] = [
  { id: "pixel_trout", name: "Pixel Trout" },
  { id: "neon_koi", name: "Neon Koi" },
  { id: "byte_bass", name: "Byte Bass" },
  { id: "glitch_goldfish", name: "Glitch Goldfish" },
  { id: "eight_bit_salmon", name: "8-bit Salmon" },
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

export function rollFish(): Fish {
  return FISH[Math.floor(Math.random() * FISH.length)];
}

/** Hook zone on the 0-100 bar. */
export const HOOK_ZONE = { start: 35, end: 55 };
