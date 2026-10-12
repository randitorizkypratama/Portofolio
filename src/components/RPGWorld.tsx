import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
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
import { track, subscribe } from "../game/achievements";
import { notifyNewly, showToast } from "../game/toast";
import { getDayPeriod, type DayPeriod } from "../game/dayNight";
import { FISH, HOOK_ZONE, addFish, rollFish, getCaughtFish } from "../game/fishing";
import { cycleBgmTrack, getBgmTrackName } from "../game/music";
import { bumpFriendship, heartsLabel, getTotalHearts } from "../game/friendship";
import {
  ITEMS,
  addItem,
  removeItem,
  getInventory,
  getOpened,
  markOpened,
} from "../game/inventory";
import { getTitle } from "../game/titles";
import { plotStage, plantPlot, waterPlot, harvestPlot } from "../game/garden";
import { getGold, addGold, subscribeGold } from "../game/gold";
import { getLevel, levelProgress } from "../game/level";
import { Minimap } from "./Minimap";
import { NPCPortrait } from "./NPCPortrait";
import { TypewriterText } from "./TypewriterText";
import { CrystalCave } from "./CrystalCave";

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

// Phones get fewer particles — half the DOM nodes, half the compositor work
const IS_SMALL = typeof window !== "undefined" && window.innerWidth < 768;

// Daytime pollen motes
const POLLEN = Array.from({ length: IS_SMALL ? 4 : 10 }, (_, i) => ({
  left: `${(i * 29 + 7) % 100}%`,
  top: `${(i * 43 + 10) % 80}%`,
  delay: (i * 0.9) % 5,
  duration: 7 + (i % 4) * 1.5,
  color: i % 3 === 0 ? "#d8e8a0" : "#e8e0a0",
}));

// Village lamps (world tile coords) — light up at night
const LAMPS: { x: number; y: number }[] = [
  { x: 14, y: 4 },
  { x: 8, y: 10 },
  { x: 20, y: 10 },
  { x: 14, y: 18 },
];

// Fountain center in world coords (tile 13 cluster near top)
const FOUNTAIN = { x: 14, y: 1 };

// Smooth camera + entity glide (keep durations in sync)
const GLIDE = "left 0.14s ease-out, top 0.14s ease-out";

// Pixel-art tile renderer (SVG data-URI backgrounds) — memoized: props never change for a given tile
const TileSprite = memo(function TileSprite({ type, x, y }: { type: number; x: number; y: number }) {
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
});

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

// Detailed pixel-art player (32x32, 16-bit shaded)
function PlayerSprite({ moving, swimming, riding }: { moving: boolean; swimming?: boolean; riding?: boolean }) {
  if (swimming) {
    return (
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{ width: TILE_SIZE, height: TILE_SIZE }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="swim-bob"
          style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}
        >
          {/* wake ripples */}
          <rect x="3" y="20" width="26" height="2" fill="#7ec8f0" opacity="0.75" />
          <rect x="7" y="23" width="18" height="1" fill="#a8d8f8" opacity="0.6" />
          <rect x="1" y="17" width="30" height="3" fill="#2a6cbe" />
          <rect x="1" y="17" width="30" height="1" fill="#3d86d6" />
          {/* head above water */}
          <rect x="11" y="5" width="10" height="2" fill="#2a2a38" />
          <rect x="12" y="5" width="5" height="1" fill="#45455c" />
          <rect x="10" y="6" width="12" height="3" fill="#2a2a38" />
          <rect x="11" y="8" width="10" height="5" fill="#f0c8a0" />
          <rect x="11" y="11" width="10" height="2" fill="#e0b088" />
          <rect x="11" y="8" width="10" height="2" fill="#2a2a38" />
          <rect x="11" y="10" width="2" height="1" fill="#2a2a38" />
          <rect x="19" y="10" width="2" height="1" fill="#2a2a38" />
          <rect x="13" y="10" width="2" height="2" fill="#1a2438" />
          <rect x="17" y="10" width="2" height="2" fill="#1a2438" />
          <rect x="13" y="10" width="1" height="1" fill="#e8f0ff" />
          <rect x="17" y="10" width="1" height="1" fill="#e8f0ff" />
          <rect x="11" y="12" width="2" height="1" fill="#f0a088" />
          <rect x="19" y="12" width="2" height="1" fill="#f0a088" />
          {/* paddling arms */}
          <rect x="6" y="15" width="5" height="2" fill="#f0c8a0" />
          <rect x="21" y="15" width="5" height="2" fill="#e0b088" />
          <rect x="5" y="16" width="2" height="1" fill="#3d3d72" />
          <rect x="25" y="16" width="2" height="1" fill="#33335e" />
        </svg>
      </div>
    );
  }
  if (riding) {
    return (
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{ width: TILE_SIZE, height: TILE_SIZE }}
      >
        <EntityShadow size={26} />
        <svg
          width="36"
          height="34"
          viewBox="0 0 36 34"
          className="pet-bounce"
          style={{ imageRendering: "pixelated", position: "relative", zIndex: 1, overflow: "visible", marginBottom: -2 }}
        >
          {/* big slime mount */}
          <rect x="10" y="14" width="16" height="2" fill="#2d7a38" />
          <rect x="7" y="16" width="22" height="2" fill="#5ec26a" />
          <rect x="6" y="18" width="24" height="8" fill="#5ec26a" />
          <rect x="5" y="24" width="26" height="3" fill="#5ec26a" />
          <rect x="4" y="27" width="28" height="3" fill="#5ec26a" />
          <rect x="4" y="29" width="28" height="1" fill="#3a8f48" />
          <rect x="6" y="27" width="24" height="1" fill="#3a8f48" />
          <rect x="8" y="17" width="8" height="2" fill="#a8e8a0" />
          <rect x="7" y="19" width="4" height="1" fill="#a8e8a0" />
          {/* slime face */}
          <rect x="12" y="21" width="3" height="3" fill="#ffffff" />
          <rect x="21" y="21" width="3" height="3" fill="#ffffff" />
          <rect x="13" y="22" width="2" height="2" fill="#1a2438" />
          <rect x="22" y="22" width="2" height="2" fill="#1a2438" />
          <rect x="13" y="22" width="1" height="1" fill="#e8f0ff" />
          <rect x="22" y="22" width="1" height="1" fill="#e8f0ff" />
          <rect x="16" y="25" width="4" height="1" fill="#2a6a2a" />
          <rect x="15" y="24" width="1" height="1" fill="#2a6a2a" />
          <rect x="20" y="24" width="1" height="1" fill="#2a6a2a" />
          {/* rider — player sitting on top */}
          <rect x="13" y="1" width="10" height="2" fill="#2a2a38" />
          <rect x="14" y="1" width="5" height="1" fill="#45455c" />
          <rect x="12" y="2" width="12" height="3" fill="#2a2a38" />
          <rect x="13" y="4" width="10" height="5" fill="#f0c8a0" />
          <rect x="13" y="7" width="10" height="2" fill="#e0b088" />
          <rect x="13" y="4" width="10" height="2" fill="#2a2a38" />
          <rect x="15" y="6" width="2" height="2" fill="#1a2438" />
          <rect x="19" y="6" width="2" height="2" fill="#1a2438" />
          <rect x="15" y="6" width="1" height="1" fill="#e8f0ff" />
          <rect x="19" y="6" width="1" height="1" fill="#e8f0ff" />
          <rect x="12" y="9" width="12" height="3" fill="#d4a847" />
          <rect x="12" y="9" width="12" height="1" fill="#e8c86a" />
          <rect x="10" y="11" width="16" height="3" fill="#3d3d72" />
          <rect x="9" y="12" width="2" height="2" fill="#f0c8a0" />
          <rect x="25" y="12" width="2" height="2" fill="#e0b088" />
          {/* dangling feet */}
          <rect x="10" y="14" width="3" height="2" fill="#25253f" />
          <rect x="23" y="14" width="3" height="2" fill="#25253f" />
        </svg>
      </div>
    );
  }
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
      <EntityShadow size={22} />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className={moving ? "" : "player-idle"}
        style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}
      >
        {/* Hair */}
        <rect x="9" y="3" width="14" height="6" fill="#2a2a38" />
        <rect x="10" y="2" width="12" height="2" fill="#2a2a38" />
        <rect x="11" y="2" width="6" height="1" fill="#45455c" />
        <rect x="10" y="4" width="3" height="1" fill="#45455c" />
        <rect x="18" y="5" width="2" height="1" fill="#45455c" />
        <rect x="21" y="3" width="2" height="2" fill="#1a1a28" />
        {/* Side hair */}
        <rect x="9" y="6" width="2" height="4" fill="#2a2a38" />
        <rect x="21" y="6" width="2" height="4" fill="#1e1e2c" />
        {/* Face */}
        <rect x="11" y="7" width="10" height="6" fill="#f0c8a0" />
        <rect x="11" y="11" width="10" height="2" fill="#e0b088" />
        {/* Bangs */}
        <rect x="11" y="7" width="10" height="2" fill="#2a2a38" />
        <rect x="11" y="9" width="2" height="1" fill="#2a2a38" />
        <rect x="19" y="9" width="2" height="1" fill="#2a2a38" />
        {/* Eyes with glint */}
        <rect x="13" y="9" width="2" height="2" fill="#1a2438" />
        <rect x="17" y="9" width="2" height="2" fill="#1a2438" />
        <rect x="13" y="9" width="1" height="1" fill="#e8f0ff" />
        <rect x="17" y="9" width="1" height="1" fill="#e8f0ff" />
        {/* Blush */}
        <rect x="11" y="11" width="2" height="1" fill="#f0a088" />
        <rect x="19" y="11" width="2" height="1" fill="#f0a088" />
        {/* Neck */}
        <rect x="14" y="13" width="4" height="2" fill="#e0b088" />
        {/* Scarf */}
        <rect x="10" y="14" width="12" height="3" fill="#d4a847" />
        <rect x="10" y="14" width="12" height="1" fill="#e8c86a" />
        <rect x="10" y="16" width="12" height="1" fill="#b88e35" />
        <rect x="22" y="16" width="2" height="4" fill="#d4a847" />
        <rect x="22" y="16" width="1" height="4" fill="#e8c86a" />
        <rect x="22" y="19" width="2" height="1" fill="#b88e35" />
        {/* Hoodie */}
        <rect x="8" y="17" width="16" height="2" fill="#2f2f5a" />
        <rect x="8" y="18" width="16" height="8" fill="#3d3d72" />
        <rect x="6" y="19" width="2" height="6" fill="#3d3d72" />
        <rect x="24" y="19" width="2" height="6" fill="#33335e" />
        <rect x="8" y="24" width="16" height="2" fill="#33335e" />
        <rect x="10" y="17" width="12" height="1" fill="#4a4a88" />
        {/* Pocket + drawstrings */}
        <rect x="12" y="22" width="8" height="3" fill="#33335e" />
        <rect x="12" y="22" width="8" height="1" fill="#2f2f5a" />
        <rect x="14" y="18" width="1" height="3" fill="#e8e8f0" />
        <rect x="17" y="18" width="1" height="3" fill="#e8e8f0" />
        <rect x="14" y="21" width="1" height="1" fill="#d4a847" />
        <rect x="17" y="21" width="1" height="1" fill="#d4a847" />
        {/* Hands */}
        <rect x="6" y="25" width="2" height="2" fill="#f0c8a0" />
        <rect x="24" y="25" width="2" height="2" fill="#e0b088" />
        {/* Legs */}
        <rect x="10" y="26" width="4" height="3" fill="#25253f" />
        <rect x="18" y="26" width="4" height="3" fill="#25253f" />
        <rect x="12" y="26" width="2" height="3" fill="#1e1e30" />
        <rect x="20" y="26" width="2" height="3" fill="#1e1e30" />
        {/* Shoes */}
        <rect x="9" y="29" width="5" height="2" fill="#5c3a1e" />
        <rect x="18" y="29" width="5" height="2" fill="#5c3a1e" />
        <rect x="9" y="29" width="5" height="1" fill="#7a5430" />
        <rect x="18" y="29" width="5" height="1" fill="#7a5430" />
        <rect x="9" y="31" width="5" height="1" fill="#3a2510" />
        <rect x="18" y="31" width="5" height="1" fill="#3a2510" />
      </svg>
    </div>
  );
}

