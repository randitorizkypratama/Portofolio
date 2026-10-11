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

const VIEWPORT_TILES_X = 17;
const VIEWPORT_TILES_Y = 13;
const START_POS: Position = { x: 14, y: 9 };

// Pixel art tile renderer using CSS
function TileSprite({ type }: { type: number }) {
  const styles: Record<number, { bg: string; pattern?: string; detail?: React.ReactNode }> = {
    0: { bg: "#4a7c4a", pattern: "radial-gradient(circle, #5a8c5a 1px, transparent 1px)" },
    1: { bg: "#9c8b6e" },
    2: { bg: "#1a5276", pattern: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)" },
    3: { bg: "#2d5a3d", detail: <span style={{ fontSize: 20, lineHeight: 1 }}>🌲</span> },
    4: { bg: "#6b4a2a" },
    5: { bg: "#4a4a6a", pattern: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 5px)" },
    6: { bg: "#4a7c4a", detail: <span style={{ fontSize: 14, lineHeight: 1 }}>🌸</span> },
    7: { bg: "#4a7c4a", detail: <span style={{ fontSize: 16, lineHeight: 1 }}>📜</span> },
    8: { bg: "#4a7c4a", detail: <span style={{ fontSize: 16, lineHeight: 1 }}>🪨</span> },
    9: { bg: "#7a6a4a", pattern: "repeating-linear-gradient(90deg, #6b5b3a 0px, #6b5b3a 4px, #7a6a4a 4px, #7a6a4a 8px)" },
  };
  const s = styles[type] || { bg: "#333" };
  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: s.bg,
        backgroundImage: s.pattern || "none",
        backgroundSize: type === 0 ? "8px 8px" : undefined,
        lineHeight: 1,
      }}
    >
      {s.detail || null}
    </div>
  );
}

// CSS pixel art player character
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
      <svg width="28" height="28" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        {/* Hair */}
        <rect x="5" y="1" width="6" height="3" fill="#2c2c2c" />
        <rect x="4" y="2" width="1" height="2" fill="#2c2c2c" />
        <rect x="11" y="2" width="1" height="2" fill="#2c2c2c" />
        {/* Face */}
        <rect x="5" y="4" width="6" height="4" fill="#f0c8a0" />
        {/* Eyes */}
        <rect x="6" y="5" width="1" height="1" fill="#1a1a2e" />
        <rect x="9" y="5" width="1" height="1" fill="#1a1a2e" />
        {/* Mouth */}
        <rect x="7" y="7" width="2" height="1" fill="#d4a080" />
        {/* Body (hoodie) */}
        <rect x="4" y="8" width="8" height="5" fill="#2a2a4e" />
        <rect x="6" y="9" width="4" height="3" fill="#d4a847" rx="0" />
        {/* Arms */}
        <rect x="3" y="9" width="1" height="4" fill="#2a2a4e" />
        <rect x="12" y="9" width="1" height="4" fill="#2a2a4e" />
        {/* Hands */}
        <rect x="3" y="13" width="1" height="1" fill="#f0c8a0" />
        <rect x="12" y="13" width="1" height="1" fill="#f0c8a0" />
        {/* Legs */}
        <rect x="5" y="13" width="2" height="2" fill="#1a1a3e" />
        <rect x="9" y="13" width="2" height="2" fill="#1a1a3e" />
        {/* Shoes */}
        <rect x="5" y="15" width="2" height="1" fill="#333" />
        <rect x="9" y="15" width="2" height="1" fill="#333" />
      </svg>
    </div>
  );
}

