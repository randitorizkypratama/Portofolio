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
  type: "npc" | "sign" | "quest" | "secret" | "chest" | "shrine" | "portal" | "pumpkin" | "garden" | "cave" | "librarian" | "blacksmith" | "house" | "petkeeper" | "dig";
  /** Moves here at night (if set). */
  nightPosition?: Position;
  /** Only appears at night. */
  nightOnly?: boolean;
  /** Only appears during October (Halloween). */
  halloweenOnly?: boolean;
  /** Bonus dialogue unlocked at 3+ friendship hearts. */
  secretLine?: string;
  /** Chest/pumpkin contents. */
  loot?: { id: string; count: number }[];
  /** Daytime patrol route (walkable tiles, loops). Paused near the player. */
  patrol?: Position[];
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
    patrol: [{ x: 11, y: 9 }, { x: 11, y: 8 }, { x: 11, y: 7 }, { x: 11, y: 8 }],
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
    id: "npc-librarian",
    name: "Elif the Librarian",
    position: { x: 22, y: 7 },
    sprite: "📚",
    dialogue: [
      "Welcome to the Village Archive, traveler.",
      "Every update, every devlog — bound in books on these shelves.",
      "Press E to browse the collection.",
    ],
    type: "librarian",
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
    patrol: [
      { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 11 },
      { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 6, y: 10 },
    ],
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
    nightPosition: { x: 17, y: 13 },
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
    patrol: [
      { x: 18, y: 12 }, { x: 18, y: 13 }, { x: 19, y: 13 },
      { x: 20, y: 13 }, { x: 20, y: 12 }, { x: 19, y: 12 },
    ],
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
    patrol: [
      { x: 15, y: 18 }, { x: 15, y: 17 }, { x: 16, y: 17 }, { x: 17, y: 17 },
      { x: 17, y: 18 }, { x: 16, y: 18 }, { x: 16, y: 19 }, { x: 15, y: 19 },
    ],
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
  {
    id: "npc-client-1",
    name: "Satisfied Client",
    position: { x: 10, y: 16 },
    sprite: "🤝",
    dialogue: [
      "I hired this developer for our storefront — 16,200 products, zero downtime.",
      "Fast, communicative, and the UI actually converts. Five stars.",
      "If you need Vue/Nuxt work, find the Hire Me portal in the plaza!",
    ],
    secretLine: "Between us — he delivered a day BEFORE the deadline.",
    type: "npc",
  },
  {
    id: "npc-client-2",
    name: "Deck Builder Enthusiast",
    position: { x: 26, y: 8 },
    sprite: "🃏",
    dialogue: [
      "He built my card-deck explorer from scratch — Elysia + Bun, blazing fast.",
      "Smart search, clean data model, deployed same week. Impressive craft.",
      "Check the quest boards if you want to see the receipts!",
    ],
    secretLine: "He even fixed a bug I found at 2 AM. On a Sunday.",
    type: "npc",
  },
  {
    id: "portal-hire",
    name: "Hire Me Portal",
    position: { x: 16, y: 10 },
    sprite: "🌀",
    dialogue: [
      "✨ The Hire Me Portal hums with opportunity...",
      "Step through to send a message — freelance & full-time welcomes.",
    ],
    type: "portal",
  },
  {
    id: "chest-west",
    name: "Weathered Chest",
    position: { x: 2, y: 13 },
    sprite: "📦",
    dialogue: ["It creaks open... coffee potions inside!"],
    type: "chest",
    loot: [
      { id: "coffee", count: 2 },
    ],
  },
  {
    id: "chest-east",
    name: "Mossy Chest",
    position: { x: 27, y: 16 },
    sprite: "📦",
    dialogue: ["Bottled starlight — Blessed Water!"],
    type: "chest",
    loot: [
      { id: "holy_water", count: 1 },
    ],
  },
  {
    id: "chest-south",
    name: "Forgotten Chest",
    position: { x: 2, y: 20 },
    sprite: "📦",
    dialogue: ["A mixed stash: coffee and blessed water."],
    type: "chest",
    loot: [
      { id: "coffee", count: 1 },
      { id: "holy_water", count: 1 },
    ],
  },
  {
    id: "shrine-west",
    name: "West Grove Stone",
    position: { x: 2, y: 3 },
    sprite: "🗿",
    dialogue: ["The waypoint stone glows. Where to?"],
    type: "shrine",
  },
  {
    id: "shrine-east",
    name: "East Gate Stone",
    position: { x: 26, y: 11 },
    sprite: "🗿",
    dialogue: ["The waypoint stone glows. Where to?"],
    type: "shrine",
  },
  {
    id: "shrine-south",
    name: "South Inn Stone",
    position: { x: 23, y: 19 },
    sprite: "🗿",
    dialogue: ["The waypoint stone glows. Where to?"],
    type: "shrine",
  },
  {
    id: "pumpkin-1",
    name: "Jack-o'-Lantern",
    position: { x: 4, y: 12 },
    sprite: "🎃",
    dialogue: ["A grinning jack-o'-lantern... candy inside!"],
    type: "pumpkin",
    halloweenOnly: true,
    loot: [{ id: "candy", count: 1 }],
  },
  {
    id: "pumpkin-2",
    name: "Jack-o'-Lantern",
    position: { x: 10, y: 20 },
    sprite: "🎃",
    dialogue: ["Trick or treat! You scored some candy."],
    type: "pumpkin",
    halloweenOnly: true,
    loot: [{ id: "candy", count: 1 }],
  },
  {
    id: "pumpkin-3",
    name: "Jack-o'-Lantern",
    position: { x: 18, y: 18 },
    sprite: "🎃",
    dialogue: ["This one cackles as it opens. Candy!"],
    type: "pumpkin",
    halloweenOnly: true,
    loot: [{ id: "candy", count: 1 }],
  },
  {
    id: "pumpkin-4",
    name: "Jack-o'-Lantern",
    position: { x: 22, y: 12 },
    sprite: "🎃",
    dialogue: ["Candlelight and caramel — happy Halloween."],
    type: "pumpkin",
    halloweenOnly: true,
    loot: [{ id: "candy", count: 1 }],
  },
  {
    id: "pumpkin-5",
    name: "Jack-o'-Lantern",
    position: { x: 8, y: 5 },
    sprite: "🎃",
    dialogue: ["A lone pumpkin watches the road. Candy!"],
    type: "pumpkin",
    halloweenOnly: true,
    loot: [{ id: "candy", count: 1 }],
  },
  {
    id: "garden-1",
    name: "Garden Plot",
    position: { x: 5, y: 20 },
    sprite: "🌱",
    dialogue: [""],
    type: "garden",
  },
  {
    id: "garden-2",
    name: "Garden Plot",
    position: { x: 6, y: 20 },
    sprite: "🌱",
    dialogue: [""],
    type: "garden",
  },
  {
    id: "garden-3",
    name: "Garden Plot",
    position: { x: 7, y: 20 },
    sprite: "🌱",
    dialogue: [""],
    type: "garden",
  },
  {
    id: "garden-4",
    name: "Garden Plot",
    position: { x: 8, y: 20 },
    sprite: "🌱",
    dialogue: [""],
    type: "garden",
  },
  {
    id: "cave-crystal",
    name: "Crystal Cavern",
    position: { x: 2, y: 8 },
    sprite: "⛰️",
    dialogue: ["Echoes of clinking gems drift from the dark..."],
    type: "cave",
  },
  {
    id: "chest-daily",
    name: "Daily Gift Chest",
    position: { x: 13, y: 16 },
    sprite: "🎁",
    dialogue: ["A gift chest that restocks every day!"],
    type: "chest",
  },
  {
    id: "npc-blacksmith",
    name: "Bruno Ironhand",
    position: { x: 10, y: 6 },
    sprite: "⚒️",
    dialogue: [
      "Welcome to my forge, traveler.",
      "Bring me materials and gold — I'll shape them into something useful.",
      "Press E to open the crafting bench.",
    ],
    type: "blacksmith",
  },
  {
    id: "player-house",
    name: "Your Cottage",
    position: { x: 5, y: 16 },
    sprite: "🏠",
    dialogue: ["Home sweet home. Press E to step inside."],
    type: "house",
  },
  {
    id: "npc-petkeeper",
    name: "Fauna the Pet Keeper",
    position: { x: 27, y: 6 },
    sprite: "🐾",
    dialogue: [
      "Looking for a companion on your journey?",
      "I rescue strays from the code wilderness.",
      "Press E to meet the animals.",
    ],
    type: "petkeeper",
  },
  {
    id: "dig-1",
    name: "???",
    position: { x: 17, y: 3 },
    sprite: "🪦",
    dialogue: ["Something glints beneath the soil..."],
    type: "dig",
  },
  {
    id: "dig-2",
    name: "???",
    position: { x: 27, y: 10 },
    sprite: "🪦",
    dialogue: ["The earth here has been disturbed..."],
    type: "dig",
  },
  {
    id: "dig-3",
    name: "???",
    position: { x: 3, y: 12 },
    sprite: "🪦",
    dialogue: ["A weathered mound of fresh soil..."],
    type: "dig",
  },
  {
    id: "dig-4",
    name: "???",
    position: { x: 8, y: 19 },
    sprite: "🪦",
    dialogue: ["Something is buried here..."],
    type: "dig",
  },
  {
    id: "dig-5",
    name: "???",
    position: { x: 16, y: 20 },
    sprite: "🪦",
    dialogue: ["The ground hums with old magic..."],
    type: "dig",
  },
  {
    id: "chest-treasure",
    name: "Sunken Treasure",
    position: { x: 24, y: 18 },
    sprite: "🗿",
    dialogue: ["A massive chest sealed by ancient tides..."],
    type: "chest",
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