// Detailed pixel-art NPC (16x16)
function NPCSprite({
  npc,
  isNearby,
  enraged,
  opened,
}: {
  npc: NPC;
  isNearby: boolean;
  enraged?: boolean;
  opened?: boolean;
}) {
  return (
    <div className="absolute flex items-center justify-center" style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      <EntityShadow size={npc.id === "boss-dragon" ? 28 : npc.type === "quest" ? 22 : 18} />

      {/* Nameplate when the player is near */}
      {isNearby && npc.type !== "garden" && (
        <span className="nameplate">{npc.name}</span>
      )}

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
        width="32"
        height="32"
        viewBox="0 0 16 16"
        className="npc-idle"
        style={{
          imageRendering: "pixelated",
          position: "relative",
          zIndex: 1,
          animationDelay: `${(npc.id.charCodeAt(npc.id.length - 1) % 8) * 0.35}s`,
        }}
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
        ) : npc.type === "chest" ? (
          opened ? (
            <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}>
              <rect x="1" y="2" width="14" height="2" fill="#a5794a" />
              <rect x="2" y="4" width="12" height="9" fill="#8b5a2b" />
              <rect x="3" y="5" width="10" height="5" fill="#2a1a0a" />
              <rect x="3" y="5" width="10" height="1" fill="#5c3a1e" />
              <rect x="2" y="12" width="12" height="1" fill="#5c3a1e" />
              <rect x="7" y="9" width="2" height="3" fill="#d4a847" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}>
              <rect x="2" y="4" width="12" height="3" fill="#a5794a" />
              <rect x="2" y="4" width="12" height="1" fill="#c08a4a" />
              <rect x="2" y="7" width="12" height="6" fill="#8b5a2b" />
              <rect x="2" y="8" width="12" height="1" fill="#5c3a1e" />
              <rect x="7" y="7" width="2" height="4" fill="#d4a847" />
              <rect x="7" y="8" width="2" height="1" fill="#f0d78c" />
            </svg>
          )
        ) : npc.type === "shrine" ? (
          <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}>
            <rect x="3" y="13" width="10" height="2" fill="#6e7a87" />
            <rect x="4" y="12" width="8" height="1" fill="#8a97a4" />
            <rect x="5" y="3" width="6" height="9" fill="#9aa5b1" />
            <rect x="5" y="3" width="6" height="1" fill="#b8c2cc" />
            <rect x="4" y="2" width="8" height="1" fill="#8a97a4" />
            <rect x="7" y="5" width="2" height="5" fill="#5bb8c9" />
            <rect x="7" y="5" width="1" height="2" fill="#a8e8f8" />
          </svg>
        ) : npc.type === "portal" ? (
          <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            className="portal-sprite"
            style={{ imageRendering: "pixelated", position: "relative", zIndex: 1, overflow: "visible" }}
          >
            <rect x="6" y="0" width="4" height="1" fill="#9b59b6" />
            <rect x="5" y="1" width="6" height="1" fill="#8e44ad" />
            <rect x="4" y="2" width="8" height="2" fill="#9b59b6" />
            <rect x="3" y="4" width="10" height="8" fill="#8e44ad" />
            <rect x="4" y="12" width="8" height="2" fill="#9b59b6" />
            <rect x="5" y="14" width="6" height="1" fill="#8e44ad" />
            <rect x="6" y="15" width="4" height="1" fill="#9b59b6" />
            <rect x="5" y="4" width="6" height="8" fill="#2a1a3a" />
            <rect x="6" y="5" width="4" height="6" fill="#3d2a52" />
            <rect x="7" y="6" width="2" height="4" fill="#5bb8c9" />
            <rect x="7" y="6" width="1" height="2" fill="#a8e8f8" />
            <rect x="10" y="3" width="1" height="1" fill="#d4a847" />
            <rect x="5" y="12" width="1" height="1" fill="#d4a847" />
          </svg>
        ) : npc.type === "pumpkin" ? (
          <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            className="pumpkin-sprite"
            style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}
          >
            <rect x="7" y="2" width="2" height="3" fill="#27ae60" />
            <rect x="8" y="2" width="1" height="2" fill="#2ecc71" />
            <rect x="5" y="5" width="6" height="9" fill="#f39c12" />
            <rect x="4" y="6" width="1" height="7" fill="#e67e22" />
            <rect x="11" y="6" width="1" height="7" fill="#e67e22" />
            <rect x="6" y="5" width="1" height="9" fill="#e67e22" />
            <rect x="9" y="5" width="1" height="9" fill="#e67e22" />
            <rect x="6" y="8" width="1" height="2" fill="#1a2438" />
            <rect x="9" y="8" width="1" height="2" fill="#1a2438" />
            <rect x="7" y="11" width="2" height="1" fill="#1a2438" />
            <rect x="6" y="10" width="1" height="1" fill="#1a2438" />
            <rect x="10" y="10" width="1" height="1" fill="#1a2438" />
          </svg>
        ) : npc.type === "garden" ? (
          (() => {
            const stage = plotStage(npc.id);
            return (
              <>
                {/* Tilled soil */}
                <rect x="1" y="10" width="14" height="5" fill="#6b4423" />
                <rect x="1" y="10" width="14" height="1" fill="#7d5230" />
                <rect x="2" y="12" width="3" height="1" fill="#54331a" />
                <rect x="7" y="12" width="3" height="1" fill="#54331a" />
                <rect x="12" y="12" width="2" height="1" fill="#54331a" />
                {stage !== "empty" && (
                  <rect x="7" y="6" width="2" height="4" fill="#3a8f48" />
                )}
                {stage === "seed" && (
                  <>
                    <rect x="6" y="9" width="1" height="1" fill="#d4a847" />
                    <rect x="9" y="9" width="1" height="1" fill="#d4a847" />
                  </>
                )}
                {stage === "sprout" && (
                  <>
                    <rect x="5" y="5" width="3" height="2" fill="#5ec26a" />
                    <rect x="8" y="4" width="3" height="3" fill="#5ec26a" />
                    <rect x="5" y="5" width="2" height="1" fill="#8de08a" />
                  </>
                )}
                {stage === "ready" && (
                  <>
                    <rect x="4" y="3" width="3" height="3" fill="#5ec26a" />
                    <rect x="9" y="3" width="3" height="3" fill="#5ec26a" />
                    <rect x="6" y="1" width="4" height="3" fill="#e74c3c" />
                    <rect x="6" y="1" width="4" height="1" fill="#c0392b" />
                    <rect x="7" y="2" width="1" height="1" fill="#ff8a7a" />
                  </>
                )}
              </>
            );
          })()
        ) : npc.type === "cave" ? (
          <>
            {/* Rock mound */}
            <rect x="1" y="8" width="14" height="7" fill="#4a5560" />
            <rect x="1" y="8" width="14" height="1" fill="#5c6874" />
            <rect x="2" y="6" width="12" height="2" fill="#5c6874" />
            <rect x="4" y="4" width="8" height="2" fill="#6e7a87" />
            {/* Dark entrance */}
            <rect x="5" y="9" width="6" height="6" fill="#0a0e14" />
            <rect x="5" y="9" width="6" height="1" fill="#1a2438" />
            {/* Crystal glints */}
            <rect x="3" y="10" width="1" height="2" fill="#5bb8c9" />
            <rect x="12" y="11" width="1" height="2" fill="#9b59b6" />
            <rect x="11" y="7" width="1" height="1" fill="#a8e8f8" />
          </>
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
  phase: "intro" | "fight" | "victory" | "gameover";
  enraged: boolean;
  taunt25: boolean;
  busy: boolean;
  itemMenu: boolean;
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

const isHalloween = () => new Date().getMonth() === 9;

const SHRINES = [
  { id: "shrine-west", name: "West Grove Stone", spawn: { x: 2, y: 4 } },
  { id: "shrine-east", name: "East Gate Stone", spawn: { x: 26, y: 12 } },
  { id: "shrine-south", name: "South Inn Stone", spawn: { x: 23, y: 20 } },
];

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
  const [inv, setInv] = useState<Record<string, number>>(() => getInventory());
  const [openedLoot, setOpenedLoot] = useState<Set<string>>(() => getOpened());
  const [teleportFrom, setTeleportFrom] = useState<NPC | null>(null);
  const [playerTitle] = useState(() => getTitle());
  const [puffs, setPuffs] = useState<{ id: number; x: number; y: number }[]>([]);
  const puffIdRef = useRef(0);
  const [swimming, setSwimming] = useState(false);
  const [riding, setRiding] = useState(false);
  const [rideUnlocked, setRideUnlocked] = useState(() => getTotalHearts() >= 10);
  const [showCave, setShowCave] = useState(false);
  const [, setGardenTick] = useState(0);
  const [gold, setGold] = useState(() => getGold());
  const [level, setLevel] = useState(() => getLevel());
  const [expPct, setExpPct] = useState(() => levelProgress());
  const [floats, setFloats] = useState<{ id: number; text: string; color: string; x: number; y: number }[]>([]);
  const floatIdRef = useRef(0);
  const levelRef = useRef(level);
  const swimmingRef = useRef(false);
  const ridingRef = useRef(false);
  const rideUnlockedRef = useRef(rideUnlocked);
  const lastMoveRef = useRef(0);

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
  const caveOpenRef = useRef(false);
  /** True while the game viewport is on-screen AND the tab is visible. */
  const gameActiveRef = useRef(true);

  // Garden plots grow in real time — tick to refresh sprites (paused off-screen)
  useEffect(() => {
    const iv = setInterval(() => {
      if (!gameActiveRef.current) return;
      setGardenTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  /** Floating "+10G" / "+6 EXP" text above the player. */
  const spawnFloat = useCallback((text: string, color: string) => {
    const p = playerPosRef.current;
    const id = ++floatIdRef.current;
    setFloats((f) => [...f.slice(-5), { id, text, color, x: p.x, y: p.y }]);
    window.setTimeout(() => setFloats((f) => f.filter((n) => n.id !== id)), 1000);
  }, []);

  /** Gold changes from anywhere (hotbar sales, etc). */
  useEffect(() => subscribeGold(() => setGold(getGold())), []);

  /** Hotbar: use portable items outside battle. */
  const brewItem = useCallback((id: string) => {
    if (dialogueRef.current || caveOpenRef.current || battleRef.current) return;
    if (id === "holy_water") {
      showToast("Holy Water is for the DRAGON only.");
      return;
    }
    if (!removeItem(id, 1)) {
      showToast("None left in the bag!");
      return;
    }
    setInv(getInventory());
    sfx.advance();
    const label = id === "coffee" ? "☕ Coffee Potion" : "🍬 Halloween Candy";
    notifyNewly(track("brew"));
    spawnFloat("+6 EXP", "#8ae6b0");
    showToast(`${label} — brewed! (+6 EXP)`);
  }, []);
  const brewItemRef = useRef(brewItem);
  useEffect(() => { brewItemRef.current = brewItem; }, [brewItem]);

  // Level-up detection — flash the screen + toast
  useEffect(() => {
    const check = () => {
      const lv = getLevel();
      setExpPct(levelProgress());
      if (lv > levelRef.current) {
        levelRef.current = lv;
        setLevel(lv);
        sfx.achievement();
        showToast(`LEVEL UP! — REACHED LV ${lv}`);
        const el = viewportFrameRef.current;
        if (el) {
          el.classList.remove("level-flash");
          void el.offsetWidth;
          el.classList.add("level-flash");
          window.setTimeout(() => el.classList.remove("level-flash"), 800);
        }
      }
    };
    check();
    const unsub = subscribe(check);
    const unsubGold = subscribeGold(() => { setGold(getGold()); check(); });
    return () => { unsub(); unsubGold(); };
  }, []);

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

  // Pause every ambient loop when the game is scrolled off-screen or tab hidden
  useEffect(() => {
    const el = viewportFrameRef.current;
    let inView = true;
    const update = () => {
      gameActiveRef.current = inView && !document.hidden;
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: 0 });
    if (el) io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => { fishingRef.current = fishing; }, [fishing]);
  useEffect(() => { visitorsRef.current = visitors; }, [visitors]);
  useEffect(() => { periodRef.current = period; }, [period]);
  useEffect(() => { bossAwakeRef.current = bossAwake; }, [bossAwake]);
  useEffect(() => { battleRef.current = battle; }, [battle]);
  useEffect(() => { dragonDefeatedRef.current = dragonDefeated; }, [dragonDefeated]);

  /** NPCs with night positions applied; optionally include the boss. */
  const makeActiveList = (night: boolean, includeBoss: boolean): NPC[] => {
    const halloween = isHalloween();
    const list: NPC[] = npcs
      .filter(
        (n) =>
          (!n.nightOnly || night) &&
          (!n.halloweenOnly || halloween)
      )
      .map((n) => {
        if (night && n.nightPosition) return { ...n, position: n.nightPosition };
        return n;
      });
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

  /** Apply a battle state change synchronously (ref stays in lockstep with state). */
  const updateBattle = (fn: (b: BattleState) => BattleState) => {
    const cur = battleRef.current;
    if (!cur) return;
    const next = fn(cur);
    battleRef.current = next;
    setBattle(next);
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
      updateBattle((cur) => ({
        ...cur,
        playerHp: 0,
        busy: false,
        timing: null,
        phase: "gameover",
        log: pushLog(cur.log, `${mv.name}! ${mv.line} GAME OVER — eaten by a semicolon.`),
      }));
      sfx.miss();
    } else {
      updateBattle((cur) => ({
        ...cur,
        playerHp,
        busy: false,
        timing: null,
        log: pushLog(cur.log, `${mv.name}! ${mv.line} (-1 ♥)`),
      }));
    }
  };

  const victoryBattle = (lastLog: string) => {
    localStorage.setItem("pq_dragon_defeated", "1");
    setDragonDefeated(true);
    updateBattle((cur) => ({
      ...cur,
      hp: 0,
      busy: false,
      timing: null,
      itemMenu: false,
      phase: "victory",
      log: pushLog(cur.log, lastLog),
    }));
    notifyNewly(track("dragon"));
    addGold(100);
    spawnFloat("+100G", "#d4a847");
    showToast("BOSS DEFEATED — ◆100 GOLD! THE END...?");
    sfx.achievement();
    window.setTimeout(() => {
      battleRef.current = null;
      setBattle(null);
    }, 6000);
  };

  const handleUseItem = (id: string) => {
    const b = battleRef.current;
    if (!b || b.phase !== "fight" || b.busy || b.timing) return;
    if (!removeItem(id, 1)) return;
    setInv(getInventory());
    sfx.link();
    if (id === "coffee" || id === "candy") {
      const playerHp = Math.min(3, b.playerHp + 1);
      const label = id === "coffee" ? "Coffee Potion" : "Halloween Candy";
      updateBattle((cur) => ({
        ...cur,
        playerHp,
        itemMenu: false,
        busy: true,
        log: pushLog(cur.log, `You drink the ${label}. +1 ♥!`),
      }));
      window.setTimeout(dragonCounter, 950);
      return;
    }
    if (id === "holy_water") {
      const hp = Math.max(0, b.hp - 15);
      sfx.crit();
      shake(400);
      if (hp <= 0) {
        victoryBattle("Blessed Water! Holy light vaporizes the dragon... THE END...?");
        return;
      }
      updateBattle((cur) => ({
        ...cur,
        hp,
        itemMenu: false,
        busy: true,
        log: pushLog(cur.log, "Blessed Water! Holy light sears the dragon for 15 HP!"),
      }));
      window.setTimeout(dragonCounter, 950);
    }
  };

  const judgeStrike = () => {
    const b = battleRef.current;
    if (!b || !b.timing || b.phase !== "fight" || b.busy) return;
    const t = b.timing;
    const atk = BATTLE_ATTACKS[t.atk];
    const dist = Math.abs(t.pos - t.center);
    const hit = dist <= t.width / 2;
    const crit = dist <= t.width * 0.35;

    if (!hit) {
      sfx.miss();
      updateBattle((cur) => ({
        ...cur,
        busy: true,
        timing: null,
        log: pushLog(cur.log, `${atk.name} — you hit a semicolon wall. MISS!`),
      }));
      window.setTimeout(dragonCounter, 850);
      return;
    }

    const dmg = Math.round(
      (atk.min + Math.floor(Math.random() * (atk.max - atk.min + 1))) *
        (crit ? atk.critMult : 1)
    );
    const hp = Math.max(0, b.hp - dmg);
    if (crit) { sfx.crit(); shake(350); } else { sfx.advance(); }

    if (hp <= 0) {
      victoryBattle(
        `${atk.name}${crit ? " CRIT!" : ""} -${dmg} HP. The dragon explodes into semicolons...`
      );
      return;
    }

    const enraged = !b.enraged && hp <= 50;
    const taunt25 = !b.taunt25 && !enraged && hp <= 25;
    updateBattle((cur) => ({
      ...cur,
      hp,
      enraged: cur.enraged || enraged,
      taunt25: cur.taunt25 || taunt25,
      busy: !crit,
      timing: null,
      log: pushLog(
        pushLog(
          cur.log,
          `${atk.name}${crit ? " CRIT!" : ""} -${dmg} HP. ${atk.line}` +
            (crit ? " The dragon staggers — free turn!" : "")
        ),
        enraged
          ? "ENRAGE! The dragon glows crimson — MERGE CONFLICT unlocked!"
          : taunt25
            ? 'Dragon: "25% left and it still compiles? Impossible..."'
            : ""
      ).filter(Boolean),
    }));
    if (enraged) {
      sfx.roar();
      shake(600);
    }
    // CRIT (gold core) staggers the dragon — no counterattack
    if (!crit) window.setTimeout(dragonCounter, 950);
  };

  const startAttack = (i: number) => {
    const b = battleRef.current;
    if (!b || b.phase !== "fight" || b.timing || b.busy) return;
    sfx.advance();
    const center = 22 + Math.floor(Math.random() * 56);
    updateBattle((cur) => ({
      ...cur,
      timing: { pos: 0, dir: 1, center, width: 18, atk: i },
    }));
  };

  const retryBattle = () => {
    sfx.roar();
    shake(600);
    const fresh: BattleState = {
      hp: 100,
      playerHp: 3,
      log: ["The Debug Dragon rises again... RRAAAWR!", "Round two — time your strikes!"],
      phase: "fight",
      enraged: false,
      taunt25: false,
      busy: false,
      itemMenu: false,
      timing: null,
    };
    battleRef.current = fresh;
    setBattle(fresh);
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

  // Fishing bar animation (~20fps — plenty smooth for a sweep bar, ⅓ the re-renders)
  useEffect(() => {
    if (!fishing || fishing.done) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (gameActiveRef.current) {
        acc += dt;
        if (acc >= 0.05) {
          const step = acc;
          acc = 0;
          setFishing((f) => {
            if (!f || f.done) return f;
            let pos = f.pos + f.dir * step * 75;
            let dir = f.dir;
            if (pos >= 100) { pos = 100; dir = -1; }
            if (pos <= 0) { pos = 0; dir = 1; }
            return { ...f, pos, dir };
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fishing !== null, fishing?.done]);

  // Weather — random rain/storm bursts (paused while off-screen)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        if (gameActiveRef.current) {
          setWeather((w) => {
            const options =
              w === "clear"
                ? (["rain", "storm", "clear"] as const)
                : (["clear", "clear", "rain"] as const);
            return options[Math.floor(Math.random() * options.length)];
          });
        }
        schedule();
      }, 45000 + Math.random() * 60000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // Speedrun timer (1s tick — only whole seconds are shown)
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (!gameActiveRef.current) return;
      if (runStartRef.current != null) setRunTime(Date.now() - runStartRef.current);
    }, 1000);
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
      if (gameActiveRef.current) {
        const hist = historyRef.current;
        const target = hist[Math.max(0, hist.length - 2)];
        const p = petPosRef.current;
        p.x += (target.x - p.x) * 0.18;
        p.y += (target.y - p.y) * 0.18;
        if (petRef.current) {
          petRef.current.style.transform = `translate(${(p.x - offsetXRef.current) * TILE_SIZE}px, ${(p.y - offsetYRef.current) * TILE_SIZE}px)`;
        }
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
    // Crystal Cavern minigame owns its own input
    if (caveOpenRef.current) return;
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
        const fish = rollFish(periodRef.current.night);
        const isNew = addFish(fish.id);
        setCaughtFish(getCaughtFish());
        notifyNewly(track("fish"));
        if (fish.id === "golden_koi") notifyNewly(track("golden"));
        if (fish.id === "moon_eel") notifyNewly(track("nightfish"));
        sfx.link();
        showToast(`CAUGHT: ${fish.name}${isNew ? " (NEW SPECIES!)" : ""}`);
        const gained = fish.id === "golden_koi" ? 50 : 5 + Math.floor(Math.random() * 6);
        addGold(gained);
        spawnFloat(`+${gained}G`, "#d4a847");
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
        const fresh: BattleState = {
          hp: 100,
          playerHp: 3,
          log: [
            "RRAAAWR! The Debug Dragon blocks the plaza!",
            "Time the STRIKE bar — gold core = CRIT + free turn!",
          ],
          phase: "intro",
          enraged: false,
          taunt25: false,
          busy: true,
          itemMenu: false,
          timing: null,
        };
        battleRef.current = fresh;
        setBattle(fresh);
        window.setTimeout(() => {
          const cur = battleRef.current;
          if (cur && cur.phase === "intro") {
            const next = { ...cur, phase: "fight" as const, busy: false };
            battleRef.current = next;
            setBattle(next);
          }
        }, 1700);
        return;
      }
      if (entity.type === "cave") {
        sfx.open();
        setShowCave(true);
        return;
      }
      if (entity.type === "garden") {
        const stage = plotStage(entity.id);
        if (stage === "empty") {
          plantPlot(entity.id);
          setGardenTick((t) => t + 1);
          sfx.interact();
          setDialogue({
            npc: { ...entity, dialogue: ["You plant a pixel seed. Water it to grow faster!"] },
            lineIndex: 0,
          });
          return;
        }
        if (stage === "ready") {
          const crop = harvestPlot(entity.id);
          setGardenTick((t) => t + 1);
          notifyNewly(track("harvest"));
          setInv(getInventory());
          sfx.link();
          addGold(8);
          spawnFloat("+8G", "#d4a847");
          showToast(`HARVEST: ${crop === "coffee" ? "☕ Coffee Potion" : "🍬 Candy"} +1`);
          setDialogue({
            npc: { ...entity, dialogue: ["A ripe harvest! The plot is bare again — plant anew."] },
            lineIndex: 0,
          });
          return;
        }
        const watered = waterPlot(entity.id);
        setGardenTick((t) => t + 1);
        sfx.interact();
        setDialogue({
          npc: {
            ...entity,
            dialogue: [watered ? "You water the sprout — it grows 40% faster!" : "Already watered. Let nature take its course."],
          },
          lineIndex: 0,
        });
        return;
      }
      if (entity.type === "chest" || entity.type === "pumpkin") {
        sfx.interact();
        if (entity.id === "chest-daily") {
          const today = new Date().toISOString().slice(0, 10);
          if (localStorage.getItem("pq_daily_chest") === today) {
            setDialogue({
              npc: { ...entity, dialogue: ["Already claimed today. Come back tomorrow, adventurer!"] },
              lineIndex: 0,
            });
            return;
          }
          localStorage.setItem("pq_daily_chest", today);
          addItem("coffee", 1);
          addItem("candy", 1);
          setInv(getInventory());
          setOpenedLoot(getOpened());
          notifyNewly(track("dailychest"));
          sfx.link();
          addGold(30);
          spawnFloat("+30G", "#d4a847");
          showToast("DAILY GIFT: ☕ Coffee + 🍬 Candy + ◆30");
          setDialogue({
            npc: { ...entity, dialogue: ["A daily gift!", "☕ Coffee Potion x1", "🍬 Halloween Candy x1"] },
            lineIndex: 0,
          });
          return;
        }
        if (getOpened().has(entity.id)) {
          setDialogue({
            npc: { ...entity, dialogue: ["Empty. Someone got here first..."] },
            lineIndex: 0,
          });
          return;
        }
        markOpened(entity.id);
        const lootLines = (entity.loot ?? []).map((l) => {
          addItem(l.id, l.count);
          const def = ITEMS.find((d) => d.id === l.id);
          return `${def?.icon ?? ""} ${def?.name ?? l.id} x${l.count}`;
        });
        setInv(getInventory());
        setOpenedLoot(getOpened());
        notifyNewly(track(entity.type === "pumpkin" ? "candy" : "chest"));
        sfx.link();
        addGold(15);
        spawnFloat("+15G", "#d4a847");
        showToast(`FOUND: ${lootLines.join(", ")}`);
        setDialogue({
          npc: { ...entity, dialogue: [entity.dialogue[0], ...lootLines] },
          lineIndex: 0,
        });
        return;
      }
      if (entity.type === "shrine") {
        sfx.interact();
        setTeleportFrom(entity);
        return;
      }
      if (entity.type === "portal") {
        sfx.link();
        notifyNewly(track("portal"));
        showToast("THE PORTAL HUMS — SCROLL TO CONTACT");
        setVisitLink("#contact");
        return;
      }
      let lines = entity.dialogue;
      if (entity.type === "npc" || entity.type === "secret") {
        const h = bumpFriendship(entity.id);
        setHearts(h);
        if (!rideUnlockedRef.current && getTotalHearts() >= 10) {
          rideUnlockedRef.current = true;
          setRideUnlocked(true);
          sfx.achievement();
          showToast("BEST BUDS — SLIME RIDE UNLOCKED! (R)");
        }
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
  useEffect(() => { caveOpenRef.current = showCave; }, [showCave]);

  const toggleMenu = useCallback(() => {
    if (dialogueRef.current) { sfx.close(); dialogueRef.current = null; setDialogue(null); return; }
    if (battleRef.current) { sfx.close(); battleRef.current = null; setBattle(null); return; }
    if (showMenuRef.current) { sfx.close(); showMenuRef.current = false; setShowMenu(false); return; }
    sfx.open();
    showMenuRef.current = true;
    setShowMenu(true);
  }, []);

  const toggleMenuRef = useRef(toggleMenu);
  useEffect(() => { toggleMenuRef.current = toggleMenu; }, [toggleMenu]);

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
    // Speed: riding fast, swimming slow
    const now = Date.now();
    const minGap = ridingRef.current ? 75 : swimmingRef.current ? 235 : 0;
    if (minGap > 0 && now - lastMoveRef.current < minGap) return;
    lastMoveRef.current = now;
    setPlayerPos((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      const active = makeActiveList(periodRef.current.night, true);
      // Entities stand their ground — bumping into one shows the interact bracket
      const blocking = active.find((e) => e.position.x === newX && e.position.y === newY);
      if (blocking) {
        setNearbyEntity(blocking);
        return prev;
      }
      // Water = swim mode (can't swim while riding the slime)
      const targetTile = getTileAt(newX, newY);
      const onWater = targetTile === 2 || targetTile === 13;
      if (onWater) {
        if (ridingRef.current) return prev;
        if (!swimmingRef.current) {
          swimmingRef.current = true;
          setSwimming(true);
          sfx.stepOn(2);
        }
      } else if (isWalkable(newX, newY)) {
        if (swimmingRef.current) {
          swimmingRef.current = false;
          setSwimming(false);
        }
      } else {
        return prev;
      }
      {
        setMoving(true);
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        moveTimerRef.current = setTimeout(() => setMoving(false), 100);
        const entity = getNearbyEntity(
          { x: newX, y: newY },
          dir,
          active
        );
        setNearbyEntity(entity);
        historyRef.current.push({ x: newX, y: newY });
        if (historyRef.current.length > 20) historyRef.current.shift();
        sfx.stepOn(getTileAt(newX, newY));
        notifyNewly(track("step"));
        // Footstep dust puff (land only)
        if (!swimmingRef.current) {
          const puffId = ++puffIdRef.current;
          setPuffs((p) => [...p.slice(-6), { id: puffId, x: newX, y: newY }]);
          window.setTimeout(
            () => setPuffs((p) => p.filter((q) => q.id !== puffId)),
            430
          );
        }
        // Speedrun starts on first move
        if (runStartRef.current == null) {
          runStartRef.current = Date.now();
          setRunning(true);
          setRunTime(0);
        }
        // Hidden grove warp
        if (newX === 1 && newY === 1) {
          window.setTimeout(() => {
            setPlayerPos({ x: 3, y: 10 });
            showToast("DISCOVERED — HIDDEN GROVE!");
            notifyNewly(track("cartographer"));
          }, 180);
        }
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, []);

  const toggleRide = useCallback(() => {
    if (!rideUnlockedRef.current) return;
    if (dialogueRef.current || showMenuRef.current || battleRef.current || fishingRef.current) return;
    ridingRef.current = !ridingRef.current;
    setRiding(ridingRef.current);
    if (ridingRef.current) {
      swimmingRef.current = false;
      setSwimming(false);
      sfx.achievement();
      showToast("SLIME RIDE — SPEED BOOST!");
    } else {
      sfx.close();
    }
  }, []);

  const rideToggleRef = useRef(toggleRide);
  useEffect(() => { rideToggleRef.current = toggleRide; }, [toggleRide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts while typing in forms
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      const hasDialogue = dialogueRef.current !== null;
      const hasMenu = showMenuRef.current;

      // Escape — always works
      if (key === "escape") {
        e.preventDefault();
        if (hasDialogue) {
          sfx.close();
          dialogueRef.current = null;
          setDialogue(null);
          return;
        }
        if (battleRef.current) {
          sfx.close();
          battleRef.current = null;
          setBattle(null);
          return;
        }
        if (fishingRef.current) {
          sfx.close();
          fishingRef.current = null;
          setFishing(null);
          return;
        }
        if (hasMenu) {
          sfx.close();
          showMenuRef.current = false;
          setShowMenu(false);
          return;
        }
        sfx.open();
        showMenuRef.current = true;
        setShowMenu(true);
        return;
      }

      // E / Space — interact (dialogue, fishing, NPCs)
      if ((key === "e" || key === " ") && !e.repeat) {
        e.preventDefault();
        interactRef.current?.();
        return;
      }

      // R — mount/dismount slime
      if (key === "r" && !e.repeat) {
        e.preventDefault();
        rideToggleRef.current?.();
        return;
      }

      // 1/2/3 — hotbar: brew portable items outside battle
      if ((key === "1" || key === "2" || key === "3") && !e.repeat) {
        const itemId = key === "1" ? "coffee" : key === "2" ? "candy" : "holy_water";
        brewItemRef.current?.(itemId);
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
      if (!gameActiveRef.current) return;
      if (dialogueRef.current || showMenuRef.current || caveOpenRef.current) return;
      const keys = keysRef.current;
      if (keys.has("up")) movePlayer(0, -1, "up");
      else if (keys.has("down")) movePlayer(0, 1, "down");
      else if (keys.has("left")) movePlayer(-1, 0, "left");
      else if (keys.has("right")) movePlayer(1, 0, "right");
    }, 120);
    return () => clearInterval(interval);
  }, [movePlayer]);

  // Gamepad support — loop starts ONLY when a controller connects (saves 60fps rAF on phones)
  useEffect(() => {
    let raf = 0;
    let prevA = false;
    let prevB = false;
    let prevStart = false;
    let running = false;
    const poll = () => {
      const pads = navigator.getGamepads?.();
      const gp = pads ? Array.from(pads).find(Boolean) : null;
      if (gp) {
        const set = (dir: string, on: boolean) => {
          if (on) keysRef.current.add(dir);
          else keysRef.current.delete(dir);
        };
        if (!dialogueRef.current && !showMenuRef.current && !caveOpenRef.current) {
          const ax = gp.axes[0] ?? 0;
          const ay = gp.axes[1] ?? 0;
          set("left", !!gp.buttons[14]?.pressed || ax < -0.4);
          set("right", !!gp.buttons[15]?.pressed || ax > 0.4);
          set("up", !!gp.buttons[12]?.pressed || ay < -0.4);
          set("down", !!gp.buttons[13]?.pressed || ay > 0.4);
        } else {
          keysRef.current.clear();
        }
        const a = !!gp.buttons[0]?.pressed;
        if (a && !prevA) interactRef.current?.();
        prevA = a;
        const b = !!gp.buttons[1]?.pressed;
        if (b && !prevB) {
          if (caveOpenRef.current) {
            setShowCave(false);
          } else {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
          }
        }
        prevB = b;
        const st = !!gp.buttons[9]?.pressed;
        if (st && !prevStart) toggleMenuRef.current?.();
        prevStart = st;
      }
      raf = requestAnimationFrame(poll);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(poll);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      keysRef.current.clear();
    };
    window.addEventListener("gamepadconnected", start);
    window.addEventListener("gamepaddisconnected", stop);
    // A pad may already be connected before mount — probe once
    const pads = navigator.getGamepads?.();
    if (pads && Array.from(pads).some(Boolean)) start();
    return () => {
      stop();
      window.removeEventListener("gamepadconnected", start);
      window.removeEventListener("gamepaddisconnected", stop);
    };
  }, []);

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

  // Boss battle timing bar — marker sweeps like the fishing minigame (~20fps)
  useEffect(() => {
    if (!battle || battle.phase !== "fight" || !battle.timing) return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      acc += (now - last) / 1000;
      last = now;
      if (acc >= 0.05 && gameActiveRef.current) {
        acc = 0;
        const cur = battleRef.current;
        if (cur && cur.timing && cur.phase === "fight" && !cur.busy) {
          let { pos, dir } = cur.timing;
          const speed = cur.enraged ? 1.85 : 1.4;
          pos += dir * speed * 3; // ×3 — original was tuned per 60fps frame, we tick at ~20fps
          if (pos >= 100) { pos = 100; dir = -1; }
          if (pos <= 0) { pos = 0; dir = 1; }
          const next: BattleState = { ...cur, timing: { ...cur.timing, pos, dir } };
          battleRef.current = next;
          setBattle(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [battle?.phase, battle?.timing != null]);

  const offsetX = Math.max(0, Math.min(playerPos.x - Math.floor(VIEWPORT_TILES_X / 2), MAP_WIDTH - VIEWPORT_TILES_X));
  const offsetY = Math.max(0, Math.min(playerPos.y - Math.floor(VIEWPORT_TILES_Y / 2), MAP_HEIGHT - VIEWPORT_TILES_Y));
  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;

  // Windowed tile range (+1 margin each side so the 0.14s camera glide never shows a gap)
  const tileRange = useMemo(() => {
    const x0 = Math.max(0, offsetX - 1);
    const y0 = Math.max(0, offsetY - 1);
    const x1 = Math.min(MAP_WIDTH, offsetX + VIEWPORT_TILES_X + 2);
    const y1 = Math.min(MAP_HEIGHT, offsetY + VIEWPORT_TILES_Y + 2);
    return { x0, y0, x1, y1 };
  }, [offsetX, offsetY]);

  // Minimap dots — memoized so the canvas only redraws when positions actually change
  const minimapNpcs = useMemo(
    () =>
      makeActiveList(period.night, true)
        .filter((n) => n.type !== "secret")
        .map((n) => ({ id: n.id, x: n.position.x, y: n.position.y, type: n.type })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period.night],
  );

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
        className="relative overflow-hidden rounded-lg border-2 border-border focus:outline-none focus:border-gold/50 pixel-cursor"
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
        <div
          className="absolute"
          style={{
            left: -offsetX * TILE_SIZE,
            top: -offsetY * TILE_SIZE,
            transition: GLIDE,
          }}
        >
          <div style={{ paddingTop: tileRange.y0 * TILE_SIZE }}>
            {Array.from({ length: tileRange.y1 - tileRange.y0 }, (_, ry) => {
              const y = tileRange.y0 + ry;
              return (
                <div key={y} className="flex" style={{ paddingLeft: tileRange.x0 * TILE_SIZE }}>
                  {Array.from({ length: tileRange.x1 - tileRange.x0 }, (_, rx) => {
                    const x = tileRange.x0 + rx;
                    return <TileSprite key={`${x}-${y}`} type={mapData[y]?.[x] ?? 0} x={x} y={y} />;
                  })}
                </div>
              );
            })}
          </div>

          {/* Fountain mist (world-anchored) */}
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={`mist-${i}`}
              className="mist-puff"
              style={{
                left: FOUNTAIN.x * TILE_SIZE + 6 + i * 8,
                top: FOUNTAIN.y * TILE_SIZE + 4,
                animationDelay: `${i * 1.1}s`,
              }}
            />
          ))}
        </div>

        {/* NPCs (night-aware schedule) */}
        {makeActiveList(period.night, true).map((npc) => {
          const nx = (npc.position.x - offsetX) * TILE_SIZE;
          const ny = (npc.position.y - offsetY) * TILE_SIZE;
          if (nx < -TILE_SIZE || ny < -TILE_SIZE || nx > viewportWidth || ny > viewportHeight) return null;
          return (
            <div
              key={npc.id}
              style={{ position: "absolute", left: nx, top: ny, transition: GLIDE }}
            >
              <NPCSprite
                npc={npc}
                isNearby={nearbyEntity?.id === npc.id}
                enraged={!!(battle?.enraged && npc.id === "boss-dragon")}
                opened={openedLoot.has(npc.id)}
              />
            </div>
          );
        })}

        {/* Player */}
        <div
          className="absolute"
          style={{
            left: (playerPos.x - offsetX) * TILE_SIZE,
            top: (playerPos.y - offsetY) * TILE_SIZE,
            transition: GLIDE,
          }}
        >
          <PlayerSprite moving={moving} swimming={swimming} riding={riding} />
        </div>

        {/* Player title */}
        <div
          className="absolute pointer-events-none z-[10] text-center"
          style={{
            left: (playerPos.x - offsetX) * TILE_SIZE - 24,
            top: (playerPos.y - offsetY) * TILE_SIZE - 11,
            width: TILE_SIZE + 48,
            transition: GLIDE,
          }}
        >
          <span
            className="retro-font text-[5px] text-gold whitespace-nowrap"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
          >
            {playerTitle}
          </span>
        </div>

        {/* Floating gain text (+10G, +6 EXP…) */}
        {floats.map((f) => (
          <span
            key={f.id}
            className="float-text"
            style={{
              left: (f.x - offsetX) * TILE_SIZE + TILE_SIZE / 2,
              top: (f.y - offsetY) * TILE_SIZE - 6,
              color: f.color,
            }}
          >
            {f.text}
          </span>
        ))}

        {/* Inventory hotbar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[18] flex gap-1 game-border rounded px-1.5 py-1 bg-bg-main/85">
          {([["coffee", "☕"], ["candy", "🍬"], ["holy_water", "💧"]] as const).map(([id, icon], i) => (
            <button
              key={id}
              onClick={() => brewItemRef.current?.(id)}
              className="relative w-8 h-8 rounded border border-border bg-bg-elevated/70 flex items-center justify-center text-[12px] hover:border-gold/60 transition-colors"
              title={`${i + 1} — ${id.replace("_", " ")} x${inv[id] ?? 0}`}
            >
              <span className={(inv[id] ?? 0) === 0 ? "opacity-30 grayscale" : ""}>{icon}</span>
              {(inv[id] ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 retro-font text-[6px] text-gold bg-bg-main border border-gold/50 rounded px-0.5 leading-tight">
                  {inv[id]}
                </span>
              )}
              <span className="absolute -bottom-0.5 left-0.5 retro-font text-[4px] text-text-secondary/70">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Footstep dust puffs */}
        {puffs.map((p) => (
          <span
            key={p.id}
            className="step-dust"
            style={{
              left: (p.x - offsetX) * TILE_SIZE + 9,
              top: (p.y - offsetY) * TILE_SIZE + 24,
              transition: GLIDE,
              zIndex: 8,
            }}
          />
        ))}

        {/* Pet slime companion (hides while riding it) */}
        {!riding && (
        <div
          ref={petRef}
          className="absolute top-0 left-0 z-[9] pointer-events-none flex items-end justify-center"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            transition: "transform 0.16s ease-out",
          }}
        >
          <svg
            width="28"
            height="22"
            viewBox="0 0 24 18"
            className="pet-bounce"
            style={{ imageRendering: "pixelated", marginBottom: 2 }}
          >
            <rect x="8" y="1" width="8" height="1" fill="#2d7a38" />
            <rect x="5" y="2" width="14" height="1" fill="#2d7a38" />
            <rect x="4" y="3" width="16" height="2" fill="#5ec26a" />
            <rect x="3" y="5" width="18" height="7" fill="#5ec26a" />
            <rect x="2" y="12" width="20" height="3" fill="#5ec26a" />
            <rect x="3" y="15" width="18" height="1" fill="#3a8f48" />
            <rect x="6" y="3" width="7" height="1" fill="#a8e8a0" />
            <rect x="5" y="4" width="5" height="1" fill="#a8e8a0" />
            <rect x="4" y="5" width="2" height="1" fill="#8de08a" />
            <rect x="4" y="13" width="16" height="2" fill="#3a8f48" />
            <rect x="3" y="14" width="18" height="1" fill="#2d7a38" />
            <rect x="8" y="7" width="3" height="3" fill="#ffffff" />
            <rect x="14" y="7" width="3" height="3" fill="#ffffff" />
            <rect x="9" y="8" width="2" height="2" fill="#1a2438" />
            <rect x="15" y="8" width="2" height="2" fill="#1a2438" />
            <rect x="9" y="8" width="1" height="1" fill="#e8f0ff" />
            <rect x="15" y="8" width="1" height="1" fill="#e8f0ff" />
            <rect x="5" y="10" width="2" height="1" fill="#f0a0a0" />
            <rect x="18" y="10" width="2" height="1" fill="#f0a0a0" />
            <rect x="11" y="11" width="3" height="1" fill="#2a6a2a" />
            <rect x="10" y="10" width="1" height="1" fill="#2a6a2a" />
            <rect x="14" y="10" width="1" height="1" fill="#2a6a2a" />
            <rect x="4" y="16" width="4" height="2" fill="#5ec26a" />
            <rect x="16" y="16" width="4" height="2" fill="#5ec26a" />
            <rect x="4" y="17" width="4" height="1" fill="#3a8f48" />
            <rect x="16" y="17" width="4" height="1" fill="#3a8f48" />
          </svg>
        </div>
        )}

        {/* Day/night tint (based on real local time) */}
        <div
          className="absolute inset-0 pointer-events-none z-[14]"
          style={{ background: period.overlay, transition: "background 2s ease" }}
        />

        {/* Night lighting — player lantern + village lamps (soft, bright enough to explore) */}
        {period.night && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[14]"
              style={{
                background: [
                  `radial-gradient(circle 140px at ${(playerPos.x - offsetX) * TILE_SIZE + TILE_SIZE / 2}px ${(playerPos.y - offsetY) * TILE_SIZE + TILE_SIZE / 2}px, rgba(6,10,26,0) 45%, rgba(6,10,26,0.18) 100%)`,
                  ...LAMPS.map(
                    (l) =>
                      `radial-gradient(circle 110px at ${(l.x - offsetX) * TILE_SIZE + TILE_SIZE / 2}px ${(l.y - offsetY) * TILE_SIZE + TILE_SIZE / 2}px, rgba(6,10,26,0) 35%, rgba(6,10,26,0.18) 100%)`
                  ),
                  "rgba(6,10,26,0.18)",
                ].join(", "),
                transition: GLIDE,
              }}
            />
            {/* Warm lamp glow */}
            <div
              className="absolute inset-0 pointer-events-none z-[15]"
              style={{
                background: LAMPS.map(
                  (l) =>
                    `radial-gradient(circle 60px at ${(l.x - offsetX) * TILE_SIZE + TILE_SIZE / 2}px ${(l.y - offsetY) * TILE_SIZE + TILE_SIZE / 2}px, rgba(255,200,110,0.20), transparent 70%)`
                ).join(", "),
                transition: GLIDE,
              }}
            />
          </>
        )}

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

        {/* Pollen motes (daytime) */}
        {!period.night && (
          <div
            className="absolute inset-0 pointer-events-none z-[16] overflow-hidden"
            aria-hidden="true"
          >
            {POLLEN.map((p, i) => (
              <span
                key={i}
                className="pollen"
                style={{
                  left: p.left,
                  top: p.top,
                  background: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Minimap */}
        <Minimap player={playerPos} npcs={minimapNpcs} />

        {/* JRPG HUD — LV / EXP / hearts / gold / time / fish */}
        <div className="absolute top-2 left-2 z-[17] game-border rounded px-2 py-1.5 bg-bg-main/85 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="retro-font text-[6px] px-1.5 py-0.5 rounded bg-gold/20 border border-gold/50 text-gold font-bold">
              LV {level}
            </span>
            <div className="w-16 h-1.5 bg-bg-main border border-border rounded-sm overflow-hidden" title="EXP">
              <div className="h-full bg-xp rounded-sm transition-all duration-500" style={{ width: `${Math.round(expPct * 100)}%` }} />
            </div>
            <span className="retro-font text-[6px] text-hp" title={`Friendship ${getTotalHearts()}`}>
              ♥{getTotalHearts()}
            </span>
            <span className="retro-font text-[6px] text-gold" title="Gold">
              ◆{gold}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="retro-font text-[5px] text-text-secondary">TIME</span>
            <span className="retro-font text-[7px] text-cream">{fmtTime(runTime)}</span>
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
        </div>

        {/* Weather */}
        {weather !== "clear" && (
          <div
            className="absolute inset-0 pointer-events-none z-[16] overflow-hidden"
            aria-hidden="true"
          >
            {Array.from({ length: IS_SMALL ? 14 : 36 }).map((_, i) => (
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
            <TypewriterText
              text={dialogue.npc.dialogue[dialogue.lineIndex]}
              speed={18}
              className="text-sm text-cream leading-relaxed mb-3 block"
            />
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

            {/* Enemy plate (top-left) + dragon sprite (right) */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 max-w-[62%]">
                <div
                  className="bg-bg-elevated border-2 border-hp/60 rounded px-2.5 py-1.5"
                  style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.45)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="pixel-font text-[8px] text-hp">DEBUG DRAGON</span>
                    <span className="retro-font text-[5px] text-text-secondary">Lv99</span>
                  </div>
                  <div className="h-2.5 bg-bg-main border border-border rounded-sm overflow-hidden">
                    <div
                      className={
                        battle.enraged
                          ? "h-full bg-gradient-to-r from-orange-500 to-hp transition-[width] duration-300"
                          : "h-full bg-gradient-to-r from-hp to-red-400 transition-[width] duration-300"
                      }
                      style={{ width: `${battle.hp}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="retro-font text-[5px] text-text-secondary">HP</span>
                    <span className="retro-font text-[5px] text-cream">{battle.hp}/100</span>
                  </div>
                </div>
                {battle.enraged && (
                  <p className="retro-font text-[5px] text-red-400 mt-1 animate-pulse">
                    ⚠ ENRAGED — MERGE CONFLICT UNLOCKED
                  </p>
                )}
              </div>
              <div className="relative shrink-0 mt-1">
                <BossDragonMini enraged={battle.enraged} />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-2 bg-black/45 rounded-full" />
              </div>
            </div>

            {/* Battlefield divider */}
            <div className="border-t border-dashed border-border/60 mb-2" />

            {/* Hero sprite (left) + hero plate (bottom-right) */}
            <div className="flex items-end justify-between gap-3 mb-2">
              <div className="relative shrink-0">
                <PlayerSprite moving={false} />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/45 rounded-full" />
              </div>
              <div className="flex-1 max-w-[62%]">
                <div
                  className="bg-bg-elevated border-2 border-gold/50 rounded px-2.5 py-1.5"
                  style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.45)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="pixel-font text-[8px] text-gold">HERO</span>
                    <span className="retro-font text-[7px] text-hp tracking-widest">
                      {"♥".repeat(battle.playerHp)}
                      {"♡".repeat(Math.max(0, 3 - battle.playerHp))}
                    </span>
                  </div>
                  <div className="h-2.5 bg-bg-main border border-border rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-xp to-gold transition-[width] duration-300"
                      style={{ width: `${(battle.playerHp / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="retro-font text-[5px] text-text-secondary">LV</span>
                    <span className="retro-font text-[5px] text-cream">1</span>
                  </div>
                </div>
              </div>
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
            {battle.phase === "intro" && (
              <p className="pixel-font text-[9px] text-hp text-center py-3 animate-blink">
                ⚠ THE DEBUG DRAGON DESCENDS! ⚠
              </p>
            )}
            {battle.phase === "fight" && !battle.timing && battle.busy && (
              <p className="retro-font text-[6px] text-text-secondary text-center py-2 animate-pulse">
                THE DRAGON IS ATTACKING...
              </p>
            )}
            {battle.phase === "fight" && !battle.timing && !battle.busy && !battle.itemMenu && (
              <div className="grid grid-cols-2 gap-2">
                {BATTLE_ATTACKS.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => startAttack(i)}
                    className="game-btn text-[5px] py-2 leading-tight"
                  >
                    {a.name}
                  </button>
                ))}
                <button
                  onClick={() =>
                    updateBattle((cur) => ({ ...cur, itemMenu: true }))
                  }
                  className="game-btn text-[6px] py-2"
                >
                  ITEM 💼
                </button>
              </div>
            )}
            {battle.phase === "fight" && battle.itemMenu && !battle.busy && (
              <div className="space-y-2">
                {ITEMS.filter((it) => (inv[it.id] ?? 0) > 0).length === 0 && (
                  <p className="retro-font text-[6px] text-text-secondary text-center">
                    NO ITEMS — TRY THE CHESTS!
                  </p>
                )}
                {ITEMS.filter((it) => (inv[it.id] ?? 0) > 0).map((it) => (
                  <button
                    key={it.id}
                    onClick={() => handleUseItem(it.id)}
                    className="block w-full game-btn text-[6px] py-2 flex items-center justify-between"
                  >
                    <span>
                      {it.icon} {it.name}
                    </span>
                    <span className="text-[5px] opacity-80">
                      x{inv[it.id]} — USE
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => updateBattle((cur) => ({ ...cur, itemMenu: false }))}
                  className="retro-font text-[6px] text-text-secondary hover:text-cream w-full px-3 py-1.5 border border-border rounded transition-colors"
                >
                  BACK
                </button>
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
                  PRESS E / TAP STRIKE IN THE GREEN — GOLD CORE = CRIT ×2 + FREE TURN
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

      {/* Waypoint teleport */}
      <AnimatePresence>
        {teleportFrom && (
          <motion.div
            className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="pixel-font text-[9px] text-gold mb-3">⚡ WAYPOINT STONES</p>
            <div className="space-y-2">
              {SHRINES.filter((s) => s.id !== teleportFrom.id).map((s) => (
                <button
                  key={s.id}
                  className="block w-full game-btn text-[7px] py-2"
                  onClick={() => {
                    setPlayerPos(s.spawn);
                    notifyNewly(track("wayfinder"));
                    sfx.achievement();
                    showToast(`TELEPORTED — ${s.name.toUpperCase()}`);
                    setTeleportFrom(null);
                  }}
                >
                  {s.name}
                </button>
              ))}
              <button
                className="retro-font text-[7px] text-text-secondary hover:text-cream w-full px-3 py-1.5 border border-border rounded transition-colors"
                onClick={() => setTeleportFrom(null)}
              >
                CANCEL
              </button>
            </div>
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
            {rideUnlocked && (
              <button
                className={`dpad-btn dpad-static w-14 h-10 text-[7px] ${riding ? "text-gold border-gold/70" : ""}`}
                aria-label="Ride slime"
                onClick={toggleRide}
              >
                {riding ? "OFF" : "RIDE"}
              </button>
            )}
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
        <span>E / Space — Interact / Fish / Swim</span>
        <span>1/2/3 — Use Hotbar</span>
        {rideUnlocked && <span className="text-gold/70">R — Ride Slime</span>}
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

      {/* Crystal Cavern minigame */}
      <CrystalCave
        open={showCave}
        onClose={() => setShowCave(false)}
        onEnd={(score) => {
          notifyNewly(track("gems", String(score)));
          const gained = score * 2;
          addGold(gained);
          spawnFloat(`+${gained}G`, "#d4a847");
          showToast(score >= 10 ? `💎 ${score} GEMS — CAVE LEGEND!` : `💎 ${score} gems mined`);
        }}
      />
    </div>
  );
}