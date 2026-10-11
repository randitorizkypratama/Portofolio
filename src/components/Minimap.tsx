import { useEffect, useRef } from "react";
import { tileMap, MAP_WIDTH, MAP_HEIGHT } from "../game/tileMap";

const COLORS: Record<number, string> = {
  0: "#4f8f46",
  1: "#d2b07a",
  2: "#2465b4",
  3: "#1d5c33",
  4: "#8b6239",
  5: "#e6d2a8",
  6: "#ff7eb6",
  7: "#a5794a",
  8: "#8a97a4",
  9: "#9c6b3f",
  10: "#a54a4a",
  11: "#8c3b38",
  12: "#8b5a2b",
  13: "#4aa8d8",
  14: "#9aa5b1",
  15: "#ffd94a",
  16: "#a5794a",
};

interface MinimapProps {
  player: { x: number; y: number };
  npcs: { id: string; x: number; y: number; type: string }[];
  scale?: number;
}

export function Minimap({ player, npcs, scale = 3 }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    // Base map
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        g.fillStyle = COLORS[tileMap[y]?.[x] ?? 0] || "#333";
        g.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    // NPCs
    for (const npc of npcs) {
      g.fillStyle = npc.type === "quest" ? "#d4a847" : "#5bb8c9";
      g.fillRect(npc.x * scale - 1, npc.y * scale - 1, scale + 2, scale + 2);
    }

    // Player
    g.fillStyle = "#ffffff";
    g.fillRect(player.x * scale - 1, player.y * scale - 1, scale + 2, scale + 2);
    g.fillStyle = "#d4a847";
    g.fillRect(player.x * scale, player.y * scale, scale, scale);
  }, [player, npcs, scale]);

  return (
    <div
      className="absolute top-2 right-2 z-[17] rounded border-2 border-gold/50 bg-bg-main/70 backdrop-blur-sm pointer-events-none"
      style={{ padding: 2, opacity: 0.9 }}
    >
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH * scale}
        height={MAP_HEIGHT * scale}
        style={{ display: "block", imageRendering: "pixelated" }}
      />
      <div className="retro-font text-[4px] text-gold text-center mt-0.5 leading-none">MAP</div>
    </div>
  );
}
