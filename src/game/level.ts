import { getStats } from "./achievements";

/** Total experience derived from lifetime stats (persistent, no extra storage). */
export function getExp(): number {
  const s = getStats();
  return (
    (s.steps ?? 0) +
    (s.dialogues ?? 0) * 3 +
    (s.fish ?? 0) * 8 +
    (s.harvest ?? 0) * 5 +
    (s.gems ?? 0) * 2 +
    (s.linksOpened ?? 0) * 10 +
    (s.loot ?? 0) * 10 +
    (s.candy ?? 0) * 3 +
    (s.friends ?? 0) * 20 +
    (s.brews ?? 0) * 6 +
    (s.crafts ?? 0) * 7 +
    (s.pets ?? 0) * 15 +
    (s.furniture ?? 0) * 10 +
    (s.fragments ?? 0) * 25 +
    (s.dragon ? 100 : 0) +
    (s.speedrun ? 50 : 0)
  );
}

/** Exp needed to advance FROM this level to the next. */
function nextAt(level: number): number {
  return 25 * level * (level + 1);
}

export function getLevel(): number {
  let exp = getExp();
  let level = 1;
  while (exp >= nextAt(level) && level < 99) {
    exp -= nextAt(level);
    level += 1;
  }
  return level;
}

/** Progress (0–1) within the current level, for the HUD bar. */
export function levelProgress(): number {
  let exp = getExp();
  let level = 1;
  while (exp >= nextAt(level) && level < 99) {
    exp -= nextAt(level);
    level += 1;
  }
  return Math.min(1, exp / nextAt(level));
}
