const KEY = "pq_gold";
const EVENT = "pq-gold-changed";

export function getGold(): number {
  return Number(localStorage.getItem(KEY) || "0");
}

/** Adds (or subtracts) gold, clamps at 0, and notifies listeners. */
export function addGold(n: number): number {
  const next = Math.max(0, getGold() + n);
  localStorage.setItem(KEY, String(next));
  window.dispatchEvent(new CustomEvent(EVENT));
  return next;
}

export function subscribeGold(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
