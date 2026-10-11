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
  getNearbyEntity,
  type Direction,
  type Position,
  type NPC,
} from "../game/entities";
import { tileBackground } from "../game/tileArt";

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
function NPCSprite({ npc, isNearby }: { npc: NPC; isNearby: boolean }) {
  return (
    <div className="absolute flex items-center justify-center" style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      <EntityShadow size={npc.type === "quest" ? 22 : 18} />

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

export function RPGWorld() {
  const [playerPos, setPlayerPos] = useState<Position>(START_POS);
  const [direction, setDirection] = useState<Direction>("down");
  const [moving, setMoving] = useState(false);
  const [nearbyEntity, setNearbyEntity] = useState<NPC | null>(null);
  const [dialogue, setDialogue] = useState<{ npc: NPC; lineIndex: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [visitLink, setVisitLink] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

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

  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);
  useEffect(() => { showMenuRef.current = showMenu; }, [showMenu]);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  // Scale game viewport to fit mobile screens
  useEffect(() => {
    const update = () => {
      const s = Math.min(1, (window.innerWidth - 24) / (VIEWPORT_TILES_X * TILE_SIZE));
      setScale(Math.max(0.45, s));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const doInteract = useCallback(() => {
    if (dialogueRef.current) {
      advanceDialogueRef.current?.();
      return;
    }
    if (interactCooldownRef.current) return;
    interactCooldownRef.current = true;
    setTimeout(() => { interactCooldownRef.current = false; }, 300);
    const entity = getNearbyEntity(playerPosRef.current, directionRef.current);
    if (entity) setDialogue({ npc: entity, lineIndex: 0 });
  }, []);

  useEffect(() => { interactRef.current = doInteract; }, [doInteract]);

  const toggleMenu = useCallback(() => {
    if (dialogueRef.current) { setDialogue(null); return; }
    if (showMenuRef.current) { setShowMenu(false); return; }
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
        const entity = getNearbyEntity({ x: newX, y: newY }, dir);
        setNearbyEntity(entity);
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
        if (hasDialogue) { setDialogue(null); return; }
        if (hasMenu) { setShowMenu(false); return; }
        setShowMenu(true);
        return;
      }

      // E / Space — works during dialogue (to advance) AND during gameplay (to interact)
      if ((key === "e" || key === " ") && !e.repeat) {
        e.preventDefault();
        if (hasDialogue) {
          // Advance dialogue — handled by a separate function via ref
          advanceDialogueRef.current?.();
          return;
        }
        if (!interactCooldownRef.current) {
          interactCooldownRef.current = true;
          setTimeout(() => { interactCooldownRef.current = false; }, 300);
          const pos = playerPosRef.current;
          const dir = directionRef.current;
          const entity = getNearbyEntity(pos, dir);
          if (entity) {
            setDialogue({ npc: entity, lineIndex: 0 });
          }
        }
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
        if (url) setVisitLink(url);
      }
    } else {
      setDialogue({ npc: dlg.npc, lineIndex: nextIndex });
    }
  }, []);

  // Keep the ref pointing to the latest advance function
  useEffect(() => {
    advanceDialogueRef.current = handleDialogueAdvance;
  }, [handleDialogueAdvance]);

  const offsetX = Math.max(0, Math.min(playerPos.x - Math.floor(VIEWPORT_TILES_X / 2), MAP_WIDTH - VIEWPORT_TILES_X));
  const offsetY = Math.max(0, Math.min(playerPos.y - Math.floor(VIEWPORT_TILES_Y / 2), MAP_HEIGHT - VIEWPORT_TILES_Y));
  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;

  return (
    <div className="flex flex-col items-center">
      {/* Scaled game viewport (fits mobile screens) */}
      <div
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

        {/* NPCs */}
        {npcs.map((npc) => {
          const nx = (npc.position.x - offsetX) * TILE_SIZE;
          const ny = (npc.position.y - offsetY) * TILE_SIZE;
          if (nx < -TILE_SIZE || ny < -TILE_SIZE || nx > viewportWidth || ny > viewportHeight) return null;
          return (
            <div key={npc.id} style={{ position: "absolute", left: nx, top: ny }}>
              <NPCSprite npc={npc} isNearby={nearbyEntity?.id === npc.id} />
            </div>
          );
        })}

        {/* Player */}
        <div className="absolute" style={{ left: (playerPos.x - offsetX) * TILE_SIZE, top: (playerPos.y - offsetY) * TILE_SIZE }}>
          <PlayerSprite moving={moving} />
        </div>

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

        {/* Fireflies */}
        <div className="absolute inset-0 pointer-events-none z-[16] overflow-hidden">
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
      </div>
      </div>

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

      {/* Dialogue */}
      <AnimatePresence>
        {dialogue && (
          <motion.div className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{dialogue.npc.sprite}</span>
                <span className="pixel-font text-[9px] text-gold">{dialogue.npc.name}</span>
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
                className="retro-font text-[6px] text-gold animate-blink hover:text-accent transition-colors cursor-pointer">
                ▶ PRESS E
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
                  { label: "PROJECTS", href: "#projects" },
                  { label: "SKILLS", href: "#skills" },
                  { label: "CV DOWNLOAD", href: "#about" },
                  { label: "CONTACT", href: "#contact" },
                  { label: "EXIT TO PORTFOLIO", href: "#home" },
                ].map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href} className="block text-center game-btn text-[7px] w-full"
                      onClick={() => setShowMenu(false)}>{item.label}</a>
                  ) : (
                    <button key={item.label} className="block text-center game-btn text-[7px] w-full"
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