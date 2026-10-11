export interface ItemDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** Can be used outside battle (pause/profile)? */
  portable: boolean;
}

export const ITEMS: ItemDef[] = [
  { id: "coffee", name: "Coffee Potion", icon: "☕", desc: "Restore 1 ♥", portable: true },
  { id: "holy_water", name: "Blessed Water", icon: "💧", desc: "Deal 15 damage to the boss", portable: false },
  { id: "candy", name: "Halloween Candy", icon: "🍬", desc: "Sweet loot — restores 1 ♥", portable: true },
];

const INV_KEY = "pq_inventory_v1";
const OPENED_KEY = "pq_loot_opened_v1";

export function getInventory(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(INV_KEY) || "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

export function addItem(id: string, count = 1): void {
  const inv = getInventory();
  inv[id] = (inv[id] ?? 0) + count;
  localStorage.setItem(INV_KEY, JSON.stringify(inv));
}

/** Returns true if an item was consumed. */
export function removeItem(id: string, count = 1): boolean {
  const inv = getInventory();
  if ((inv[id] ?? 0) < count) return false;
  inv[id] -= count;
  if (inv[id] <= 0) delete inv[id];
  localStorage.setItem(INV_KEY, JSON.stringify(inv));
  return true;
}

export function itemCount(id: string): number {
  return getInventory()[id] ?? 0;
}

export function getOpened(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(OPENED_KEY) || "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function markOpened(id: string): void {
  const set = getOpened();
  set.add(id);
  localStorage.setItem(OPENED_KEY, JSON.stringify([...set]));
}
