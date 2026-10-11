import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  isWalkable,
  tileMap as mapData,
} from "../game/tileMap";
import {
  npcs,
  bossDragon,
  getNearbyEntity,
  type Direction,
  type Position,
  type NPC,
} from "../game/entities";
import { tileBackground } from "../game/tileArt";
import { getTileAt } from "../game/tileMap";
import { sfx } from "../game/sfx";
import { track } from "../game/achievements";
import { notifyNewly, showToast } from "../game/toast";
import { getDayPeriod, type DayPeriod } from "../game/dayNight";
import { FISH, HOOK_ZONE, addFish, rollFish, getCaughtFish } from "../game/fishing";
import { cycleBgmTrack, getBgmTrackName } from "../game/music";
import { bumpFriendship, heartsLabel } from "../game/friendship";
import { Minimap } from "./Minimap";
import { NPCPortrait } from "./NPCPortrait";

const VIEWPORT_TILES_X = 17;
const VIEWPORT_TILES_Y = 13;
const START_POS: Position = { x: 14, y: 19 };

const FIREFLIES = [
  { left: "8%", top: "18%", delay: 0, duration: 5.5, color: "#ffd94a" },
  { left: "22%", top: "70%", delay: 1.2, duration: 6.5, color: "#5bb8c9" },
  { left: "40%", top: "30%", delay: 2.4, duration: 5, color: "#ffd94a" },
  { left: "58%", top: "78%", delay: 0.6, duration: 7, color: "#ffd94a" },
  { left: "72%", top: "22%", delay: 3.1, duration: 6, color: "#5bb8c9" },
  { left: "88%", top: "55%", delay: 1.8, duration: 5.8, color: "#ffd94a" },
];

// Pixel-art tile renderer (SVG data-URI backgrounds)
function TileSprite({ type, x, y }: { type: number; x: number; y: number }) {
  const bg = tileBackground(type, x, y);
  return (
    <div
      className={type === 2 || type === 13 ? "tile-water select-none" : "select-none"}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundImage: bg.backgroundImage,
        backgroundSize: bg.backgroundSize,
        imageRendering: "pixelated",
      }}
    />
  );
}

function EntityShadow({ size = 20 }: { size?: number }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 rounded-[50%] pointer-events-none"
      style={{
        bottom: 3,
        width: size,
        height: size * 0.4,
        background: "rgba(10, 18, 12, 0.35)",
        filter: "blur(1px)",
      }}
    />
  );
}

// Detailed pixel-art player (16x16, outlined, shaded)
function PlayerSprite({ moving }: { moving: boolean }) {
  return (
    <div
      className="absolute z-10 flex items-center justify-center"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        transform: moving ? "translateY(-2px)" : "none",
        transition: "transform 0.08s",
      }}
    >
      <EntityShadow size={18} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 16 16"
        className={moving ? "" : "player-idle"}
        style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}
      >
        {/* Hair */}
        <rect x="5" y="1" width="6" height="1" fill="#2a2a38" />
        <rect x="4" y="2" width="8" height="2" fill="#2a2a38" />
        <rect x="6" y="1" width="3" height="1" fill="#45455c" />
        <rect x="4" y="4" width="1" height="2" fill="#2a2a38" />
        <rect x="11" y="4" width="1" height="2" fill="#2a2a38" />
        {/* Face */}
        <rect x="5" y="4" width="6" height="3" fill="#f0c8a0" />
        <rect x="5" y="6" width="6" height="1" fill="#e0b088" />
        {/* Bangs */}
        <rect x="5" y="4" width="6" height="1" fill="#2a2a38" />
        <rect x="5" y="5" width="1" height="1" fill="#2a2a38" />
        <rect x="10" y="5" width="1" height="1" fill="#2a2a38" />
        {/* Eyes + blush */}
        <rect x="6" y="5" width="1" height="1" fill="#1a2438" />
        <rect x="9" y="5" width="1" height="1" fill="#1a2438" />
        <rect x="5" y="6" width="1" height="1" fill="#f0a088" />
        <rect x="10" y="6" width="1" height="1" fill="#f0a088" />
        {/* Neck + scarf */}
        <rect x="7" y="7" width="2" height="1" fill="#e0b088" />
        <rect x="5" y="7" width="6" height="1" fill="#d4a847" />
        <rect x="5" y="8" width="6" height="1" fill="#b88e35" />
        <rect x="11" y="8" width="1" height="2" fill="#d4a847" />
        {/* Hoodie */}
        <rect x="4" y="8" width="8" height="1" fill="#2f2f5a" />
        <rect x="4" y="9" width="8" height="4" fill="#3d3d72" />
        <rect x="3" y="9" width="1" height="4" fill="#3d3d72" />
        <rect x="12" y="9" width="1" height="4" fill="#33335e" />
        <rect x="6" y="11" width="4" height="2" fill="#33335e" />
        <rect x="7" y="10" width="2" height="2" fill="#d4a847" />
        {/* Hands */}
        <rect x="3" y="13" width="1" height="1" fill="#f0c8a0" />
        <rect x="12" y="13" width="1" height="1" fill="#e0b088" />
        {/* Legs */}
        <rect x="5" y="13" width="2" height="2" fill="#25253f" />
        <rect x="9" y="13" width="2" height="2" fill="#25253f" />
        <rect x="7" y="13" width="2" height="1" fill="#1e1e30" />
        {/* Shoes */}
        <rect x="5" y="15" width="2" height="1" fill="#5c3a1e" />
        <rect x="9" y="15" width="2" height="1" fill="#5c3a1e" />
      </svg>
    </div>
  );
}

