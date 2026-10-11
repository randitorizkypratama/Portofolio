import { getStats } from "./achievements";

/** Highest earned title, shown above the player. */
export function getTitle(): string {
  const s = getStats();
  if (s.dragon) return "Dragon Slayer";
  if ((s.friends ?? 0) >= 8) return "Village Idol";
  if ((s.fish ?? 0) >= 10) return "Master Angler";
  if (s.daily) return "Daily Devotee";
  if (s.cartographer) return "Cartographer";
  if ((s.steps ?? 0) >= 200) return "Wanderer";
  if ((s.steps ?? 0) >= 50) return "Traveler";
  return "Rookie Adventurer";
}
