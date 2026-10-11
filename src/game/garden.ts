import { addItem } from "./inventory";

const KEY = "pq_garden_v1";
export const GROW_MS = 45_000;

type Plots = Record<string, { plantedAt: number; watered?: boolean }>;

function load(): Plots {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Plots;
  } catch {
    return {};
  }
}

function save(p: Plots) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export type PlotStage = "empty" | "seed" | "sprout" | "ready";

export function plotStage(id: string, now = Date.now()): PlotStage {
  const p = load()[id];
  if (!p) return "empty";
  const elapsed = now - p.plantedAt;
  if (elapsed >= GROW_MS) return "ready";
  if (elapsed >= GROW_MS * 0.35) return "sprout";
  return "seed";
}

export function plantPlot(id: string) {
  const p = load();
  p[id] = { plantedAt: Date.now() };
  save(p);
}

/** Waters once per plant — cuts 40% off the remaining grow time. */
export function waterPlot(id: string): boolean {
  const p = load();
  const plot = p[id];
  if (!plot || plot.watered) return false;
  plot.watered = true;
  plot.plantedAt -= GROW_MS * 0.4;
  save(p);
  return true;
}

/** Clears the plot and yields a random crop. Caller tracks the achievement. */
export function harvestPlot(id: string): "coffee" | "candy" | null {
  const p = load();
  if (!p[id]) return null;
  delete p[id];
  save(p);
  const item: "coffee" | "candy" = Math.random() < 0.5 ? "coffee" : "candy";
  addItem(item, 1);
  return item;
}
