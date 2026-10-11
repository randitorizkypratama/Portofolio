import { projects } from "../data/portfolio";
import { track } from "./achievements";
import { notifyNewly } from "./toast";

export const JOURNAL_SECTIONS = [
  { id: "home", label: "Hero's Gate" },
  { id: "explore", label: "Pixel Quest World" },
  { id: "projects", label: "Quest Log" },
  { id: "skills", label: "Tech Altar" },
  { id: "about", label: "About & CV" },
  { id: "contact", label: "Message Board" },
];

export const JOURNAL_PROJECTS = projects.map((p) => ({
  id: p.slug,
  label: p.title,
}));

const KEY = "pq_journal_v1";
const EVENT = "pq-journal-updated";

export interface Journal {
  sections: string[];
  projects: string[];
}

export function getJournal(): Journal {
  try {
    const j = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Journal>;
    return { sections: j.sections ?? [], projects: j.projects ?? [] };
  } catch {
    return { sections: [], projects: [] };
  }
}

export function getCompletion(j: Journal = getJournal()): number {
  const total = JOURNAL_SECTIONS.length + JOURNAL_PROJECTS.length;
  const done =
    j.sections.filter((id) => JOURNAL_SECTIONS.some((s) => s.id === id)).length +
    j.projects.filter((id) => JOURNAL_PROJECTS.some((p) => p.id === id)).length;
  return Math.round((done / total) * 100);
}

function save(j: Journal) {
  localStorage.setItem(KEY, JSON.stringify(j));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function markSection(id: string) {
  const j = getJournal();
  if (j.sections.includes(id)) return;
  j.sections.push(id);
  save(j);
  notifyNewly(track("section", id));
}

export function markProject(slug: string) {
  const j = getJournal();
  if (j.projects.includes(slug)) return;
  j.projects.push(slug);
  save(j);
}

export function subscribeJournal(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
