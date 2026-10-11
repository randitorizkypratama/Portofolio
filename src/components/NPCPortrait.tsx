import type { NPC } from "../game/entities";

/** Small pixel portrait shown in the dialogue box. */
export function NPCPortrait({ npc, size = 40 }: { npc: NPC; size?: number }) {
  const px = (x: number, y: number, w: number, h: number, fill: string, i: number) => (
    <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
  );

  let rects: React.ReactNode[] = [];
  const bg = "#1a2840";

  switch (npc.id) {
    case "sign-welcome":
      rects = [
        px(2, 1, 12, 14, "#8b6239", 0),
        px(3, 2, 10, 12, "#c9a86a", 1),
        px(4, 4, 8, 1, "#5a4630", 2),
        px(4, 6, 8, 1, "#5a4630", 3),
        px(4, 8, 6, 1, "#5a4630", 4),
        px(4, 10, 7, 1, "#5a4630", 5),
      ];
      break;
    case "npc-guide":
      rects = [
        px(4, 1, 8, 2, "#3a5a8a", 0),
        px(3, 3, 10, 2, "#2a4a7a", 1),
        px(5, 5, 6, 4, "#f0c8a0", 2),
        px(6, 6, 1, 1, "#1a2438", 3),
        px(9, 6, 1, 1, "#1a2438", 4),
        px(5, 9, 6, 5, "#3a5a8a", 5),
        px(7, 9, 2, 4, "#d4a847", 6),
      ];
      break;
    case "quest-kpop":
      rects = [
        px(2, 2, 12, 12, bg, 0),
        px(8, 3, 3, 2, "#C04BFF", 1),
        px(6, 5, 7, 2, "#C04BFF", 2),
        px(7, 7, 5, 2, "#a03BDF", 3),
        px(6, 9, 7, 4, "#C04BFF", 4),
        px(8, 13, 3, 1, "#7a2BAF", 5),
      ];
      break;
    case "quest-dueldex":
      rects = [
        px(2, 2, 12, 12, bg, 0),
        px(7, 3, 2, 9, "#35D9F2", 1),
        px(4, 4, 2, 7, "#35D9F2", 2),
        px(10, 4, 2, 7, "#35D9F2", 3),
        px(3, 11, 4, 2, "#1a8aa0", 4),
        px(9, 11, 4, 2, "#1a8aa0", 5),
      ];
      break;
    case "quest-family":
      rects = [
        px(2, 2, 12, 12, bg, 0),
        px(7, 3, 2, 3, "#27ae60", 1),
        px(4, 6, 2, 3, "#2ecc71", 2),
        px(10, 6, 2, 3, "#2ecc71", 3),
        px(6, 9, 4, 2, "#27ae60", 4),
        px(3, 11, 3, 2, "#1e8449", 5),
        px(10, 11, 3, 2, "#1e8449", 6),
      ];
      break;
    case "npc-skills":
      rects = [
        px(4, 2, 8, 3, "#8a9aad", 0),
        px(3, 5, 10, 4, "#6a7a8d", 1),
        px(5, 6, 2, 2, "#5bb8c9", 2),
        px(9, 6, 2, 2, "#5bb8c9", 3),
        px(5, 10, 6, 4, "#5a6a7d", 4),
      ];
      break;
    case "npc-sensei":
      rects = [
        px(5, 1, 6, 1, "#b89b6a", 0),
        px(3, 2, 10, 1, "#8b7355", 1),
        px(5, 3, 6, 4, "#f0c8a0", 2),
        px(6, 4, 1, 1, "#1a2438", 3),
        px(9, 4, 1, 1, "#1a2438", 4),
        px(5, 7, 6, 2, "#e8e8f0", 5),
        px(4, 9, 8, 5, "#2a6a6a", 6),
      ];
      break;
    case "npc-github":
      rects = [
        px(7, 1, 2, 1, "#5bb8c9", 0),
        px(7, 2, 2, 2, "#3a4550", 1),
        px(4, 4, 8, 7, "#2a3440", 2),
        px(5, 5, 6, 4, "#101820", 3),
        px(6, 6, 2, 2, "#5bb8c9", 4),
        px(9, 6, 2, 2, "#5bb8c9", 5),
        px(5, 11, 6, 3, "#2a3440", 6),
        px(7, 12, 2, 1, "#5bb8c9", 7),
      ];
      break;
    case "npc-faq":
      rects = [
        px(5, 1, 6, 2, "#e8e8f0", 0),
        px(4, 2, 8, 1, "#d0d0dc", 1),
        px(5, 3, 6, 4, "#f0c8a0", 2),
        px(6, 4, 1, 1, "#1a2438", 3),
        px(9, 4, 1, 1, "#1a2438", 4),
        px(5, 7, 6, 2, "#e8e8f0", 5),
        px(4, 9, 8, 5, "#6a4a8a", 6),
      ];
      break;
    case "npc-secret":
      rects = [
        px(4, 2, 3, 2, "#e8a84c", 0),
        px(9, 2, 3, 2, "#e8a84c", 1),
        px(4, 4, 8, 6, "#e8a84c", 2),
        px(4, 4, 8, 1, "#f0c078", 3),
        px(6, 6, 2, 2, "#1a2438", 4),
        px(9, 6, 2, 2, "#1a2438", 5),
        px(7, 8, 2, 1, "#f0a0b0", 6),
        px(5, 10, 6, 4, "#e8a84c", 7),
      ];
      break;
    case "npc-bard":
      rects = [
        px(4, 2, 8, 2, "#8a4a2a", 0),
        px(3, 4, 10, 1, "#6a3a1a", 1),
        px(5, 5, 6, 4, "#f0c8a0", 2),
        px(6, 6, 1, 1, "#1a2438", 3),
        px(9, 6, 1, 1, "#1a2438", 4),
        px(5, 9, 6, 5, "#7a3a5a", 5),
        px(11, 8, 3, 5, "#c9a86a", 6),
        px(12, 9, 1, 3, "#8b6239", 7),
      ];
      break;
    case "npc-inn":
      rects = [
        px(3, 2, 10, 2, "#d4a847", 0),
        px(5, 1, 6, 1, "#b8862a", 1),
        px(5, 4, 6, 4, "#f0c8a0", 2),
        px(6, 5, 1, 1, "#1a2438", 3),
        px(9, 5, 1, 1, "#1a2438", 4),
        px(5, 8, 6, 6, "#8a5a3a", 5),
        px(7, 9, 2, 4, "#f0e6d2", 6),
      ];
      break;
    default:
      rects = [
        px(4, 2, 8, 3, "#8a9aad", 0),
        px(4, 5, 8, 4, "#f0c8a0", 1),
        px(6, 6, 1, 1, "#1a2438", 2),
        px(9, 6, 1, 1, "#1a2438", 3),
        px(3, 9, 10, 5, "#5a6a7d", 4),
      ];
  }

  return (
    <span className="shrink-0 rounded border-2 border-border bg-bg-main overflow-hidden block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated", display: "block" }}
        aria-hidden="true"
      >
        <rect x="0" y="0" width="16" height="16" fill={bg} />
        {rects}
      </svg>
    </span>
  );
}
