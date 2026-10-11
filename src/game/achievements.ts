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
  {
    id: "completionist",
    name: "Completionist",
    desc: "Unlock every other achievement",
    check: (s) =>
      ACHIEVEMENT_DEFS.filter((a) => a.id !== "completionist").every((a) => a.check(s)),
  },
];

export function getStats(): Stats {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Stats;
  } catch {
    return {};
  }
}

export function getUnlockedIds(s: Stats = getStats()): string[] {
  return ACHIEVEMENT_DEFS.filter((a) => a.check(s)).map((a) => a.id);
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
  | "cartographer";

/** Increment a stat; returns ids newly unlocked by this event. */
export function track(event: TrackEvent, payload?: string): string[] {
  const before = new Set(getUnlockedIds());
  const s = getStats();
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
  localStorage.setItem(KEY, JSON.stringify(s));
  const after = getUnlockedIds(s);
  const newly = after.filter((id) => !before.has(id));
  window.dispatchEvent(new CustomEvent(EVENT));
  return newly;
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
