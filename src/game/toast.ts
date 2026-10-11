import { ACHIEVEMENT_DEFS, track } from "./achievements";
import { sfx } from "./sfx";

export function showToast(msg: string) {
  window.dispatchEvent(new CustomEvent("pq-toast", { detail: msg }));
}

/** Play achievement SFX + show a toast for each newly unlocked id. */
export function notifyNewly(newly: string[]) {
  if (!newly.length) return;
  const def = ACHIEVEMENT_DEFS.find((a) => a.id === newly[newly.length - 1]);
  if (def) {
    sfx.achievement();
    showToast(`ACHIEVEMENT UNLOCKED — ${def.name}`);
  }
}

/** Track a one-shot event (cv, message, konami, secret) + toast if unlocked. */
export function trackAndNotify(event: "cv" | "message" | "konami" | "secret") {
  notifyNewly(track(event));
}