// Detailed pixel-art NPC (16x16)
function NPCSprite({ npc, isNearby, enraged }: { npc: NPC; isNearby: boolean; enraged?: boolean }) {
  return (
    <div className="absolute flex items-center justify-center" style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      <EntityShadow size={npc.id === "boss-dragon" ? 28 : npc.type === "quest" ? 22 : 18} />

      {/* Quest marker */}
      {npc.type === "quest" && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 retro-font text-[9px] text-gold animate-blink z-10"
          style={{ textShadow: "0 0 6px rgba(212,168,71,0.9)" }}
        >
          !
        </div>
      )}

      {/* Gold corner brackets when nearby */}
      {isNearby && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gold" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gold" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gold" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold" />
        </div>
      )}

      <svg
        width="30"
        height="30"
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}
      >
        {npc.type === "quest" ? (
          <>
            {/* Legs */}
            <rect x="3" y="11" width="2" height="4" fill="#6b4a2a" />
            <rect x="11" y="11" width="2" height="4" fill="#6b4a2a" />
            <rect x="4" y="11" width="1" height="4" fill="#543a20" />
            <rect x="12" y="11" width="1" height="4" fill="#543a20" />
            {/* Board frame */}
            <rect x="2" y="1" width="12" height="11" fill="#5c3a1e" />
            <rect x="3" y="2" width="10" height="9" fill="#a5794a" />
            <rect x="3" y="2" width="10" height="1" fill="#c08a4a" />
            {/* Parchment */}
            <rect x="4" y="3" width="8" height="7" fill="#f0e0b8" />
            <rect x="5" y="4" width="6" height="1" fill="#b09060" />
            <rect x="5" y="6" width="5" height="1" fill="#b09060" />
            <rect x="5" y="8" width="4" height="1" fill="#b09060" />
            {/* Gold seal */}
            <rect x="10" y="8" width="2" height="2" fill="#d4a847" />
          </>
        ) : npc.id === "npc-guide" ? (
          <>
            {/* Wizard hat */}
            <rect x="6" y="0" width="4" height="1" fill="#5b3d9e" />
            <rect x="5" y="1" width="6" height="1" fill="#5b3d9e" />
            <rect x="4" y="2" width="8" height="2" fill="#5b3d9e" />
            <rect x="4" y="4" width="8" height="1" fill="#4a2f85" />
            <rect x="7" y="1" width="1" height="1" fill="#ffd94a" />
            <rect x="9" y="3" width="1" height="1" fill="#ffd94a" />
            {/* Head */}
            <rect x="5" y="5" width="6" height="3" fill="#f0c8a0" />
            <rect x="5" y="7" width="6" height="1" fill="#e0b088" />
            <rect x="6" y="6" width="1" height="1" fill="#1a2438" />
            <rect x="9" y="6" width="1" height="1" fill="#1a2438" />
            {/* Beard */}
            <rect x="5" y="8" width="6" height="2" fill="#e8e8f0" />
            <rect x="6" y="10" width="4" height="1" fill="#d0d0e0" />
            {/* Robe */}
            <rect x="4" y="10" width="8" height="5" fill="#5b3d9e" />
            <rect x="10" y="10" width="2" height="5" fill="#4a2f85" />
            <rect x="7" y="10" width="2" height="4" fill="#d4a847" />
            {/* Staff */}
            <rect x="13" y="4" width="1" height="11" fill="#8b6239" />
            <rect x="13" y="2" width="1" height="2" fill="#5bb8c9" />
            <rect x="12" y="3" width="3" height="1" fill="#3d8ba0" />
          </>
        ) : npc.id === "npc-sensei" ? (
          <>
            {/* Conical hat */}
            <rect x="5" y="1" width="6" height="1" fill="#b89b6a" />
            <rect x="4" y="2" width="8" height="1" fill="#a5885a" />
            <rect x="3" y="3" width="10" height="1" fill="#8b7355" />
            {/* Head */}
            <rect x="5" y="4" width="6" height="3" fill="#f0c8a0" />
            <rect x="5" y="6" width="6" height="1" fill="#e0b088" />
            <rect x="6" y="5" width="1" height="1" fill="#1a2438" />
            <rect x="9" y="5" width="1" height="1" fill="#1a2438" />
            {/* Beard */}
            <rect x="6" y="7" width="4" height="1" fill="#e8e8f0" />
            {/* Teal robe */}
            <rect x="4" y="8" width="8" height="7" fill="#2a6a6a" />
            <rect x="10" y="8" width="2" height="7" fill="#1f5252" />
            <rect x="7" y="9" width="2" height="4" fill="#d4a847" />
            {/* Staff */}
            <rect x="13" y="3" width="1" height="12" fill="#8b6239" />
            <rect x="13" y="1" width="1" height="2" fill="#5bb8c9" />
            <rect x="12" y="2" width="1" height="1" fill="#3d8ba0" />
            <rect x="14" y="2" width="1" height="1" fill="#3d8ba0" />
          </>
        ) : npc.id === "npc-github" ? (
          <>
            {/* Antenna */}
            <rect x="7" y="1" width="2" height="2" fill="#3a4550" />
            <rect x="7" y="0" width="2" height="1" fill="#5bb8c9" />
            {/* Rounded head */}
            <rect x="5" y="3" width="6" height="1" fill="#2a3440" />
            <rect x="4" y="4" width="8" height="6" fill="#2a3440" />
            <rect x="5" y="10" width="6" height="1" fill="#2a3440" />
            <rect x="4" y="4" width="8" height="1" fill="#3a4550" />
            {/* Face screen */}
            <rect x="5" y="5" width="6" height="4" fill="#101820" />
            <rect x="6" y="6" width="2" height="2" fill="#5bb8c9" />
            <rect x="9" y="6" width="2" height="2" fill="#5bb8c9" />
            <rect x="6" y="6" width="1" height="1" fill="#a8e8f8" />
            <rect x="9" y="6" width="1" height="1" fill="#a8e8f8" />
            {/* Body + core */}
            <rect x="5" y="11" width="6" height="3" fill="#2a3440" />
            <rect x="5" y="11" width="6" height="1" fill="#3a4550" />
            <rect x="7" y="12" width="2" height="1" fill="#5bb8c9" />
            <rect x="7" y="13" width="2" height="1" fill="#3d8ba0" />
          </>
        ) : npc.id === "npc-secret" ? (
          <>
            {/* Ears */}
            <rect x="4" y="2" width="3" height="2" fill="#e8a84c" />
            <rect x="5" y="3" width="1" height="1" fill="#f0a0b0" />
            <rect x="9" y="2" width="3" height="2" fill="#e8a84c" />
            <rect x="10" y="3" width="1" height="1" fill="#f0a0b0" />
            {/* Head */}
            <rect x="4" y="4" width="8" height="6" fill="#e8a84c" />
            <rect x="4" y="4" width="8" height="1" fill="#f0c078" />
            {/* Eyes */}
            <rect x="6" y="6" width="2" height="2" fill="#1a2438" />
            <rect x="9" y="6" width="2" height="2" fill="#1a2438" />
            <rect x="7" y="8" width="2" height="1" fill="#f0a0b0" />
            {/* Whiskers */}
            <rect x="2" y="7" width="2" height="1" fill="#f0e6d2" />
            <rect x="12" y="7" width="2" height="1" fill="#f0e6d2" />
            {/* Body */}
            <rect x="5" y="10" width="6" height="4" fill="#e8a84c" />
            <rect x="5" y="10" width="6" height="1" fill="#f0c078" />
            {/* Tail */}
            <rect x="11" y="11" width="3" height="1" fill="#e8a84c" />
            <rect x="13" y="9" width="1" height="2" fill="#e8a84c" />
            {/* Paws */}
            <rect x="5" y="14" width="2" height="1" fill="#f0c078" />
            <rect x="9" y="14" width="2" height="1" fill="#f0c078" />
          </>
        ) : npc.id === "npc-faq" ? (
          <>
            {/* White hair */}
            <rect x="5" y="1" width="6" height="2" fill="#e8e8f0" />
            <rect x="4" y="2" width="8" height="1" fill="#d0d0dc" />
            {/* Head */}
            <rect x="5" y="3" width="6" height="4" fill="#f0c8a0" />
            <rect x="6" y="4" width="1" height="1" fill="#1a2438" />
            <rect x="9" y="4" width="1" height="1" fill="#1a2438" />
            {/* Beard */}
            <rect x="5" y="7" width="6" height="2" fill="#e8e8f0" />
            {/* Purple robe */}
            <rect x="4" y="9" width="8" height="6" fill="#6a4a8a" />
            <rect x="10" y="9" width="2" height="6" fill="#553a70" />
            <rect x="7" y="10" width="2" height="4" fill="#d4a847" />
            {/* Staff */}
            <rect x="13" y="4" width="1" height="11" fill="#8b6239" />
            <rect x="13" y="2" width="2" height="2" fill="#d4a847" />
          </>
        ) : npc.id === "boss-dragon" ? (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            className={enraged ? "enraged-sprite" : "pet-bounce"}
            style={{ imageRendering: "pixelated", position: "relative", zIndex: 1, overflow: "visible" }}
          >
            {/* Horns */}
            <rect x="13" y="1" width="2" height="3" fill="#f5b041" />
            <rect x="18" y="1" width="2" height="3" fill="#f5b041" />
            {/* Head */}
            <rect x="12" y="4" width="9" height="5" fill="#c0392b" />
            <rect x="12" y="4" width="9" height="1" fill="#a93226" />
            {/* Eye */}
            <rect x="17" y="5" width="2" height="2" fill="#f1c40f" />
            <rect x="18" y="5" width="1" height="1" fill="#1a2438" />
            {/* Snout + fire */}
            <rect x="20" y="7" width="3" height="2" fill="#c0392b" />
            <rect x="22" y="6" width="2" height="1" fill="#f39c12" />
            <rect x="23" y="7" width="1" height="1" fill="#e67e22" />
            {/* Wing */}
            <rect x="2" y="5" width="4" height="6" fill="#922b21" />
            <rect x="1" y="4" width="3" height="4" fill="#7b241c" />
            {/* Body */}
            <rect x="6" y="9" width="12" height="8" fill="#c0392b" />
            <rect x="6" y="9" width="12" height="1" fill="#a93226" />
            {/* Belly */}
            <rect x="9" y="13" width="7" height="4" fill="#e74c3c" />
            {/* Legs */}
            <rect x="7" y="17" width="3" height="3" fill="#922b21" />
            <rect x="14" y="17" width="3" height="3" fill="#922b21" />
            {/* Tail */}
            <rect x="18" y="15" width="3" height="2" fill="#c0392b" />
            <rect x="20" y="13" width="2" height="3" fill="#a93226" />
            <rect x="21" y="11" width="1" height="3" fill="#c0392b" />
          </svg>
        ) : (
          <>
            {/* Headband */}
            <rect x="4" y="2" width="8" height="2" fill="#c0392b" />
            <rect x="4" y="3" width="8" height="1" fill="#a93226" />
            <rect x="12" y="4" width="1" height="2" fill="#c0392b" />
            {/* Head */}
            <rect x="5" y="4" width="6" height="3" fill="#f0c8a0" />
            <rect x="5" y="6" width="6" height="1" fill="#e0b088" />
            <rect x="6" y="5" width="1" height="1" fill="#1a2438" />
            <rect x="9" y="5" width="1" height="1" fill="#1a2438" />
            {/* Armor body */}
            <rect x="4" y="7" width="8" height="6" fill="#6e7a87" />
            <rect x="10" y="7" width="2" height="6" fill="#5c6874" />
            <rect x="6" y="8" width="4" height="3" fill="#9aa5b1" />
            <rect x="7" y="9" width="2" height="1" fill="#c0c9d4" />
            <rect x="5" y="12" width="6" height="1" fill="#d4a847" />
            {/* Arms */}
            <rect x="3" y="8" width="1" height="4" fill="#6e7a87" />
            <rect x="12" y="8" width="1" height="4" fill="#5c6874" />
            {/* Legs */}
            <rect x="5" y="13" width="2" height="2" fill="#3a4550" />
            <rect x="9" y="13" width="2" height="2" fill="#3a4550" />
            {/* Sword */}
            <rect x="14" y="2" width="1" height="8" fill="#d0d8e0" />
            <rect x="14" y="2" width="1" height="2" fill="#eef2f6" />
            <rect x="13" y="9" width="3" height="1" fill="#d4a847" />
            <rect x="14" y="10" width="1" height="2" fill="#5c3a1e" />
          </>
        )}
      </svg>
    </div>
  );
}

