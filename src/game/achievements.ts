export interface Stats {
  steps?: number;
  dialogues?: number;
  linksOpened?: number;
  sections?: string[];
  cv?: boolean;
  message?: boolean;
  konami?: boolean;
  secret?: boolean;
  fish?: number;
  speedrun?: boolean;
  cartographer?: boolean;
  daily?: boolean;
  dragon?: boolean;
  friends?: number;
  loot?: number;
  wayfinder?: boolean;
  golden?: boolean;
  nightfish?: boolean;
  candy?: number;
  hired?: boolean;
  harvest?: number;
  gems?: number;
  dailyChest?: boolean;
  brews?: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  check: (s: Stats) => boolean;
}

const KEY = "pq_achievements_v1";
const EVENT = "pq-achievements-updated";

export const TRACKED_SECTIONS = [
  "home",
  "about",
  "explore",
  "projects",
  "skills",
  "contact",
];

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: "first_step", name: "First Step", desc: "Take your first step in the world", check: (s) => (s.steps ?? 0) >= 1 },
  { id: "wanderer", name: "Wanderer", desc: "Walk 50 steps", check: (s) => (s.steps ?? 0) >= 50 },
  { id: "the_grind", name: "The Grind", desc: "Walk 200 steps", check: (s) => (s.steps ?? 0) >= 200 },
  { id: "silver_tongue", name: "Silver Tongue", desc: "Talk to 3 NPCs", check: (s) => (s.dialogues ?? 0) >= 3 },
  { id: "quest_hunter", name: "Quest Hunter", desc: "Open 3 live demos", check: (s) => (s.linksOpened ?? 0) >= 3 },
  {
    id: "explorer",
    name: "Explorer",
    desc: "Visit every section of the portfolio",
    check: (s) => TRACKED_SECTIONS.every((id) => s.sections?.includes(id)),
  },
  { id: "cv_collector", name: "CV Collector", desc: "Download the hero's CV", check: (s) => !!s.cv },
  { id: "message_bottle", name: "Message in a Bottle", desc: "Send a message via the contact form", check: (s) => !!s.message },
  { id: "bug_hunter", name: "Bug Hunter", desc: "Discover the ancient Konami spell", check: (s) => !!s.konami },
  { id: "secret_finder", name: "Secret Finder", desc: "Find the hidden villager", check: (s) => !!s.secret },
  { id: "angler", name: "Angler", desc: "Catch your first fish", check: (s) => (s.fish ?? 0) >= 1 },
  { id: "fish_master", name: "Fish Master", desc: "Catch all 5 species", check: (s) => (s.fish ?? 0) >= 5 },
  { id: "speedrunner", name: "Speedrunner", desc: "Clear all 3 quests under 2 minutes", check: (s) => !!s.speedrun },
  { id: "cartographer", name: "Cartographer", desc: "Find the hidden grove", check: (s) => !!s.cartographer },
  { id: "dragon_slayer", name: "Dragon Slayer", desc: "Defeat the Debug Dragon", check: (s) => !!s.dragon },
  { id: "daily_devotee", name: "Daily Devotee", desc: "Complete a daily quest", check: (s) => !!s.daily },
  { id: "best_friend", name: "Best Friend", desc: "Earn 8 friendship hearts", check: (s) => (s.friends ?? 0) >= 8 },
  { id: "treasure_hunter", name: "Treasure Hunter", desc: "Open a treasure chest", check: (s) => (s.loot ?? 0) >= 1 },
  { id: "wayfinder", name: "Wayfinder", desc: "Travel via a waypoint stone", check: (s) => !!s.wayfinder },
  { id: "master_angler", name: "Master Angler", desc: "Catch the Golden Koi", check: (s) => !!s.golden },
  { id: "night_fisher", name: "Night Fisher", desc: "Catch a Moon Eel after dark", check: (s) => !!s.nightfish },
  { id: "trick_or_treat", name: "Trick or Treat", desc: "Find a jack-o-lantern", check: (s) => (s.candy ?? 0) >= 1 },
  { id: "well_connected", name: "Well Connected", desc: "Open the Hire Me portal", check: (s) => !!s.hired },
  { id: "gardener", name: "Gardener", desc: "Harvest your first crop", check: (s) => (s.harvest ?? 0) >= 1 },
  { id: "gem_miner", name: "Gem Miner", desc: "Mine 10 gems in the Crystal Cavern", check: (s) => (s.gems ?? 0) >= 10 },
  { id: "daily_gift", name: "Daily Gift", desc: "Open the daily gift chest", check: (s) => !!s.dailyChest },
  {
    id: "completionist",
    name: "Completionist",
    desc: "Unlock every other achievement",
    check: (s) =>
      ACHIEVEMENT_DEFS.filter((a) => a.id !== "completionist").every((a) => a.check(s)),
  },
];

