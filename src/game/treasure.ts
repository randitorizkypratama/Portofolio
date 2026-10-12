const KEY = "pq_treasure_fragments";
const EVENT = "pq-treasure-changed";

export const FRAGMENT_COUNT = 5;

export function getFragments(): number {
  return Math.min(FRAGMENT_COUNT, Number(localStorage.getItem(KEY) || 0));
}

/** Collects fragment #n (0-based). Returns the new total. */
export function collectFragment(): number {
  const next = Math.min(FRAGMENT_COUNT, getFragments() + 1);
  localStorage.setItem(KEY, String(next));
  window.dispatchEvent(new CustomEvent(EVENT));
  return next;
}

export function treasureComplete(): boolean {
  return getFragments() >= FRAGMENT_COUNT;
}

export function subscribeTreasure(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
