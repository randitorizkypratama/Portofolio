export interface FurnitureDef {
  id: string;
  name: string;
  icon: string;
  price: number;
}

export interface SlotDef {
  id: string;
  label: string;
}

/** Cottage floor plan — buy furniture, place it in a slot. */
export const SLOTS: SlotDef[] = [
  { id: "window", label: "Window" },
  { id: "shelf", label: "Shelf" },
  { id: "table", label: "Table" },
  { id: "floor", label: "Floor" },
  { id: "wall", label: "Wall" },
  { id: "corner", label: "Corner" },
];

export const FURNITURE: FurnitureDef[] = [
  { id: "chair", name: "Wooden Chair", icon: "🪑", price: 50 },
  { id: "plant", name: "Potted Plant", icon: "🪴", price: 40 },
  { id: "lamp", name: "Street Lamp", icon: "💡", price: 60 },
  { id: "painting", name: "Framed Painting", icon: "🖼️", price: 70 },
  { id: "rug", name: "Woven Rug", icon: "🧺", price: 80 },
  { id: "bookshelf", name: "Bookshelf", icon: "📚", price: 90 },
  { id: "fireplace", name: "Fireplace", icon: "🔥", price: 120 },
  { id: "trophy", name: "Gold Trophy", icon: "🏆", price: 150 },
];

const OWNED_KEY = "pq_owned_furniture";
const PLACED_KEY = "pq_placed_furniture";
const EVENT = "pq-house-changed";

export function getOwnedFurniture(): string[] {
  try {
    return JSON.parse(localStorage.getItem(OWNED_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

/** slot id → furniture id */
export function getPlacedFurniture(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(PLACED_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function savePlaced(placed: Record<string, string>): void {
  localStorage.setItem(PLACED_KEY, JSON.stringify(placed));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Buys furniture and auto-places it in the first free slot. */
export function buyFurniture(id: string, spend: (n: number) => boolean): { ok: boolean; msg: string } {
  const def = FURNITURE.find((f) => f.id === id);
  if (!def) return { ok: false, msg: "Unknown item." };
  const owned = getOwnedFurniture();
  if (owned.includes(id)) {
    return placeFurniture(id);
  }
  if (!spend(def.price)) return { ok: false, msg: `Need ${def.price}G — not enough gold!` };
  localStorage.setItem(OWNED_KEY, JSON.stringify([...owned, id]));
  const r = placeFurniture(id);
  return { ok: true, msg: r.ok ? `${def.name} placed in your cottage!` : `${def.name} added to storage.` };
}

/** Places an owned piece into its first free slot (or its matching preferred slot). */
export function placeFurniture(id: string): { ok: boolean; msg: string } {
  const def = FURNITURE.find((f) => f.id === id);
  const placed = getPlacedFurniture();
  if (Object.values(placed).includes(id)) return { ok: false, msg: `${def?.name} is already placed.` };
  const free = SLOTS.find((s) => !placed[s.id]);
  if (!free) return { ok: false, msg: "No free slot — remove something first." };
  placed[free.id] = id;
  savePlaced(placed);
  return { ok: true, msg: `${def?.name} → ${free.label}` };
}

/** Removes whatever is in the slot (goes back to storage). */
export function unplaceFurniture(slotId: string): void {
  const placed = getPlacedFurniture();
  if (!placed[slotId]) return;
  delete placed[slotId];
  savePlaced(placed);
}

export function subscribeHouse(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
