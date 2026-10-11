import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, isWalkable, tileMap as mapData } from "../game/tileMap";
import { npcs, getNearbyEntity, type Direction, type Position, type NPC } from "../game/entities";

const VIEWPORT_TILES_X = 17;
const VIEWPORT_TILES_Y = 13;

const START_POS: Position = { x: 14, y: 9 };

function TileSprite({ type }: { type: number }) {
  const tiles: Record<number, { emoji: string; bg: string }> = {
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
  const tile = tiles[type] || { emoji: "?", bg: "#333" };
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

function PlayerSprite({ direction, moving }: { direction: Direction; moving: boolean }) {
  const sprites: Record<Direction, string> = {
    up: "🧑‍💻",
    down: "🧑‍💻",
    left: "🧑‍💻",
    right: "🧑‍💻",
  };
  return (
    <div
      className="absolute z-10 flex items-center justify-center transition-none"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        fontSize: 22,
        transform: moving ? "translateY(-2px)" : "none",
      }}
    >
      {sprites[direction]}
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

  const checkNearby = useCallback(
    (pos: Position, dir: Direction) => {
      const entity = getNearbyEntity(pos, dir);
      setNearbyEntity(entity);
    },
    []
  );

  const movePlayer = useCallback(
    (dx: number, dy: number, dir: Direction) => {
      if (dialogue || showMenu) return;
      setDirection(dir);
      setPlayerPos((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
        if (isWalkable(newX, newY)) {
          setMoving(true);
          if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
          moveTimerRef.current = setTimeout(() => setMoving(false), 100);
          checkNearby({ x: newX, y: newY }, dir);
          return { x: newX, y: newY };
        }
        return prev;
      });
    },
    [dialogue, showMenu, checkNearby]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "escape") {
        if (dialogue) {
          setDialogue(null);
          return;
        }
        if (showMenu) {
          setShowMenu(false);
          return;
        }
        setShowMenu(true);
        return;
      }

      if (key === "e" || key === "enter") {
        if (dialogue) {
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
          return;
        }
        if (nearbyEntity) {
          setDialogue({ npc: nearbyEntity, lineIndex: 0 });
          return;
        }
      }

      if (["w", "arrowup"].includes(key)) {
        e.preventDefault();
        keysRef.current.add("up");
      }
      if (["s", "arrowdown"].includes(key)) {
        e.preventDefault();
        keysRef.current.add("down");
      }
      if (["a", "arrowleft"].includes(key)) {
        e.preventDefault();
        keysRef.current.add("left");
      }
      if (["d", "arrowright"].includes(key)) {
        e.preventDefault();
        keysRef.current.add("right");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "arrowup"].includes(key)) keysRef.current.delete("up");
      if (["s", "arrowdown"].includes(key)) keysRef.current.delete("down");
      if (["a", "arrowleft"].includes(key)) keysRef.current.delete("left");
      if (["d", "arrowright"].includes(key)) keysRef.current.delete("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dialogue, showMenu, nearbyEntity]);

  useEffect(() => {
    const interval = setInterval(() => {
      const keys = keysRef.current;
      if (keys.has("up")) movePlayer(0, -1, "up");
      else if (keys.has("down")) movePlayer(0, 1, "down");
      else if (keys.has("left")) movePlayer(-1, 0, "left");
      else if (keys.has("right")) movePlayer(1, 0, "right");
    }, 120);
    return () => clearInterval(interval);
  }, [movePlayer]);

  // Center viewport on player
  const offsetX = Math.max(
    0,
    Math.min(playerPos.x - Math.floor(VIEWPORT_TILES_X / 2), MAP_WIDTH - VIEWPORT_TILES_X)
  );
  const offsetY = Math.max(
    0,
    Math.min(playerPos.y - Math.floor(VIEWPORT_TILES_Y / 2), MAP_HEIGHT - VIEWPORT_TILES_Y)
  );

  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;

  return (
    <div className="flex flex-col items-center">
      {/* Game viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-border"
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
              {Array.from({ length: MAP_WIDTH }).map((_, x) => {
                const tileType = mapData[y]?.[x] ?? 0;
                return <TileSprite key={`${x}-${y}`} type={tileType} />;
              })}
            </div>
          ))}
        </div>

        {/* NPCs */}
        {npcs.map((npc) => {
          const nx = (npc.position.x - offsetX) * TILE_SIZE;
          const ny = (npc.position.y - offsetY) * TILE_SIZE;
          if (nx < -TILE_SIZE || ny < -TILE_SIZE || nx > viewportWidth || ny > viewportHeight)
            return null;
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
          <PlayerSprite direction={direction} moving={moving} />
        </div>

        {/* Interaction prompt */}
        {nearbyEntity && !dialogue && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
            <div className="dialogue-box rounded px-3 py-1.5 retro-font text-[7px] text-gold animate-blink">
              PRESS E — {nearbyEntity.name}
            </div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex gap-4 mt-2 retro-font text-[6px] text-text-secondary/50">
        <span>WASD / Arrows — Move</span>
        <span>E / Enter — Interact</span>
        <span>ESC — Menu</span>
      </div>

      {/* Dialogue panel */}
      <AnimatePresence>
        {dialogue && (
          <motion.div
            className="dialogue-box rounded-lg p-4 mt-3 max-w-md w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{dialogue.npc.sprite}</span>
              <span className="pixel-font text-[9px] text-gold">
                {dialogue.npc.name}
              </span>
            </div>
            <p className="text-sm text-cream leading-relaxed mb-3">
              {dialogue.npc.dialogue[dialogue.lineIndex]}
            </p>
            <div className="flex items-center justify-between">
              <span className="retro-font text-[5px] text-text-secondary">
                {dialogue.lineIndex + 1} / {dialogue.npc.dialogue.length}
              </span>
              <span className="retro-font text-[6px] text-gold animate-blink">
                ▶ PRESS E
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit link prompt */}
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
            <div className="absolute inset-0 bg-bg-main/70" onClick={() => setShowMenu(false)} />
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