/** Consecutive-NPC-talk combo window (ms). */
const WINDOW = 15_000;

let lastTalkAt = 0;
let lastNpcId = "";
let combo = 0;

/** Registers an NPC talk; returns the current combo count (1 = fresh streak).
 *  Re-talking to the SAME NPC never chains — only new faces build combo. */
export function registerTalk(npcId: string): number {
  const now = Date.now();
  if (npcId === lastNpcId && now - lastTalkAt < WINDOW) {
    lastTalkAt = now;
    return combo;
  }
  combo = now - lastTalkAt < WINDOW && npcId !== lastNpcId ? combo + 1 : 1;
  lastTalkAt = now;
  lastNpcId = npcId;
  return combo;
}

export function getCombo(): number {
  if (Date.now() - lastTalkAt >= WINDOW) combo = 0;
  return combo;
}

/** Gold bonus for maintaining a combo: x2 = 5G, x3 = 10G, x4+ = 20G. */
export function comboGold(c: number): number {
  if (c >= 4) return 20;
  if (c === 3) return 10;
  if (c === 2) return 5;
  return 0;
}
