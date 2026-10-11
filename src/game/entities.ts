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
  type: "npc" | "sign" | "quest" | "secret";
  /** Moves here at night (if set). */
  nightPosition?: Position;
  /** Only appears at night. */
  nightOnly?: boolean;
  /** Bonus dialogue unlocked at 3+ friendship hearts. */
  secretLine?: string;
}

export const npcs: NPC[] = [
  {
    id: "sign-welcome",
    name: "Welcome Sign",
    position: { x: 14, y: 18 },
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
    position: { x: 12, y: 9 },
    nightPosition: { x: 6, y: 6 },
    sprite: "🧙",
    dialogue: [
      "Greetings, traveler! I am the Quest Guide.",
      "There are 3 completed quests in this realm.",
      "Visit the Quest Boards to learn about each one!",
    ],
    secretLine: "Between us... I once got lost in my own documentation. Embarrassing.",
    type: "npc",
  },
  {
    id: "quest-kpop",
    name: "HIBIKISHOP Quest Board",
    position: { x: 8, y: 7 },
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
    position: { x: 20, y: 7 },
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
    position: { x: 16, y: 14 },
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
    position: { x: 24, y: 8 },
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
  {
    id: "npc-sensei",
    name: "Code Sensei",
    position: { x: 6, y: 10 },
    nightPosition: { x: 5, y: 7 },
    sprite: "⛩️",
    dialogue: [
      "Ah, a fellow traveler of the digital path...",
      "My journey: frontend → backend → databases. Every stack is a new dungeon.",
      "HIBIKISHOP, DuelDex, Family Tree — three dungeons cleared.",
      "Keep building. The grind never stops, and neither does the XP.",
    ],
    secretLine: "Secret: the real stack is the friends we refactored along the way.",
    type: "npc",
  },
  {
    id: "npc-github",
    name: "GitHub Guardian",
    position: { x: 11, y: 19 },
    nightPosition: { x: 12, y: 18 },
    sprite: "🛡️",
    dialogue: [
      "I guard the Repository of Commits...",
      "All projects live on GitHub — source code, issues, and history.",
      "Streaks are forged one commit at a time, traveler.",
      "Visit: github.com/fixdiriloe",
    ],
    secretLine: "The green squares... forged in late-night commits and strong coffee.",
    type: "npc",
  },
  {
    id: "npc-faq",
    name: "Village Elder",
    position: { x: 19, y: 12 },
    nightPosition: { x: 16, y: 13 },
    sprite: "👴",
    dialogue: [
      "Ah, a visitor with questions. Ask away — I answer in riddles no more.",
      "Q: Available for work? A: Yes — open to freelance & full-time frontend roles.",
      "Q: Remote? A: Fully remote-friendly, based in Indonesia (UTC+7).",
      "Q: Favorite stack? A: Vue/Nuxt, TypeScript, Tailwind, Bun & Turso.",
      "Q: How to start? A: Use the Message Board south of the plaza — I always read it.",
    ],
    secretLine: "Between you and me: he replies fastest in the morning (UTC+7).",
    type: "npc",
  },
  {
    id: "npc-secret",
    name: "???",
    position: { x: 4, y: 10 },
    sprite: "🐈",
    dialogue: [
      "Psst... you found me. Not many travelers wander this meadow.",
      "I'm Momo, the village's silent guardian. This corner is my secret.",
      "Your reward: keep exploring — the best treasures are off the path.",
    ],
    type: "secret",
  },
  {
    id: "npc-bard",
    name: "Traveling Bard",
    position: { x: 16, y: 18 },
    nightPosition: { x: 15, y: 12 },
    sprite: "🎻",
    dialogue: [
      "Ho ho! Care for a tune, traveler?",
      "The jukebox in the pause menu holds six melodies — cycle them freely!",
      "Music soothes the soul... and makes quests 100% more epic.",
    ],
    secretLine: "psst... listen close at the bridge — the water keeps its own rhythm.",
    type: "npc",
  },
  {
    id: "npc-inn",
    name: "Inn Keeper",
    position: { x: 24, y: 19 },
    sprite: "🏨",
    dialogue: [
      "Welcome to the Pixel Inn!",
      "Rest your feet — the plaza fountain is just west of here.",
      "Every traveler who signs the ledger makes this village a little brighter.",
    ],
    secretLine: "Room 3 is free... just mind the slime. He pays in compliments.",
    type: "npc",
  },
  {
    id: "npc-watch",
    name: "Night Watch",
    position: { x: 14, y: 15 },
    sprite: "🌙",
    nightOnly: true,
    dialogue: [
      "Halt — just kidding. Welcome to the night shift.",
      "I guard the village while the sun sleeps. Quiet hours are the best hours.",
      "They say a Debug Dragon appears in the plaza once all 3 quests are done...",
    ],
    type: "npc",
  },
];

/** The final boss — appears in the plaza after all 3 quests are cleared. */
export const bossDragon: NPC = {
  id: "boss-dragon",
  name: "Debug Dragon",
  position: { x: 14, y: 7 },
  sprite: "🐉",
  dialogue: [
    "RRAAAWR! I am the Debug Dragon — eater of deadlines, breaker of builds!",
    "You cleared the three quests? Then face the final stack trace!",
  ],
  type: "npc",
};

export function getNearbyEntity(
  playerPos: Position,
  direction: Direction,
  list: NPC[] = npcs
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
    list.find(
      (npc) => npc.position.x === checkPos.x && npc.position.y === checkPos.y
    ) || null
  );
}