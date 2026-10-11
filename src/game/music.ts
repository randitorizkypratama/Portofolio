// Procedural 8-bit town themes — gentle loops, default volume 45%.
import { getAudioCtx } from "./sfx";

const VOL = 0.45;
const KEY = "pq_bgm";
const TRACK_KEY = "pq_bgm_track";

let enabled = typeof localStorage !== "undefined" && localStorage.getItem(KEY) !== "0";
let playing = false;
let master: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextTime = 0;

let trackIdx = 0;
try {
  trackIdx = Number(localStorage.getItem(TRACK_KEY) || "0") || 0;
} catch {
  trackIdx = 0;
}

const N: Record<string, number> = {
  E3: 165, F3: 175, G3: 196, A3: 220, B3: 247, C4: 262, D4: 294, E4: 330,
  F4: 349, G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698,
  G5: 784, A5: 880,
};

interface Track {
  melody: (string | null)[];
  bass: (string | null)[];
  stepDur: number;
}

// Track 0 — Sunny Town (A minor, gentle)
const TOWN: Track = {
  stepDur: 0.24,
  melody: [
    "E5", "D5", "C5", "D5", "E5", "E5", "E5", null,
    "D5", "D5", "D5", null, "E5", "G5", "G5", null,
    "A5", null, "G5", "E5", "D5", null, "C5", null,
    "D5", "E5", "D5", "C5", "A4", null, null, null,
  ],
  bass: [
    "A3", null, null, null, "G3", null, null, null,
    "C4", null, null, null, "E3", null, null, null,
    "A3", null, null, null, "E3", null, null, null,
    "F4", null, null, null, "G3", null, null, null,
  ],
};

// Track 1 — Meadow Run (C major, brighter, faster)
const MEADOW: Track = {
  stepDur: 0.18,
  melody: [
    "C5", "E5", "G5", "E5", "A5", "G5", "E5", "D5",
    "C5", "E5", "G5", "A5", "G5", "E5", "D5", null,
    "F5", "E5", "D5", "C5", "D5", "E5", "F5", "G5",
    "E5", "C5", "C5", null, "G4", "C5", null, null,
  ],
  bass: [
    "C4", null, "G3", null, "A3", null, "E3", null,
    "F3", null, "C4", null, "G3", null, "G3", null,
    "F3", null, "C4", null, "D4", null, "G3", null,
    "C4", null, "G3", null, "C4", null, null, null,
  ],
};

// Track 2 — Night Ocarina (slow, dreamy)
const NIGHT: Track = {
  stepDur: 0.32,
  melody: [
    "A4", null, "C5", null, "E5", null, "D5", null,
    "C5", null, null, null, "A4", null, null, null,
    "G4", null, "A4", null, "C5", null, "B4", null,
    "A4", null, null, null, null, null, null, null,
  ],
  bass: [
    "A3", null, null, null, null, null, null, null,
    "F3", null, null, null, null, null, null, null,
    "G3", null, null, null, null, null, null, null,
    "E3", null, null, null, null, null, null, null,
  ],
};

export const TRACKS: Track[] = [TOWN, MEADOW, NIGHT];
export const TRACK_NAMES = ["SUNNY TOWN", "MEADOW RUN", "NIGHT OCARINA"];

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
  const track = TRACKS[trackIdx % TRACKS.length];
  const sd = track.stepDur;
  while (nextTime < c.currentTime + 0.25) {
    const m = track.melody[step % track.melody.length];
    const b = track.bass[step % track.bass.length];
    if (m) note(N[m], nextTime, sd * 1.6, "square", 0.05);
    if (b) note(N[b], nextTime, sd * 2.4, "triangle", 0.07);
    if (step % 4 === 2 && m) note(N[m] / 2, nextTime + 0.02, sd, "square", 0.016);
    nextTime += sd;
    step++;
  }
}

export function isBgmOn(): boolean {
  return enabled;
}

export function getBgmVolume(): number {
  return VOL;
}

export function getBgmTrack(): number {
  return trackIdx % TRACKS.length;
}

export function getBgmTrackName(): string {
  return TRACK_NAMES[getBgmTrack()];
}

/** Switch to next track; returns new index. Takes effect immediately. */
export function cycleBgmTrack(): number {
  trackIdx = (getBgmTrack() + 1) % TRACKS.length;
  try {
    localStorage.setItem(TRACK_KEY, String(trackIdx));
  } catch {
    /* ignore */
  }
  return trackIdx;
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
