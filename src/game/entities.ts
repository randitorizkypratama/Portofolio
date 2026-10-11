export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  x: number;
  y: number;
}

export interface NPC {
  id: string;
  name: string;
  position: Position;
  sprite: string;
  dialogue: string[];
  type: "npc" | "sign" | "quest";
}

export const npcs: NPC[] = [
  {
    id: "sign-welcome",
    name: "Welcome Sign",
    position: { x: 14, y: 7 },
    sprite: "📜",
    dialogue: [
      "Welcome to FixDiriloe's Pixel Quest!",
      "Explore the world to discover projects and skills.",
      "Use WASD or Arrow keys to move. Press E to interact.",
    ],
    type: "sign",
  },
  {
    id: "npc-guide",
    name: "Quest Guide",
    position: { x: 6, y: 5 },
    sprite: "🧙",
    dialogue: [
      "Greetings, traveler! I am the Quest Guide.",
      "There are 3 completed quests in this realm.",
      "Visit the Quest Boards to learn about each one!",
    ],
    type: "npc",
  },
  {
    id: "quest-kpop",
    name: "HIBIKISHOP Quest Board",
    position: { x: 3, y: 17 },
    sprite: "📋",
    dialogue: [
      "═══ QUEST: HIBIKISHOP PC ═══",
      "K-Pop photocard database with 16,200+ cards.",
      "Stack: Nuxt 4, Vue 3, Turso, Vercel Cron",
      "Status: ✓ CLEAR",
      "Visit: kpop-tracker-six.vercel.app",
    ],
    type: "quest",
  },
  {
    id: "quest-dueldex",
    name: "DuelDex Quest Board",
    position: { x: 23, y: 17 },
    sprite: "📋",
    dialogue: [
      "═══ QUEST: DUELDEX ═══",
      "Yu-Gi-Oh! card explorer & smart deck builder.",
      "Stack: Nuxt 4, Elysia, Bun, Turso",
      "Status: ✓ CLEAR",
      "Visit: dueldex-web.onrender.com",
    ],
    type: "quest",
  },
  {
    id: "quest-family",
    name: "Family Tree Quest Board",
    position: { x: 14, y: 16 },
    sprite: "📋",
    dialogue: [
      "═══ QUEST: FAMILY TREE ═══",
      "Family genealogy management with tree visualization.",
      "Stack: Nuxt 3, Drizzle, Turso, family-chart",
      "Status: ✓ CLEAR",
      "Visit: family-tree-delta-peach.vercel.app",
    ],
    type: "quest",
  },
  {
    id: "npc-skills",
    name: "Skills Master",
    position: { x: 23, y: 5 },
    sprite: "⚔️",
    dialogue: [
      "I am the Skills Master. Here are your abilities:",
      "Frontend: Vue 3, Nuxt, Tailwind CSS, TypeScript",
      "Backend: Elysia, Nuxt Server Routes, JWT Auth",
      "Database: Drizzle ORM, Turso (SQLite)",
      "Tooling: Bun, Vitest, Vercel, Render",
    ],
    type: "npc",
  },
];

export function getNearbyEntity(
  playerPos: Position,
  direction: Direction
): NPC | null {
  const offsets: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const checkPos = {
    x: playerPos.x + offsets[direction].x,
    y: playerPos.y + offsets[direction].y,
  };

  return (
    npcs.find(
      (npc) => npc.position.x === checkPos.x && npc.position.y === checkPos.y
    ) || null
  );
}