export function getStats(): Stats {
  return statsCache();
}

export function getUnlockedIds(s: Stats = getStats()): string[] {
  return ACHIEVEMENT_DEFS.filter((a) => a.check(s)).map((a) => a.id);
}

/* ── In-memory cache + debounced flush ───────────────────────────
   track() can fire many times per second (every player step).
   Reading + JSON-parsing localStorage and dispatching a global
   event each time caused main-thread jank on mobile. Stats now
   live in memory; localStorage is flushed on a trailing debounce
   and on page hide. Subscribers are notified at most ~2×/s.      */
let memStats: Stats | null = null;
let flushTimer: number | null = null;

function statsCache(): Stats {
  if (!memStats) {
    try {
      memStats = JSON.parse(localStorage.getItem(KEY) || "{}") as Stats;
    } catch {
      memStats = {};
    }
  }
  return memStats;
}

function flushNow(): void {
  if (flushTimer != null) {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!memStats) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(memStats));
  } catch {
    /* quota / private mode — keep going in memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

function scheduleFlush(): void {
  if (flushTimer != null) return;
  flushTimer = window.setTimeout(flushNow, 500);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow();
  });
}

export type TrackEvent =
  | "step"
  | "dialogue"
  | "link"
  | "section"
  | "cv"
  | "message"
  | "konami"
  | "secret"
  | "fish"
  | "speedrun"
  | "cartographer"
  | "daily"
  | "dragon"
  | "friend"
  | "chest"
  | "wayfinder"
  | "golden"
  | "nightfish"
  | "candy"
  | "portal"
  | "harvest"
  | "gems"
  | "dailychest"
  | "brew";

/** Increment a stat; returns ids newly unlocked by this event. */
export function track(event: TrackEvent, payload?: string): string[] {
  const s = statsCache();
  const before = new Set(getUnlockedIds(s));
  if (event === "step") s.steps = (s.steps ?? 0) + 1;
  if (event === "dialogue") s.dialogues = (s.dialogues ?? 0) + 1;
  if (event === "link") s.linksOpened = (s.linksOpened ?? 0) + 1;
  if (event === "section" && payload) {
    s.sections = Array.from(new Set([...(s.sections ?? []), payload]));
  }
  if (event === "cv") s.cv = true;
  if (event === "message") s.message = true;
  if (event === "konami") s.konami = true;
  if (event === "secret") s.secret = true;
  if (event === "fish") s.fish = (s.fish ?? 0) + 1;
  if (event === "speedrun") s.speedrun = true;
  if (event === "cartographer") s.cartographer = true;
  if (event === "daily") s.daily = true;
  if (event === "dragon") s.dragon = true;
  if (event === "friend") s.friends = (s.friends ?? 0) + 1;
  if (event === "chest") s.loot = (s.loot ?? 0) + 1;
  if (event === "wayfinder") s.wayfinder = true;
  if (event === "golden") s.golden = true;
  if (event === "nightfish") s.nightfish = true;
  if (event === "candy") s.candy = (s.candy ?? 0) + 1;
  if (event === "portal") s.hired = true;
  if (event === "harvest") s.harvest = (s.harvest ?? 0) + 1;
  if (event === "gems") s.gems = (s.gems ?? 0) + (payload ? Number(payload) || 0 : 0);
  if (event === "dailychest") s.dailyChest = true;
  if (event === "brew") s.brews = (s.brews ?? 0) + 1;
  const after = getUnlockedIds(s);
  const newly = after.filter((id) => !before.has(id));
  if (newly.length) {
    // Achievement unlocked — persist + notify immediately (toast needs it)
    flushNow();
  } else {
    scheduleFlush();
  }
  return newly;
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
