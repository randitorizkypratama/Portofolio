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

export function getAudioCtx(): AudioContext | null {
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
    const c = getAudioCtx();
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
  hover: () => blip(880, 0.04, "square", 0.012),
  type: () => blip(920, 0.03, "square", 0.01),
  /** Terrain-aware footstep. */
  stepOn: (tile: number) => {
    if (tile === 9) blip(140, 0.06, "triangle", 0.022);
    else if (tile === 1 || tile === 8) blip(210, 0.04, "square", 0.014);
    else blip(170, 0.05, "triangle", 0.02);
  },
  /** Boss roar — descending saw sweep. */
  roar: () => {
    if (muted) return;
    try {
      const c = getAudioCtx();
      if (!c) return;
      const t = c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(48, t + 0.55);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(g);
      g.connect(c.destination);
      o.start(t);
      o.stop(t + 0.62);
      blip(90, 0.3, "square", 0.03, 0.05);
    } catch {
      /* audio not available */
    }
  },
  /** taking damage — low thud */
  hit: () => {
    blip(110, 0.12, "square", 0.05);
    blip(70, 0.16, "triangle", 0.04, 0.04);
  },
  /** crit strike — bright slash */
  crit: () => {
    blip(1200, 0.05, "square", 0.04);
    blip(900, 0.07, "square", 0.035, 0.05);
    blip(600, 0.1, "square", 0.03, 0.1);
  },
  /** miss — dull miss sound */
  miss: () => blip(160, 0.12, "triangle", 0.03),
};
