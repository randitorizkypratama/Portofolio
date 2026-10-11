import { getStats, track, type Stats } from "./achievements";

const KEY = "pq_daily_v1";

interface DailyQuestDef {
  id: string;
  label: string;
  stat: keyof Stats;
  target: number;
}

const QUESTS: DailyQuestDef[] = [
  { id: "talk", label: "Talk to 2 villagers", stat: "dialogues", target: 2 },
  { id: "fish", label: "Catch a fish", stat: "fish", target: 1 },
  { id: "walk", label: "Walk 40 steps", stat: "steps", target: 40 },
  { id: "link", label: "Open a live demo", stat: "linksOpened", target: 1 },
  { id: "secret", label: "Chat with someone new", stat: "dialogues", target: 4 },
];

interface DailyState {
  date: string;
  questId: string;
  baseline: number;
  doneDate?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function load(): DailyState {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null") as DailyState;
  } catch {
    return null as unknown as DailyState;
  }
}

function save(s: DailyState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

function statValue(s: Stats, key: keyof Stats): number {
  const v = s[key];
  return typeof v === "number" ? v : 0;
}

export interface DailyQuest {
  id: string;
  label: string;
  progress: number;
  target: number;
  done: boolean;
  claimed: boolean;
}

export function getDaily(): DailyQuest {
  const def = QUESTS[dayIndex() % QUESTS.length];
  let state = load();
  const date = today();
  if (!state || state.date !== date) {
    state = {
      date,
      questId: def.id,
      baseline: statValue(getStats(), def.stat),
    };
    save(state);
  }
  const active = QUESTS.find((q) => q.id === state!.questId) ?? def;
  const progress = Math.max(
    0,
    statValue(getStats(), active.stat) - state.baseline
  );
  const done = progress >= active.target;
  let claimed = state.doneDate === date;
  if (done && !claimed) {
    track("daily");
    state.doneDate = date;
    save(state);
    claimed = true;
  }
  return {
    id: active.id,
    label: active.label,
    progress: Math.min(progress, active.target),
    target: active.target,
    done,
    claimed,
  };
}