// NPC sprite with pixel art style
function NPCSprite({ npc, isNearby }: { npc: NPC; isNearby: boolean }) {
  const spriteColors: Record<string, { body: string; accent: string; head: string }> = {
    "sign-welcome": { body: "#8b7355", accent: "#6b5b3a", head: "#a09070" },
    "npc-guide": { body: "#4a2a6a", accent: "#d4a847", head: "#e0c8a0" },
    "quest-kpop": { body: "#6b4a2a", accent: "#d4a847", head: "#8b7355" },
    "quest-dueldex": { body: "#6b4a2a", accent: "#d4a847", head: "#8b7355" },
    "quest-family": { body: "#6b4a2a", accent: "#d4a847", head: "#8b7355" },
    "npc-skills": { body: "#4a4a6a", accent: "#c0392b", head: "#f0c8a0" },
  };
  const c = spriteColors[npc.id] || { body: "#4a4a6a", accent: "#d4a847", head: "#f0c8a0" };

  return (
    <div className="absolute flex items-center justify-center" style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      {/* Quest marker */}
      {npc.type === "quest" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 retro-font text-[8px] text-gold animate-blink z-10">!</div>
      )}
      {/* Glow when nearby */}
      {isNearby && (
        <div className="absolute inset-0 rounded-sm z-0" style={{ boxShadow: "0 0 10px rgba(212,168,71,0.6)", border: "2px solid rgba(212,168,71,0.5)" }} />
      )}
      {/* NPC pixel sprite */}
      <svg width="24" height="24" viewBox="0 0 12 12" style={{ imageRendering: "pixelated", position: "relative", zIndex: 1 }}>
        {npc.type === "quest" ? (
          <>
            {/* Sign/board */}
            <rect x="1" y="1" width="10" height="8" fill={c.body} rx="0" />
            <rect x="2" y="2" width="8" height="6" fill={c.accent} rx="0" />
            <rect x="5" y="9" width="2" height="3" fill="#5c3a1e" />
          </>
        ) : npc.id === "npc-guide" ? (
          <>
            {/* Wizard hat */}
            <rect x="4" y="0" width="4" height="2" fill={c.body} />
            <rect x="5" y="0" width="2" height="1" fill={c.accent} />
            {/* Head */}
            <rect x="4" y="2" width="4" height="3" fill={c.head} />
            <rect x="5" y="3" width="1" height="1" fill="#1a1a2e" />
            <rect x="7" y="3" width="1" height="1" fill="#1a1a2e" />
            {/* Body */}
            <rect x="3" y="5" width="6" height="5" fill={c.body} />
            <rect x="5" y="6" width="2" height="3" fill={c.accent} />
            {/* Beard */}
            <rect x="5" y="4" width="2" height="2" fill="#ddd" />
          </>
        ) : (
          <>
            {/* Warrior head */}
            <rect x="4" y="1" width="4" height="1" fill={c.accent} />
            <rect x="4" y="2" width="4" height="3" fill={c.head} />
            <rect x="5" y="3" width="1" height="1" fill="#1a1a2e" />
            <rect x="7" y="3" width="1" height="1" fill="#1a1a2e" />
            {/* Body */}
            <rect x="3" y="5" width="6" height="5" fill={c.body} />
            <rect x="5" y="6" width="2" height="2" fill={c.accent} />
            {/* Sword */}
            <rect x="10" y="3" width="1" height="6" fill="#aaa" />
            <rect x="9" y="6" width="3" height="1" fill={c.accent} />
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

  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const interactCooldownRef = useRef(false);

  const dialogueRef = useRef(dialogue);
  const showMenuRef = useRef(showMenu);
  const playerPosRef = useRef(playerPos);
  const directionRef = useRef(direction);
  const advanceDialogueRef = useRef<(() => void) | null>(null);

  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);
  useEffect(() => { showMenuRef.current = showMenu; }, [showMenu]);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

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
      {/* Game viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-border focus:outline-none focus:border-gold/50"
        style={{ width: viewportWidth, height: viewportHeight, imageRendering: "pixelated" }}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      >
        {/* Tile map */}
        <div className="absolute" style={{ left: -offsetX * TILE_SIZE, top: -offsetY * TILE_SIZE }}>
          {Array.from({ length: MAP_HEIGHT }).map((_, y) => (
            <div key={y} className="flex">
              {Array.from({ length: MAP_WIDTH }).map((_, x) => (
                <TileSprite key={`${x}-${y}`} type={mapData[y]?.[x] ?? 0} />
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

      {/* Controls hint */}
      <div className="flex gap-4 mt-2 retro-font text-[6px] text-text-secondary/50">
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