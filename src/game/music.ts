// Procedural 8-bit town theme — gentle loop, default volume 45%.
import { getAudioCtx } from "./sfx";

const VOL = 0.45;
const KEY = "pq_bgm";

let enabled = typeof localStorage !== "undefined" && localStorage.getItem(KEY) !== "0";
let playing = false;
let master: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextTime = 0;

const STEP_DUR = 0.24;

const N: Record<string, number> = {
  E3: 165, G3: 196, A3: 220, C4: 262, D4: 294, E4: 330, F4: 349,
  G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, G5: 784, A5: 880,
};

// Gentle 32-step town theme (A minor pentatonic)
const MELODY: (string | null)[] = [
  "E5", "D5", "C5", "D5", "E5", "E5", "E5", null,
  "D5", "D5", "D5", null, "E5", "G5", "G5", null,
  "A5", null, "G5", "E5", "D5", null, "C5", null,
  "D5", "E5", "D5", "C5", "A4", null, null, null,
];

const BASS: (string | null)[] = [
  "A3", null, null, null, "G3", null, null, null,
  "C4", null, null, null, "E3", null, null, null,
  "A3", null, null, null, "E3", null, null, null,
  "F4", null, null, null, "G3", null, null, null,
];

function note(freq: number, t: number, dur: number, type: OscillatorType, vol: number) {
  const c = getAudioCtx();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function schedule() {
  const c = getAudioCtx();
  if (!c || !master) return;
  while (nextTime < c.currentTime + 0.25) {
    const m = MELODY[step % MELODY.length];
    const b = BASS[step % BASS.length];
    if (m) note(N[m], nextTime, STEP_DUR * 1.6, "square", 0.05);
    if (b) note(N[b], nextTime, STEP_DUR * 2.4, "triangle", 0.07);
    if (step % 4 === 2 && m) note(N[m] / 2, nextTime + 0.02, STEP_DUR, "square", 0.016);
    nextTime += STEP_DUR;
    step++;
  }
}

export function isBgmOn(): boolean {
  return enabled;
}

export function getBgmVolume(): number {
  return VOL;
}

export function startBgm() {
  if (!enabled || playing) return;
  const c = getAudioCtx();
  if (!c) return;
  if (!master) {
    master = c.createGain();
    master.connect(c.destination);
  }
  master.gain.value = VOL;
  nextTime = c.currentTime + 0.05;
  step = 0;
  timer = setInterval(schedule, 40);
  playing = true;
}

export function stopBgm() {
  if (timer) clearInterval(timer);
  timer = null;
  playing = false;
  if (master) master.gain.value = 0;
}

export function toggleBgm(): boolean {
  enabled = !enabled;
  localStorage.setItem(KEY, enabled ? "1" : "0");
  if (enabled) startBgm();
  else stopBgm();
  return enabled;
}