interface BattleTiming {
  pos: number;
  dir: number;
  center: number;
  width: number;
  atk: number;
}

interface BattleState {
  hp: number;
  playerHp: number;
  log: string[];
  phase: "fight" | "victory" | "gameover";
  enraged: boolean;
  taunt25: boolean;
  timing: BattleTiming | null;
}

const BATTLE_ATTACKS = [
  { name: "STACK OVERFLOW SLASH", min: 13, max: 22, critMult: 2, line: "404 feelings not found!" },
  { name: "COFFEE BURST", min: 10, max: 18, critMult: 2, line: "The dragon is jittering!" },
  { name: "RUBBER DUCK", min: 8, max: 14, critMult: 3, line: "Explains its bugs to the duck... confusion +10!" },
];

const DRAGON_MOVES = [
  { name: "DEBUG BREATH", line: "Debug breath scorches your armor!" },
  { name: "DEADLINE RUSH", line: "Deadline rush slams into you!" },
  { name: "STACK TRACE TAIL", line: "Stack trace tail whip!" },
];
const DRAGON_ENRAGE_MOVE = { name: "MERGE CONFLICT", line: "MERGE CONFLICT! Your branches clash violently!" };

const CONFETTI_COLORS = ["#d4a847", "#5bb8c9", "#c0392b", "#27ae60", "#f0e6d2", "#9b59b6"];

const pushLog = (log: string[], line: string): string[] => [...log, line].slice(-3);

function BossDragonMini({ enraged }: { enraged: boolean }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      style={{ imageRendering: "pixelated", overflow: "visible" }}
      className={enraged ? "enraged-sprite" : undefined}
    >
      <rect x="13" y="1" width="2" height="3" fill="#f5b041" />
      <rect x="18" y="1" width="2" height="3" fill="#f5b041" />
      <rect x="12" y="4" width="9" height="5" fill="#c0392b" />
      <rect x="12" y="4" width="9" height="1" fill="#a93226" />
      <rect x="17" y="5" width="2" height="2" fill="#f1c40f" />
      <rect x="18" y="5" width="1" height="1" fill="#1a2438" />
      <rect x="20" y="7" width="3" height="2" fill="#c0392b" />
      <rect x="22" y="6" width="2" height="1" fill="#f39c12" />
      <rect x="23" y="7" width="1" height="1" fill="#e67e22" />
      <rect x="2" y="5" width="4" height="6" fill="#922b21" />
      <rect x="1" y="4" width="3" height="4" fill="#7b241c" />
      <rect x="6" y="9" width="12" height="8" fill="#c0392b" />
      <rect x="6" y="9" width="12" height="1" fill="#a93226" />
      <rect x="9" y="13" width="7" height="4" fill="#e74c3c" />
      <rect x="7" y="17" width="3" height="3" fill="#922b21" />
      <rect x="14" y="17" width="3" height="3" fill="#922b21" />
      <rect x="18" y="15" width="3" height="2" fill="#c0392b" />
      <rect x="20" y="13" width="2" height="3" fill="#a93226" />
      <rect x="21" y="11" width="1" height="3" fill="#c0392b" />
    </svg>
  );
}

