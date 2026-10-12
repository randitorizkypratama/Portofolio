export interface PetDef {
  id: string;
  name: string;
  species: string;
  price: number;
  emoji: string;
  color: string;
}

export const PETS: PetDef[] = [
  { id: "cat", name: "Whiskers", species: "Cat", price: 80, emoji: "🐱", color: "#e8a87c" },
  { id: "bird", name: "Chirp", species: "Bird", price: 120, emoji: "🐦", color: "#74b9ff" },
  { id: "fox", name: "Ember", species: "Fox", price: 200, emoji: "🦊", color: "#ff9f43" },
  { id: "dragonet", name: "Cinder", species: "Dragon Hatchling", price: 400, emoji: "🐲", color: "#55efc4" },
];

const KEY = "pq_owned_pets";
const ACTIVE_KEY = "pq_active_pet";
const EVENT = "pq-pet-changed";

export function getOwnedPets(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function getActivePet(): PetDef | null {
  const id = localStorage.getItem(ACTIVE_KEY);
  return PETS.find((p) => p.id === id) ?? null;
}

/** Buy (if needed) and set active. Pass id of owned pet to equip it. */
export function adoptPet(id: string, spend: (n: number) => boolean): { ok: boolean; msg: string } {
  const pet = PETS.find((p) => p.id === id);
  if (!pet) return { ok: false, msg: "Unknown pet." };
  const owned = getOwnedPets();
  if (!owned.includes(id)) {
    if (!spend(pet.price)) return { ok: false, msg: `Need ${pet.price}G — not enough gold!` };
    localStorage.setItem(KEY, JSON.stringify([...owned, id]));
  }
  localStorage.setItem(ACTIVE_KEY, id);
  window.dispatchEvent(new CustomEvent(EVENT));
  return { ok: true, msg: `You adopted ${pet.name} the ${pet.species}!` };
}

/** Release the active pet (returns to shelter). */
export function releasePet(): void {
  localStorage.removeItem(ACTIVE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribePets(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
