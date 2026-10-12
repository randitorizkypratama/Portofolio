import type { TrackEvent } from "./achievements";

export interface Recipe {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** Consumed on craft. */
  inputs: { item?: string; gold?: number }[];
  /** Granted on craft. */
  outputs: { item?: string; gold?: number }[];
}

export const RECIPES: Recipe[] = [
  {
    id: "holy_water",
    name: "Blessed Water",
    icon: "💧",
    desc: "Sacred brew — 15 dmg to the dragon",
    inputs: [{ item: "coffee" }, { item: "candy" }, { gold: 15 }],
    outputs: [{ item: "holy_water" }],
  },
  {
    id: "coffee",
    name: "Roast Coffee",
    icon: "☕",
    desc: "Grind 3 sweets into a fresh potion",
    inputs: [{ item: "candy", }, { item: "candy" }, { item: "candy" }],
    outputs: [{ item: "coffee" }],
  },
  {
    id: "gold_ingot",
    name: "Polished Trophy",
    icon: "🏆",
    desc: "Sell crafted goods — Blessed Water ×2 → 45G",
    inputs: [{ item: "holy_water" }, { item: "holy_water" }],
    outputs: [{ gold: 45 }],
  },
];

export interface CraftCheck {
  ok: boolean;
  reason?: string;
}

/** Validates inputs against the inventory + gold. */
export function canCraft(r: Recipe, inv: Record<string, number>, gold: number, spendGold: (n: number) => boolean): CraftCheck {
  if (r.inputs.some((i) => i.item && (inv[i.item] ?? 0) < 1)) {
    const missing = r.inputs.find((i) => i.item && (inv[i.item] ?? 0) < 1);
    return { ok: false, reason: `Missing: ${missing?.item}` };
  }
  const goldCost = r.inputs.reduce((a, i) => a + (i.gold ?? 0), 0);
  if (gold > -1 && gold < goldCost) return { ok: false, reason: `Need ${goldCost}G` };
  // Dry-run gold check is done by caller via spendGold on actual craft
  void spendGold;
  return { ok: true };
}

/** Human-readable cost line, e.g. "☕ ×1 + 🍬 ×1 + 15G". */
export function recipeCost(r: Recipe): string {
  return r.inputs
    .map((i) => (i.gold ? `${i.gold}G` : `${iconFor(i.item ?? "")} ×1`))
    .join(" + ");
}

function iconFor(itemId: string): string {
  const map: Record<string, string> = { coffee: "☕", candy: "🍬", holy_water: "💧" };
  return map[itemId] ?? itemId;
}

export type CraftResult = { ok: boolean; msg: string; newly?: string[] };

/** Attempts a craft: consumes inputs (incl. gold), grants outputs, tracks stat. */
export function performCraft(
  r: Recipe,
  deps: {
    inv: Record<string, number>;
    gold: number;
    removeItem: (id: string, n?: number) => boolean;
    addItem: (id: string, n?: number) => void;
    spendGold: (n: number) => boolean;
    addGold: (n: number) => void;
    track: (e: TrackEvent) => string[];
  }
): CraftResult {
  const check = canCraft(r, deps.inv, deps.gold, deps.spendGold);
  if (!check.ok) return { ok: false, msg: check.reason ?? "Cannot craft." };

  for (const input of r.inputs) {
    if (input.item && !deps.removeItem(input.item, 1)) return { ok: false, msg: "Not enough materials." };
    if (input.gold && !deps.spendGold(input.gold)) return { ok: false, msg: "Not enough gold." };
  }
  const lines: string[] = [];
  for (const out of r.outputs) {
    if (out.item) {
      deps.addItem(out.item, 1);
      lines.push(`${out.item} ×1`);
    }
    if (out.gold) {
      deps.addGold(out.gold);
      lines.push(`+${out.gold}G`);
    }
  }
  const newly = deps.track("craft");
  return { ok: true, msg: `FORGED: ${r.name} — ${lines.join(", ")}`, newly };
}
