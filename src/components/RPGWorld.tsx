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

const TILE_STYLES: Record<number, { emoji: string; bg: string }> = {
  0: { emoji: "", bg: "#3a6b35" },
  1: { emoji: "", bg: "#8b7355" },
  2: { emoji: "", bg: "#1a5276" },
  3: { emoji: "🌲", bg: "#1a4a2e" },
  4: { emoji: "", bg: "#5c3a1e" },
  5: { emoji: "", bg: "#3a3a5c" },
  6: { emoji: "🌸", bg: "#3a6b35" },
  7: { emoji: "📜", bg: "#3a6b35" },
  8: { emoji: "🪨", bg: "#3a6b35" },
  9: { emoji: "", bg: "#6b5b3a" },
};

function TileSprite({ type }: { type: number }) {
  const tile = TILE_STYLES[type] || { emoji: "?", bg: "#333" };
  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: tile.bg,
        fontSize: type === 3 ? 18 : type === 6 || type === 8 ? 14 : 10,
        lineHeight: 1,
      }}
    >
      {tile.emoji}
    </div>
  );
}

function PlayerSprite({ moving }: { moving: boolean }) {
  return (
    <div
      className="absolute z-10 flex items-center justify-center"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        fontSize: 22,
        transform: moving ? "translateY(-2px)" : "none",
        transition: "transform 0.08s",
      }}
    >
      🧑‍💻
    </div>
  );
}