export function RPGWorld() {
  const [playerPos, setPlayerPos] = useState<Position>(START_POS);
  const [direction, setDirection] = useState<Direction>("down");
  const [moving, setMoving] = useState(false);
  const [nearbyEntity, setNearbyEntity] = useState<NPC | null>(null);
  const [dialogue, setDialogue] = useState<{ npc: NPC; lineIndex: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [visitLink, setVisitLink] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [period, setPeriod] = useState<DayPeriod>(() => getDayPeriod());
  const [fishing, setFishing] = useState<{
    pos: number;
    dir: 1 | -1;
    done: boolean;
    result?: string | null;
  } | null>(null);
  const [weather, setWeather] = useState<"clear" | "rain" | "storm">("clear");
  const [running, setRunning] = useState(false);
  const [runTime, setRunTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const v = Number(localStorage.getItem("pq_best_time") || "0");
    return v > 0 ? v : null;
  });
  const [visitors, setVisitors] = useState<number | null>(null);
  const [caughtFish, setCaughtFish] = useState<string[]>(() => getCaughtFish());
  const [hearts, setHearts] = useState(0);
  const [bossAwake, setBossAwake] = useState<boolean>(() => {
    try {
      return (JSON.parse(localStorage.getItem("pq_quests_cleared") || "[]") as string[]).length >= 3;
    } catch {
      return false;
    }
  });
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [dragonDefeated, setDragonDefeated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pq_dragon_defeated") === "1";
    } catch {
      return false;
    }
  });

  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const interactCooldownRef = useRef(false);

  const dialogueRef = useRef(dialogue);
  const showMenuRef = useRef(showMenu);
  const playerPosRef = useRef(playerPos);
  const directionRef = useRef(direction);
  const advanceDialogueRef = useRef<(() => void) | null>(null);
  const interactRef = useRef<(() => void) | null>(null);

  // Pet slime
  const historyRef = useRef<Position[]>([START_POS, START_POS, START_POS]);
  const petPosRef = useRef({ x: START_POS.x, y: START_POS.y });
  const petRef = useRef<HTMLDivElement>(null);
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);

  // Fishing / speedrun
  const fishingRef = useRef<typeof fishing>(null);
  const runStartRef = useRef<number | null>(null);
  const clearedQuestsRef = useRef<Set<string>>((() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("pq_quests_cleared") || "[]") as string[]);
    } catch {
      return new Set<string>();
    }
  })());
  const visitorsRef = useRef<number | null>(null);
  const periodRef = useRef(period);
  const bossAwakeRef = useRef(bossAwake);
  const battleRef = useRef<BattleState | null>(null);
  const dragonDefeatedRef = useRef(dragonDefeated);
  const viewportFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fishingRef.current = fishing; }, [fishing]);
  useEffect(() => { visitorsRef.current = visitors; }, [visitors]);
  useEffect(() => { periodRef.current = period; }, [period]);
  useEffect(() => { bossAwakeRef.current = bossAwake; }, [bossAwake]);
  useEffect(() => { battleRef.current = battle; }, [battle]);
  useEffect(() => { dragonDefeatedRef.current = dragonDefeated; }, [dragonDefeated]);

  /** NPCs with night positions applied; optionally include the boss. */
  const makeActiveList = (night: boolean, includeBoss: boolean): NPC[] => {
    const list: NPC[] = npcs
      .filter((n) => !n.nightOnly || night)
      .map((n) => ({
        ...n,
        position: night && n.nightPosition ? n.nightPosition : n.position,
      }));
    if (includeBoss && bossAwakeRef.current && !dragonDefeatedRef.current) {
      list.push(bossDragon);
    }
    return list;
  };

  const shake = (ms = 450) => {
    const el = viewportFrameRef.current;
    if (!el) return;
    el.classList.remove("battle-shake");
    void el.offsetWidth;
    el.classList.add("battle-shake");
    window.setTimeout(() => el.classList.remove("battle-shake"), ms);
  };

  const dragonCounter = () => {
    const b = battleRef.current;
    if (!b || b.phase !== "fight") return;
    const pool = b.enraged
      ? [...DRAGON_MOVES, DRAGON_ENRAGE_MOVE, DRAGON_ENRAGE_MOVE]
      : DRAGON_MOVES;
    const mv = pool[Math.floor(Math.random() * pool.length)];
    const playerHp = b.playerHp - 1;
    sfx.hit();
    shake();
    if (playerHp <= 0) {
      setBattle({
        ...b,
        playerHp: 0,
        timing: null,
        phase: "gameover",
        log: pushLog(b.log, `${mv.name}! ${mv.line} GAME OVER — eaten by a semicolon.`),
      });
      sfx.miss();
    } else {
      setBattle({
        ...b,
        playerHp,
        timing: null,
        log: pushLog(b.log, `${mv.name}! ${mv.line} (-1 ♥)`),
      });
    }
  };

  const judgeStrike = () => {
    const b = battleRef.current;
    if (!b || !b.timing || b.phase !== "fight") return;
    const t = b.timing;
    const atk = BATTLE_ATTACKS[t.atk];
    const dist = Math.abs(t.pos - t.center);
    const hit = dist <= t.width / 2;
    const crit = dist <= t.width * 0.35;

    if (!hit) {
      sfx.miss();
      setBattle({
        ...b,
        timing: null,
        log: pushLog(b.log, `${atk.name} — you hit a semicolon wall. MISS!`),
      });
      window.setTimeout(dragonCounter, 800);
      return;
    }

    const dmg = Math.round(
      (atk.min + Math.floor(Math.random() * (atk.max - atk.min + 1))) *
        (crit ? atk.critMult : 1)
    );
    const hp = Math.max(0, b.hp - dmg);
    if (crit) { sfx.crit(); shake(350); } else { sfx.advance(); }

    if (hp <= 0) {
      localStorage.setItem("pq_dragon_defeated", "1");
      setDragonDefeated(true);
      setBattle({
        ...b,
        hp: 0,
        timing: null,
        phase: "victory",
        log: pushLog(b.log, `${atk.name}${crit ? " CRIT!" : ""} -${dmg} HP. The dragon explodes into semicolons...`),
      });
      notifyNewly(track("dragon"));
      showToast("BOSS DEFEATED — THE END...?");
      sfx.achievement();
      window.setTimeout(() => setBattle(null), 6000);
      return;
    }

    let enraged = b.enraged;
    let taunt25 = b.taunt25;
    const extra: string[] = [];
    if (!enraged && hp <= 50) {
      enraged = true;
      extra.push("ENRAGE! The dragon glows crimson — MERGE CONFLICT unlocked!");
      sfx.roar();
      shake(600);
    } else if (!taunt25 && hp <= 25) {
      taunt25 = true;
      extra.push('Dragon: "25% left and it still compiles? Impossible..."');
    }
    setBattle({
      ...b,
      hp,
      enraged,
      taunt25,
      timing: null,
      log: pushLog(
        pushLog(b.log, `${atk.name}${crit ? " CRIT!" : ""} -${dmg} HP. ${atk.line}`),
        extra[0] ?? ""
      ).filter(Boolean),
    });
    window.setTimeout(dragonCounter, 900);
  };

  const startAttack = (i: number) => {
    const b = battleRef.current;
    if (!b || b.phase !== "fight" || b.timing) return;
    sfx.advance();
    const center = 22 + Math.floor(Math.random() * 56);
    setBattle({
      ...b,
      timing: { pos: 0, dir: 1, center, width: 18, atk: i },
    });
  };

  const retryBattle = () => {
    sfx.roar();
    shake(600);
    setBattle({
      hp: 100,
      playerHp: 3,
      log: ["The Debug Dragon rises again... RRAAAWR!", "Round two — time your strikes!"],
      phase: "fight",
      enraged: false,
      taunt25: false,
      timing: null,
    });
  };

  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);
  useEffect(() => { showMenuRef.current = showMenu; }, [showMenu]);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  // Day/night cycle — refresh every 10 minutes
  useEffect(() => {
    const id = setInterval(() => setPeriod(getDayPeriod()), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Fishing bar animation
  useEffect(() => {
    if (!fishing || fishing.done) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setFishing((f) => {
        if (!f || f.done) return f;
        let pos = f.pos + f.dir * dt * 75;
        let dir = f.dir;
        if (pos >= 100) { pos = 100; dir = -1; }
        if (pos <= 0) { pos = 0; dir = 1; }
        return { ...f, pos, dir };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fishing !== null, fishing?.done]);

  // Weather — random rain/storm bursts
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setWeather((w) => {
          const options =
            w === "clear"
              ? (["rain", "storm", "clear"] as const)
              : (["clear", "clear", "rain"] as const);
          return options[Math.floor(Math.random() * options.length)];
        });
        schedule();
      }, 45000 + Math.random() * 60000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // Speedrun timer
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (runStartRef.current != null) setRunTime(Date.now() - runStartRef.current);
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  // Visitor counter (Inn Keeper ledger)
  useEffect(() => {
    fetch("https://api.counterapi.dev/v1/fixdiriloe/pixel-quest-visits/up")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: unknown) => {
        const n =
          typeof j === "number"
            ? j
            : ((j as { count?: number; data?: { count?: number } })?.count ??
              (j as { data?: { count?: number } })?.data?.count);
        if (typeof n === "number") setVisitors(n);
      })
      .catch(() => {});
  }, []);

  // Pet follows player with lerp (DOM-manipulated, no re-render)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hist = historyRef.current;
      const target = hist[Math.max(0, hist.length - 2)];
      const p = petPosRef.current;
      p.x += (target.x - p.x) * 0.18;
      p.y += (target.y - p.y) * 0.18;
      if (petRef.current) {
        petRef.current.style.transform = `translate(${(p.x - offsetXRef.current) * TILE_SIZE}px, ${(p.y - offsetYRef.current) * TILE_SIZE}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scale game viewport to fit mobile screens (smaller cap on phones)
  useEffect(() => {
    const update = () => {
      const raw = (window.innerWidth - 24) / (VIEWPORT_TILES_X * TILE_SIZE);
      const cap = window.innerWidth < 640 ? 0.55 : 1;
      setScale(Math.max(0.4, Math.min(cap, raw)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const doInteract = useCallback(() => {
    // Boss battle: judge a timing strike
    const bt = battleRef.current;
    if (bt && bt.phase === "fight" && bt.timing) {
      judgeStrike();
      return;
    }
    // Fishing: hook or cancel
    if (fishingRef.current && !fishingRef.current.done) {
      const f = fishingRef.current;
      const hit = f.pos >= HOOK_ZONE.start && f.pos <= HOOK_ZONE.end;
      if (hit) {
        const fish = rollFish();
        const isNew = addFish(fish.id);
        setCaughtFish(getCaughtFish());
        notifyNewly(track("fish"));
        sfx.link();
        showToast(`CAUGHT: ${fish.name}${isNew ? " (NEW SPECIES!)" : ""}`);
        setFishing({ ...f, done: true, result: fish.name });
      } else {
        sfx.close();
        setFishing({ ...f, done: true, result: null });
      }
      setTimeout(() => setFishing(null), 1600);
      return;
    }
    if (fishingRef.current?.done) return;

    if (dialogueRef.current) {
      advanceDialogueRef.current?.();
      return;
    }
    if (interactCooldownRef.current) return;
    interactCooldownRef.current = true;
    setTimeout(() => { interactCooldownRef.current = false; }, 300);

    // Facing water? Cast a line
    const p = playerPosRef.current;
    const d = directionRef.current;
    const fx = d === "right" ? 1 : d === "left" ? -1 : 0;
    const fy = d === "down" ? 1 : d === "up" ? -1 : 0;
    const aheadTile = getTileAt(p.x + fx, p.y + fy);
    if (aheadTile === 2 || aheadTile === 13) {
      sfx.interact();
      setFishing({ pos: 0, dir: 1, done: false, result: undefined });
      return;
    }

    const entity = getNearbyEntity(
      playerPosRef.current,
      directionRef.current,
      makeActiveList(periodRef.current.night, true)
    );
    if (entity) {
      sfx.interact();
      if (entity.id === "boss-dragon") {
        sfx.roar();
        shake(600);
        setBattle({
          hp: 100,
          playerHp: 3,
          log: [
            "RRAAAWR! The Debug Dragon blocks the plaza!",
            "Time the STRIKE bar in the green — gold core = CRIT!",
          ],
          phase: "fight",
          enraged: false,
          taunt25: false,
          timing: null,
        });
        return;
      }
      let lines = entity.dialogue;
      if (entity.type !== "sign") {
        const h = bumpFriendship(entity.id);
        setHearts(h);
        if (h >= 3 && entity.secretLine) lines = [...lines, entity.secretLine];
      }
      let dlg: NPC = { ...entity, dialogue: lines };
      if (entity.id === "npc-inn") {
        const count = visitorsRef.current;
        dlg = {
          ...dlg,
          dialogue: [
            count != null
              ? `Welcome to the Pixel Inn! You are visitor #${count}.`
              : "Welcome to the Pixel Inn! The ledger is being rewritten...",
            ...dlg.dialogue.slice(1),
          ],
        };
      }
      setDialogue({ npc: dlg, lineIndex: 0 });
      notifyNewly(track("dialogue"));
      if (entity.type === "secret") notifyNewly(track("secret"));
    }
  }, []);

  useEffect(() => { interactRef.current = doInteract; }, [doInteract]);

  const toggleMenu = useCallback(() => {
    if (dialogueRef.current) { sfx.close(); setDialogue(null); return; }
    if (showMenuRef.current) { sfx.close(); setShowMenu(false); return; }
    sfx.open();
    setShowMenu(true);
  }, []);

  const bindDir = (dir: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      keysRef.current.add(dir);
    },
    onPointerUp: () => keysRef.current.delete(dir),
    onPointerCancel: () => keysRef.current.delete(dir),
    onLostPointerCapture: () => keysRef.current.delete(dir),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const movePlayer = useCallback((dx: number, dy: number, dir: Direction) => {
    setDirection(dir);
    setPlayerPos((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (isWalkable(newX, newY)) {
        setMoving(true);
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        moveTimerRef.current = setTimeout(() => setMoving(false), 100);
        const entity = getNearbyEntity(
          { x: newX, y: newY },
          dir,
          makeActiveList(periodRef.current.night, true)
        );
        setNearbyEntity(entity);
        historyRef.current.push({ x: newX, y: newY });
        if (historyRef.current.length > 20) historyRef.current.shift();
        sfx.stepOn(getTileAt(newX, newY));
        notifyNewly(track("step"));
        // Speedrun starts on first move
        if (runStartRef.current == null) {
          runStartRef.current = Date.now();
          setRunning(true);
          setRunTime(0);
        }
        // Hidden grove warp
        if (newX === 1 && newY === 1) {
          window.setTimeout(() => {
            setPlayerPos({ x: 4, y: 10 });
            showToast("DISCOVERED — HIDDEN GROVE!");
            notifyNewly(track("cartographer"));
          }, 180);
        }
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const hasDialogue = dialogueRef.current !== null;
      const hasMenu = showMenuRef.current;

      // Escape — always works
      if (key === "escape") {
        e.preventDefault();
        if (hasDialogue) { sfx.close(); setDialogue(null); return; }
        if (battleRef.current) { sfx.close(); setBattle(null); return; }
        if (hasMenu) { sfx.close(); setShowMenu(false); return; }
        sfx.open();
        setShowMenu(true);
        return;
      }

      // E / Space — interact (dialogue, fishing, NPCs)
      if ((key === "e" || key === " ") && !e.repeat) {
        e.preventDefault();
        interactRef.current?.();
        return;
      }

      // Block movement when dialogue or menu is open
      if (hasDialogue || hasMenu) return;

      if (key === "w" || key === "arrowup") { e.preventDefault(); keysRef.current.add("up"); }
      if (key === "s" || key === "arrowdown") { e.preventDefault(); keysRef.current.add("down"); }
      if (key === "a" || key === "arrowleft") { e.preventDefault(); keysRef.current.add("left"); }
      if (key === "d" || key === "arrowright") { e.preventDefault(); keysRef.current.add("right"); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "w" || key === "arrowup") keysRef.current.delete("up");
      if (key === "s" || key === "arrowdown") keysRef.current.delete("down");
      if (key === "a" || key === "arrowleft") keysRef.current.delete("left");
      if (key === "d" || key === "arrowright") keysRef.current.delete("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dialogueRef.current || showMenuRef.current) return;
      const keys = keysRef.current;
      if (keys.has("up")) movePlayer(0, -1, "up");
      else if (keys.has("down")) movePlayer(0, 1, "down");
      else if (keys.has("left")) movePlayer(-1, 0, "left");
      else if (keys.has("right")) movePlayer(1, 0, "right");
    }, 120);
    return () => clearInterval(interval);
  }, [movePlayer]);

  const handleDialogueAdvance = useCallback(() => {
    if (!dialogueRef.current) return;
    sfx.advance();
    const dlg = dialogueRef.current;
    const nextIndex = dlg.lineIndex + 1;
    if (nextIndex >= dlg.npc.dialogue.length) {
      const npc = dlg.npc;
      setDialogue(null);
      if (npc.type === "quest") {
        const urlMap: Record<string, string> = {
          "quest-kpop": "https://kpop-tracker-six.vercel.app/",
          "quest-dueldex": "https://dueldex-web.onrender.com/",
          "quest-family": "https://family-tree-delta-peach.vercel.app/",
        };
        const url = urlMap[npc.id];
        if (url) {
          sfx.link();
          setVisitLink(url);
          notifyNewly(track("link"));
          // Speedrun: quest cleared
          clearedQuestsRef.current.add(npc.id);
          localStorage.setItem(
            "pq_quests_cleared",
            JSON.stringify([...clearedQuestsRef.current])
          );
          if (clearedQuestsRef.current.size >= 3) setBossAwake(true);
          if (clearedQuestsRef.current.size >= 3 && runStartRef.current != null) {
            const elapsed = Date.now() - runStartRef.current;
            setRunning(false);
            setRunTime(elapsed);
            runStartRef.current = null;
            if (bestTime == null || elapsed < bestTime) {
              localStorage.setItem("pq_best_time", String(elapsed));
              setBestTime(elapsed);
              showToast("NEW SPEEDRUN RECORD!");
            }
            if (elapsed <= 120000) notifyNewly(track("speedrun"));
          }
        }
      }
    } else {
      setDialogue({ npc: dlg.npc, lineIndex: nextIndex });
    }
  }, [bestTime]);

  // Keep the ref pointing to the latest advance function
  useEffect(() => {
    advanceDialogueRef.current = handleDialogueAdvance;
  }, [handleDialogueAdvance]);

  // Boss battle timing bar — marker bounces like the fishing minigame
  useEffect(() => {
    if (!battle || battle.phase !== "fight" || !battle.timing) return;
    let raf = 0;
    const tick = () => {
      setBattle((cur) => {
        if (!cur || !cur.timing || cur.phase !== "fight") return cur;
        let { pos, dir } = cur.timing;
        pos += dir * 2.4;
        if (pos >= 100) { pos = 100; dir = -1; }
        if (pos <= 0) { pos = 0; dir = 1; }
        return { ...cur, timing: { ...cur.timing, pos, dir } };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [battle?.phase, battle?.timing != null]);

  const offsetX = Math.max(0, Math.min(playerPos.x - Math.floor(VIEWPORT_TILES_X / 2), MAP_WIDTH - VIEWPORT_TILES_X));
  const offsetY = Math.max(0, Math.min(playerPos.y - Math.floor(VIEWPORT_TILES_Y / 2), MAP_HEIGHT - VIEWPORT_TILES_Y));
  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;

  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  // Is the player facing water (fishable)?
  const facingWater = (() => {
    const fx = direction === "right" ? 1 : direction === "left" ? -1 : 0;
    const fy = direction === "down" ? 1 : direction === "up" ? -1 : 0;
    const t = getTileAt(playerPos.x + fx, playerPos.y + fy);
    return t === 2 || t === 13;
  })();

  useEffect(() => {
    offsetXRef.current = offsetX;
    offsetYRef.current = offsetY;
  });

  return (
    <div className="flex flex-col items-center">
      {/* Scaled game viewport (fits mobile screens) */}
      <div
        ref={viewportFrameRef}
        className="relative mx-auto"
        style={{ width: viewportWidth * scale, height: viewportHeight * scale }}
      >
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-border focus:outline-none focus:border-gold/50"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          imageRendering: "pixelated",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          boxShadow: "0 0 0 1px rgba(212,168,71,0.15), 0 8px 32px rgba(0,0,0,0.55), inset 0 0 48px rgba(8,12,20,0.3)",
        }}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      >
        {/* Tile map */}
        <div className="absolute" style={{ left: -offsetX * TILE_SIZE, top: -offsetY * TILE_SIZE }}>
          {Array.from({ length: MAP_HEIGHT }).map((_, y) => (
            <div key={y} className="flex">
              {Array.from({ length: MAP_WIDTH }).map((_, x) => (
                <TileSprite key={`${x}-${y}`} type={mapData[y]?.[x] ?? 0} x={x} y={y} />
              ))}
            </div>
          ))}
        </div>

        {/* NPCs (night-aware schedule) */}
        {makeActiveList(period.night, true).map((npc) => {
          const nx = (npc.position.x - offsetX) * TILE_SIZE;
          const ny = (npc.position.y - offsetY) * TILE_SIZE;
          if (nx < -TILE_SIZE || ny < -TILE_SIZE || nx > viewportWidth || ny > viewportHeight) return null;
          return (
            <div key={npc.id} style={{ position: "absolute", left: nx, top: ny }}>
              <NPCSprite
                npc={npc}
                isNearby={nearbyEntity?.id === npc.id}
                enraged={!!(battle?.enraged && npc.id === "boss-dragon")}
              />
            </div>
          );
        })}

        {/* Player */}
        <div className="absolute" style={{ left: (playerPos.x - offsetX) * TILE_SIZE, top: (playerPos.y - offsetY) * TILE_SIZE }}>
          <PlayerSprite moving={moving} />
        </div>

        {/* Pet slime companion */}
        <div
          ref={petRef}
          className="absolute top-0 left-0 z-[9] pointer-events-none flex items-end justify-center"
          style={{ width: TILE_SIZE, height: TILE_SIZE }}
        >
          <svg
            width="26"
            height="20"
            viewBox="0 0 16 12"
            className="pet-bounce"
            style={{ imageRendering: "pixelated", marginBottom: 2 }}
          >
            <rect x="5" y="2" width="6" height="1" fill="#5ec26a" />
            <rect x="3" y="3" width="10" height="1" fill="#5ec26a" />
            <rect x="2" y="4" width="12" height="5" fill="#5ec26a" />
            <rect x="1" y="8" width="14" height="2" fill="#5ec26a" />
            <rect x="2" y="10" width="12" height="1" fill="#3a8f48" />
            <rect x="4" y="3" width="4" height="1" fill="#8de08a" />
            <rect x="3" y="4" width="3" height="1" fill="#8de08a" />
            <rect x="3" y="8" width="10" height="1" fill="#3a8f48" />
            <rect x="5" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="6" y="6" width="1" height="1" fill="#1a2438" />
            <rect x="10" y="6" width="1" height="1" fill="#1a2438" />
            <rect x="7" y="8" width="2" height="1" fill="#2a6a2a" />
          </svg>
        </div>

        {/* Day/night tint (based on real local time) */}
        <div
          className="absolute inset-0 pointer-events-none z-[14]"
          style={{ background: period.overlay, transition: "background 2s ease" }}
        />

        {/* Atmosphere: warm light + vignette + scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-[15]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(8,12,20,0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[15]"
          style={{
            background: "linear-gradient(160deg, rgba(255,220,140,0.07) 0%, transparent 40%)",
          }}
        />
        <div className="scanlines absolute inset-0 pointer-events-none z-[15]" />

        {/* Fireflies (brighter at night) */}
        <div
          className="absolute inset-0 pointer-events-none z-[16] overflow-hidden"
          style={{ opacity: period.night ? 1 : 0.45, transition: "opacity 2s ease" }}
        >
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="firefly"
              style={{
                left: f.left,
                top: f.top,
                background: f.color,
                boxShadow: `0 0 6px 1px ${f.color}aa`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Minimap */}
        <Minimap
          player={playerPos}
          npcs={makeActiveList(period.night, true)
            .filter((n) => n.type !== "secret")
            .map((n) => ({ id: n.id, x: n.position.x, y: n.position.y, type: n.type }))}
        />

        {/* Speedrun timer + fish log */}
        <div className="absolute top-2 left-2 z-[17] game-border rounded px-2 py-1 bg-bg-main/80 flex items-center gap-2">
          <span className="retro-font text-[5px] text-text-secondary">TIME</span>
          <span className="retro-font text-[7px] text-gold">{fmtTime(runTime)}</span>
          {bestTime != null && (
            <>
              <span className="retro-font text-[5px] text-text-secondary">BEST</span>
              <span className="retro-font text-[6px] text-xp">{fmtTime(bestTime)}</span>
            </>
          )}
          {caughtFish.length > 0 && (
            <span className="retro-font text-[5px] text-cyan">
              🎣 {caughtFish.length}/{FISH.length}
            </span>
          )}
        </div>

        {/* Weather */}
        {weather !== "clear" && (
          <div
            className="absolute inset-0 pointer-events-none z-[16] overflow-hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="raindrop"
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 12) * 0.09}s`,
                  animationDuration: `${0.55 + (i % 5) * 0.07}s`,
                }}
              />
            ))}
          </div>
        )}
        {weather === "storm" && (
          <div className="lightning absolute inset-0 pointer-events-none z-[16]" aria-hidden="true" />
        )}

        {/* Pixel corner accents on viewport frame */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-[3px] border-l-[3px] border-gold/70" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-[3px] border-r-[3px] border-gold/70" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[3px] border-l-[3px] border-gold/70" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[3px] border-r-[3px] border-gold/70" />
        </div>

        {/* Interaction prompt */}
        {nearbyEntity && !dialogue && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <motion.div
              className="dialogue-box rounded-lg px-4 py-2 flex items-center gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="retro-font text-[8px] px-2 py-0.5 bg-gold/20 border border-gold/50 rounded text-gold font-bold">
                E
              </span>
              <span className="retro-font text-[7px] text-cream">
                Talk to {nearbyEntity.name}
              </span>
            </motion.div>
          </div>
        )}
        {!nearbyEntity && !dialogue && facingWater && !fishing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <motion.div
              className="dialogue-box rounded-lg px-4 py-2 flex items-center gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="retro-font text-[8px] px-2 py-0.5 bg-gold/20 border border-gold/50 rounded text-gold font-bold">
                E
              </span>
              <span className="retro-font text-[7px] text-cream">Cast a line</span>
            </motion.div>
          </div>
        )}
      </div>
      </div>

      {/* Dialogue — above touch controls so it's visible on mobile */}
      <AnimatePresence>
        {dialogue && (
          <motion.div className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <NPCPortrait npc={dialogue.npc} size={36} />
                <span className="pixel-font text-[9px] text-gold">{dialogue.npc.name}</span>
                {dialogue.npc.type !== "sign" && (
                  <span
                    className="retro-font text-[6px] text-hp"
                    title={`Friendship ${hearts}/5`}
                  >
                    {heartsLabel(hearts)}
                  </span>
                )}
              </div>
              <button onClick={() => setDialogue(null)}
                className="retro-font text-[6px] text-text-secondary hover:text-cream px-1.5 py-0.5 border border-border hover:border-gold/40 rounded transition-all"
                aria-label="Close dialogue">✕</button>
            </div>
            <p className="text-sm text-cream leading-relaxed mb-3">{dialogue.npc.dialogue[dialogue.lineIndex]}</p>
            <div className="flex items-center justify-between">
              <span className="retro-font text-[5px] text-text-secondary">
                {dialogue.lineIndex + 1} / {dialogue.npc.dialogue.length}
              </span>
              <button onClick={handleDialogueAdvance}
                className="retro-font text-[6px] text-gold animate-blink hover:text-accent transition-colors cursor-pointer px-3 py-2 -my-2">
                ▶ PRESS E
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fishing minigame */}
      <AnimatePresence>
        {fishing && (
          <motion.div className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="pixel-font text-[9px] text-cyan">🎣 FISHING</span>
              <span className="retro-font text-[5px] text-text-secondary">
                {caughtFish.length}/{FISH.length} SPECIES
              </span>
            </div>
            {fishing.done ? (
              <p className="text-sm text-cream">
                {fishing.result ? `You caught a ${fishing.result}!` : "It got away..."}
              </p>
            ) : (
              <>
                <div className="relative h-5 bg-bg-main border-2 border-border rounded-sm overflow-hidden mb-2">
                  <div
                    className="absolute inset-y-0 bg-xp/20 border-x border-xp/50"
                    style={{ left: `${HOOK_ZONE.start}%`, width: `${HOOK_ZONE.end - HOOK_ZONE.start}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-1 bg-gold"
                    style={{ left: `calc(${fishing.pos}% - 2px)`, boxShadow: "0 0 6px #d4a847" }}
                  />
                </div>
                <p className="retro-font text-[6px] text-text-secondary text-center">
                  PRESS / TAP E WHEN THE MARKER IS IN THE GREEN
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss battle — JRPG-style battle box */}
      <AnimatePresence>
        {battle && (
          <motion.div
            className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {/* Victory confetti */}
            {battle.phase === "victory" &&
              Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className="confetti-bit"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    animationDelay: `${(i % 8) * 0.12}s`,
                    animationDuration: `${1.2 + (i % 5) * 0.2}s`,
                  }}
                />
              ))}

            {/* Dragon name + HP */}
            <div className="flex items-center justify-between mb-1">
              <span className="pixel-font text-[9px] text-hp">
                🐉 DEBUG DRAGON
                {battle.enraged && (
                  <span className="retro-font text-[6px] text-red-400 ml-2 animate-pulse">
                    (ENRAGED)
                  </span>
                )}
              </span>
              <span className="retro-font text-[6px] text-hp">{battle.hp}/100 HP</span>
            </div>
            <div className="h-3 bg-bg-main border-2 border-border rounded-sm overflow-hidden mb-2">
              <div
                className={
                  battle.enraged
                    ? "h-full bg-gradient-to-r from-orange-500 to-hp transition-[width] duration-300"
                    : "h-full bg-gradient-to-r from-hp to-red-400 transition-[width] duration-300"
                }
                style={{ width: `${battle.hp}%` }}
              />
            </div>

            {/* Sprites facing off */}
            <div
              className="flex items-end justify-between px-6 py-2 bg-bg-main/50 border border-border rounded mb-2"
              style={{ minHeight: 68 }}
            >
              <BossDragonMini enraged={battle.enraged} />
              <PlayerSprite moving={false} />
            </div>

            {/* Player hearts */}
            <div className="flex items-center justify-between mb-2">
              <span className="retro-font text-[5px] text-text-secondary">HERO</span>
              <span className="retro-font text-[8px] text-hp tracking-widest">
                {"♥".repeat(battle.playerHp)}
                {"♡".repeat(Math.max(0, 3 - battle.playerHp))}
              </span>
            </div>

            {/* Battle log — last 3 lines */}
            <div className="space-y-0.5 mb-2 min-h-[42px] bg-bg-main/40 border border-border/60 rounded p-2">
              {battle.log.map((l, i) => (
                <p key={`${i}-${l.slice(0, 8)}`} className="text-xs text-cream leading-snug">
                  {l}
                </p>
              ))}
            </div>

            {/* Actions */}
            {battle.phase === "fight" && !battle.timing && (
              <div className="grid grid-cols-3 gap-2">
                {BATTLE_ATTACKS.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => startAttack(i)}
                    className="game-btn text-[5px] py-2 leading-tight"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
            {battle.phase === "fight" && battle.timing && (
              <div>
                <div className="relative h-5 bg-bg-main border-2 border-border rounded-sm overflow-hidden mb-1">
                  <div
                    className="absolute inset-y-0 bg-xp/25 border-x border-xp/60"
                    style={{
                      left: `${battle.timing.center - battle.timing.width / 2}%`,
                      width: `${battle.timing.width}%`,
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-xp/60 border-x border-xp"
                      style={{ width: "35%" }}
                    />
                  </div>
                  <div
                    className="absolute inset-y-0 w-1 bg-gold"
                    style={{
                      left: `calc(${battle.timing.pos}% - 2px)`,
                      boxShadow: "0 0 6px #d4a847",
                    }}
                  />
                </div>
                <p className="retro-font text-[5px] text-text-secondary text-center mb-1.5">
                  PRESS E / TAP STRIKE IN THE GREEN — GOLD CORE = CRIT ×2
                </p>
                <button onClick={judgeStrike} className="game-btn w-full text-[7px] py-2">
                  STRIKE!
                </button>
              </div>
            )}
            {battle.phase === "gameover" && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={retryBattle} className="game-btn text-[7px] py-2">
                  RETRY
                </button>
                <button
                  onClick={() => setBattle(null)}
                  className="retro-font text-[7px] text-text-secondary hover:text-cream px-3 py-2 border border-border rounded transition-colors"
                >
                  FLEE
                </button>
              </div>
            )}
            {battle.phase === "victory" && (
              <p className="retro-font text-[8px] text-gold text-center animate-blink">
                THE END...?
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit link */}
      <AnimatePresence>
        {visitLink && (
          <motion.div className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full text-center"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <p className="retro-font text-[7px] text-gold mb-3">Open this quest's live demo?</p>
            <div className="flex gap-3 justify-center">
              <a href={visitLink} target="_blank" rel="noopener noreferrer" className="game-btn text-[7px]"
                onClick={() => setVisitLink(null)}>VISIT SITE</a>
              <button className="retro-font text-[7px] text-text-secondary hover:text-cream px-3 py-1 border border-border rounded transition-colors"
                onClick={() => setVisitLink(null)}>CLOSE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile touch controls */}
      <div
        className="lg:hidden w-full max-w-[544px] mx-auto mt-3 px-2 select-none"
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center justify-between">
          {/* D-pad */}
          <div className="relative w-[124px] h-[124px]">
            <button className="dpad-btn left-1/2 -translate-x-1/2 top-0" aria-label="Move up" {...bindDir("up")}>▲</button>
            <button className="dpad-btn left-1/2 -translate-x-1/2 bottom-0" aria-label="Move down" {...bindDir("down")}>▼</button>
            <button className="dpad-btn top-1/2 -translate-y-1/2 left-0" aria-label="Move left" {...bindDir("left")}>◀</button>
            <button className="dpad-btn top-1/2 -translate-y-1/2 right-0" aria-label="Move right" {...bindDir("right")}>▶</button>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded border-2 border-border/60 bg-bg-elevated/60" />
          </div>
          {/* Action buttons */}
          <div className="flex flex-col gap-3 items-center">
            <button
              className="dpad-btn dpad-static dpad-round w-14 h-14 text-[9px] text-gold border-gold/70"
              aria-label="Interact"
              onClick={() => interactRef.current?.()}
            >
              E
            </button>
            <button
              className="dpad-btn dpad-static w-14 h-10 text-[6px]"
              aria-label="Open menu"
              onClick={toggleMenu}
            >
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* Controls hint (desktop) */}
      <div className="hidden lg:flex gap-4 mt-2 retro-font text-[6px] text-text-secondary/50">
        <span>WASD / Arrows — Move</span>
        <span>E / Space — Interact</span>
        <span>ESC — Menu</span>
      </div>

      {/* Pause menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-bg-main/70" onClick={() => setShowMenu(false)} />
            <div className="dialogue-box rounded-lg p-5 relative z-10 min-w-[200px]">
              <h3 className="pixel-font text-[11px] text-gold mb-4 text-center">PAUSE MENU</h3>
              <div className="space-y-2">
                {[
                  { label: "RESUME", action: () => setShowMenu(false) },
                  {
                    label: `JUKEBOX: ${getBgmTrackName()}`,
                    action: () => {
                      cycleBgmTrack();
                      showToast(`NOW PLAYING — ${getBgmTrackName()}`);
                    },
                  },
                  { label: "PROJECTS", href: "#projects" },
                  { label: "SKILLS", href: "#skills" },
                  { label: "CV DOWNLOAD", href: "#about" },
                  { label: "CONTACT", href: "#contact" },
                  { label: "EXIT TO PORTFOLIO", href: "#home" },
                ].map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href} className="block text-center game-btn text-[8px] py-2.5 w-full"
                      onClick={() => setShowMenu(false)}>{item.label}</a>
                  ) : (
                    <button key={item.label} className="block text-center game-btn text-[8px] py-2.5 w-full"
                      onClick={item.action}>{item.label}</button>
                  )
                )}
              </div>
              <p className="retro-font text-[5px] text-text-secondary/40 text-center mt-3">ESC to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}