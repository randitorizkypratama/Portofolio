import { track } from "./achievements";

const KEY = "pq_friendship_v1";
const MAX = 5;

export function getHearts(id: string): number {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, number>;
    return Math.min(MAX, all[id] ?? 0);
  } catch {
    return 0;
  }
}

/** +1 heart (capped). Returns new heart count. */
export function bumpFriendship(id: string): number {
  const current = getHearts(id);
  if (current >= MAX) return current;
  const next = current + 1;
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, number>;
    all[id] = next;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  track("friend");
  return next;
}

export function heartsLabel(n: number): string {
  return "♥".repeat(n) + "♡".repeat(MAX - n);
}

/** Total hearts earned across every NPC (drives slime-ride unlock). */
export function getTotalHearts(): number {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, number>;
    return Object.values(all).reduce((a, b) => a + b, 0);
  } catch {
    return 0;
  }
}