export function RPGWorld() {
  const [playerPos, setPlayerPos] = useState<Position>(START_POS);
  const [direction, setDirection] = useState<Direction>("down");
  const [moving, setMoving] = useState(false);
  const [nearbyEntity, setNearbyEntity] = useState<NPC | null>(null);
  const [dialogue, setDialogue] = useState<{
    npc: NPC;
    lineIndex: number;
  } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [visitLink, setVisitLink] = useState<string | null>(null);

  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const interactCooldownRef = useRef(false);

  // Refs for current state — read inside event handlers without stale closures
  const dialogueRef = useRef(dialogue);
  const showMenuRef = useRef(showMenu);
  const playerPosRef = useRef(playerPos);
  const directionRef = useRef(direction);

  useEffect(() => {
    dialogueRef.current = dialogue;
  }, [dialogue]);
  useEffect(() => {
    showMenuRef.current = showMenu;
  }, [showMenu]);
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Movement
  const movePlayer = useCallback(
    (dx: number, dy: number, dir: Direction) => {
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
    },
    []
  );

  // Single stable event listener — never re-registers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const hasDialogue = dialogueRef.current !== null;
      const hasMenu = showMenuRef.current;

      // Escape — always works
      if (key === "escape") {
        e.preventDefault();
        if (hasDialogue) {
          setDialogue(null);
          return;
        }
        if (hasMenu) {
          setShowMenu(false);
          return;
        }
        setShowMenu(true);
        return;
      }

      // Block movement keys when dialogue or menu is open
      if (hasDialogue || hasMenu) return;

      // Interact: E or Space — single press, no repeat
      if (
        (key === "e" || key === " ") &&
        !e.repeat &&
        !interactCooldownRef.current
      ) {
        e.preventDefault();
        interactCooldownRef.current = true;
        setTimeout(() => {
          interactCooldownRef.current = false;
        }, 300);

        // Read current position and direction from refs
        const pos = playerPosRef.current;
        const dir = directionRef.current;
        const entity = getNearbyEntity(pos, dir);
        if (entity) {
          setDialogue({ npc: entity, lineIndex: 0 });
        }
        return;
      }

      // Movement keys
      if (key === "w" || key === "arrowup") {
        e.preventDefault();
        keysRef.current.add("up");
      }
      if (key === "s" || key === "arrowdown") {
        e.preventDefault();
        keysRef.current.add("down");
      }
      if (key === "a" || key === "arrowleft") {
        e.preventDefault();
        keysRef.current.add("left");
      }
      if (key === "d" || key === "arrowright") {
        e.preventDefault();
        keysRef.current.add("right");
      }
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

  // Game loop
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

  // Dialogue advance — called by button click
  const handleDialogueAdvance = useCallback(() => {
    if (!dialogue) return;
    const nextIndex = dialogue.lineIndex + 1;
    if (nextIndex >= dialogue.npc.dialogue.length) {
      const npc = dialogue.npc;
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
      setDialogue({ npc: dialogue.npc, lineIndex: nextIndex });
    }
  }, [dialogue]);

  // Viewport
  const offsetX = Math.max(
    0,
    Math.min(
      playerPos.x - Math.floor(VIEWPORT_TILES_X / 2),
      MAP_WIDTH - VIEWPORT_TILES_X
    )
  );
  const offsetY = Math.max(
    0,
    Math.min(
      playerPos.y - Math.floor(VIEWPORT_TILES_Y / 2),
      MAP_HEIGHT - VIEWPORT_TILES_Y
    )
  );
  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;

  return (
    <div className="flex flex-col items-center">
      {/* Game viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-border focus:outline-none focus:border-gold/50"
        style={{ width: viewportWidth, height: viewportHeight }}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      >
        {/* Tile map */}
        <div
          className="absolute"
          style={{
            left: -offsetX * TILE_SIZE,
            top: -offsetY * TILE_SIZE,
          }}
        >
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
          if (
            nx < -TILE_SIZE ||
            ny < -TILE_SIZE ||
            nx > viewportWidth ||
            ny > viewportHeight
          )
            return null;
          const isNearby = nearbyEntity?.id === npc.id;
          return (
            <div
              key={npc.id}
              className="absolute flex items-center justify-center"
              style={{
                left: nx,
                top: ny,
                width: TILE_SIZE,
                height: TILE_SIZE,
                fontSize: npc.type === "quest" ? 16 : 18,
              }}
            >
              {npc.type === "quest" && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 retro-font text-[6px] text-gold animate-blink">
                  !
                </div>
              )}
              {isNearby && (
                <div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    boxShadow: "0 0 8px rgba(212,168,71,0.5)",
                    border: "1px solid rgba(212,168,71,0.4)",
                  }}
                />
              )}
              {npc.sprite}
            </div>
          );
        })}

        {/* Player */}
        <div
          className="absolute"
          style={{
            left: (playerPos.x - offsetX) * TILE_SIZE,
            top: (playerPos.y - offsetY) * TILE_SIZE,
          }}
        >
          <PlayerSprite moving={moving} />
        </div>

        {/* Interaction prompt */}
        {nearbyEntity && !dialogue && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <div className="dialogue-box rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="retro-font text-[7px] px-1.5 py-0.5 bg-bg-main border border-gold/40 rounded text-gold">
                E
              </span>
              <span className="retro-font text-[7px] text-cream">
                {nearbyEntity.name}
              </span>
            </div>
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
          <motion.div
            className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{dialogue.npc.sprite}</span>
                <span className="pixel-font text-[9px] text-gold">
                  {dialogue.npc.name}
                </span>
              </div>
              <button
                onClick={() => setDialogue(null)}
                className="retro-font text-[6px] text-text-secondary hover:text-cream px-1.5 py-0.5 border border-border hover:border-gold/40 rounded transition-all"
                aria-label="Close dialogue"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-cream leading-relaxed mb-3">
              {dialogue.npc.dialogue[dialogue.lineIndex]}
            </p>
            <div className="flex items-center justify-between">
              <span className="retro-font text-[5px] text-text-secondary">
                {dialogue.lineIndex + 1} / {dialogue.npc.dialogue.length}
              </span>
              <button
                onClick={handleDialogueAdvance}
                className="retro-font text-[6px] text-gold animate-blink hover:text-accent transition-colors cursor-pointer"
              >
                ▶ PRESS E
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit link */}
      <AnimatePresence>
        {visitLink && (
          <motion.div
            className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="retro-font text-[7px] text-gold mb-3">
              Open this quest's live demo?
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href={visitLink}
                target="_blank"
                rel="noopener noreferrer"
                className="game-btn text-[7px]"
                onClick={() => setVisitLink(null)}
              >
                VISIT SITE
              </a>
              <button
                className="retro-font text-[7px] text-text-secondary hover:text-cream px-3 py-1 border border-border rounded transition-colors"
                onClick={() => setVisitLink(null)}
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-bg-main/70"
              onClick={() => setShowMenu(false)}
            />
            <div className="dialogue-box rounded-lg p-5 relative z-10 min-w-[200px]">
              <h3 className="pixel-font text-[11px] text-gold mb-4 text-center">
                PAUSE MENU
              </h3>
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
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-center game-btn text-[7px] w-full"
                      onClick={() => setShowMenu(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      className="block text-center game-btn text-[7px] w-full"
                      onClick={item.action}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
              <p className="retro-font text-[5px] text-text-secondary/40 text-center mt-3">
                ESC to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}