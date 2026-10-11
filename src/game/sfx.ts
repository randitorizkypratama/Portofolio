// Tiny WebAudio chiptune SFX — no audio files needed.

let ctx: AudioContext | null = null;
let muted = typeof localStorage !== "undefined" && localStorage.getItem("pq_sfx_muted") === "1";

export function isSfxMuted(): boolean {
  return muted;
}

export function toggleSfxMuted(): boolean {
  muted = !muted;
  localStorage.setItem("pq_sfx_muted", muted ? "1" : "0");
  return muted;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur = 0.07, type: OscillatorType = "square", vol = 0.035, when = 0) {
  if (muted) return;
  try {
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* audio not available */
  }
}

export const sfx = {
  step: () => blip(170, 0.05, "triangle", 0.02),
  interact: () => {
    blip(520, 0.07);
    blip(780, 0.09, "square", 0.035, 0.07);
  },
  advance: () => blip(640, 0.06, "square", 0.03),
  open: () => {
    blip(330, 0.06);
    blip(470, 0.08, "square", 0.035, 0.06);
  },
  close: () => {
    blip(470, 0.06);
    blip(330, 0.08, "square", 0.035, 0.06);
  },
  link: () => {
    blip(700, 0.06);
    blip(1050, 0.1, "square", 0.03, 0.06);
  },
  achievement: () => {
    blip(523, 0.08);
    blip(659, 0.08, "square", 0.035, 0.09);
    blip(784, 0.18, "square", 0.035, 0.18);
  },
};
