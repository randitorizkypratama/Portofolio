export const siteConfig = {
  name: "FixDiriloe",
  title: "Web Developer",
  tagline: "Building Digital Worlds with Code",
  description:
    "I'm a web developer who loves turning ideas into interactive experiences. Currently focused on modern web technologies, clean code, and pixel-perfect designs.",
  aboutDescription:
    "I build modern web applications with a focus on clean code, performance, and great user experience. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies, playing games, or watching anime.",
  contactDescription:
    "Have a project in mind, a collaboration opportunity, or just want to say hi? Feel free to reach out!",
  location: "Indonesia",
  role: "Frontend Developer",
  interests: "Game · Tech · Anime",
  email: "hello@fixdiriloe.dev",
  cvPath: "/cv/FixDiriloe-CV.pdf",
  cvFileName: "FixDiriloe-CV.pdf",
  socials: {
    github: "https://github.com/fixdiriloe",
    x: "https://x.com/fixdiriloe",
    linkedin: "https://linkedin.com/in/fixdiriloe",
  },
};

export interface Project {
  title: string;
  slug: string;
  description: string;
  problem: string;
  features: string[];
  tags: string[];
  color: string;
  url: string;
  repo?: string;
  status: "completed" | "in-progress";
  screenshot: string;
  architecture: string;
}

export const projects: Project[] = [
  {
    title: "HIBIKISHOP PC",
    slug: "kpop-photocard-tracker",
    description:
      "Full-stack K-Pop photocard database with 16,200+ cards, faceted filters, price tracking, collection binder, and release timeline — powered by Pocamarket, MusicBrainz, and Apple Music APIs.",
    problem:
      "K-Pop collectors needed a unified way to browse, compare, and track photocard prices across groups, card types, and stores.",
    features: [
      "16,200+ photocards with faceted filters (group, member, card type, store, price)",
      "Top price movers — biggest drops and risers over the last 36 hours",
      "Collection binder with wishlist/owned tracking per user",
      "Release timeline from MusicBrainz + Apple Music enrichment",
      "Command palette (Ctrl/⌘ K) for quick navigation",
      "ID/EN language toggle across all pages",
    ],
    tags: ["Nuxt 4", "Vue 3", "Tailwind", "Turso", "Vercel Cron"],
    color: "#C04BFF",
    url: "https://kpop-tracker-six.vercel.app/",
    status: "completed",
    screenshot: "/images/project-kpop-tracker-overview.png",
    architecture:
      "Nuxt 4 SSR with server routes, Turso (libSQL) for persistence, daily auto-sync from Pocamarket at 00:00 WIB, MusicBrainz discography matching for release attribution, scrypt-hashed user sessions.",
  },
  {
    title: "DuelDex",
    slug: "dueldex",
    description:
      "Full-stack Yu-Gi-Oh! card explorer and smart deck builder — browse thousands of cards, save favorites, and let DuelDex generate format-legal decks with synergy scoring and archetype detection.",
    problem:
      "Yu-Gi-Oh! players needed a tool that goes beyond card search — one that understands card relationships and can recommend complete, competitive decks.",
    features: [
      "Full-text search with filters (type, attribute, level, archetype, race, ATK/DEF)",
      "Smart deck recommendation — select a card, get a complete deck with synergy explanations",
      "TCG banlist enforcement (Forbidden/Limited/Semi-Limited badges)",
      "Per-user favorites and deck saving with JWT auth",
      "Avatar upload with client-side WebP conversion",
      "Shareable URL queries for filtered views",
    ],
    tags: ["Nuxt 4", "Elysia", "Bun", "Turso", "JWT Auth"],
    color: "#35D9F2",
    url: "https://dueldex-web.onrender.com/",
    status: "completed",
    screenshot: "/images/project-dueldex-overview.png",
    architecture:
      "Monorepo with Bun workspaces — Elysia API (REST + Swagger) and Nuxt 4 web app. SQLite via Turso for users, decks, and favorites. HMAC-SHA256 JWT auth with bcrypt password hashing. YGOPRODeck API as card data source.",
  },
  {
    title: "Family Tree",
    slug: "family-tree",
    description:
      "Family genealogy management app — create families through a 4-step wizard, visualize interactive tree charts, track birthdays, manage roles, and export data.",
    problem:
      "Managing and visualizing family relationships across generations requires a structured, accessible tool that works for both tech-savvy and non-technical users.",
    features: [
      "Dashboard with family statistics, gender ratio, average age",
      "4-step family creation wizard (Person → Spouse → Children → Review)",
      "Interactive tree visualization using D3-based family-chart",
      "Birthday calendar with upcoming reminders",
      "Role-based access control (admin/editor)",
      "Multi-language support (Indonesia, English, Sunda)",
      "CSV data export and dark mode",
    ],
    tags: ["Nuxt 3", "Vue 3", "Drizzle", "Turso", "Tailwind"],
    color: "#27ae60",
    url: "https://family-tree-delta-peach.vercel.app/",
    status: "completed",
    screenshot: "/images/project-family-tree-overview.png",
    architecture:
      "Nuxt 3 with Vue 3 Composition API, Drizzle ORM over Turso (libSQL), bcryptjs for auth, family-chart for D3 tree rendering, rate limiting per IP, CSRF protection with origin allowlist.",
  },
];

export interface TechItem {
  name: string;
  description: string;
  icon: string;
}

export const techStack: TechItem[] = [
  {
    name: "Nuxt",
    description: "Vue Framework, SSR, File Routing",
    icon: "nuxt",
  },
  {
    name: "Vue 3",
    description: "Reactive UI Components",
    icon: "vue",
  },
  {
    name: "Bun",
    description: "Runtime, Bundler, Package Manager",
    icon: "bun",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-First Styling",
    icon: "tailwind",
  },
  {
    name: "TypeScript",
    description: "Type Safety",
    icon: "typescript",
  },
  {
    name: "Drizzle ORM",
    description: "Type-Safe Database Queries",
    icon: "drizzle",
  },
  {
    name: "Turso",
    description: "Edge SQLite Database",
    icon: "turso",
  },
  {
    name: "Elysia",
    description: "Bun Web Framework, API",
    icon: "elysia",
  },
  {
    name: "HuggingFace",
    description: "AI/ML Image Search",
    icon: "huggingface",
  },
  {
    name: "Zod",
    description: "Schema Validation",
    icon: "zod",
  },
  {
    name: "Vercel",
    description: "Deployment & Hosting",
    icon: "vercel",
  },
  {
    name: "Vitest",
    description: "Unit Testing",
    icon: "vitest",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#explore" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const updates = [
  {
    version: "1.5",
    date: "Oct 2026",
    title: "The Debug Dragon Update",
    items: [
      "Final boss: Debug Dragon battle after clearing all 3 quests",
      "Daily quests - a new task every day",
      "NPCs head home at night - meet the Night Watch",
      "Friendship hearts: talk often to unlock secret lines",
      "Terrain-aware footstep sounds",
      "Scroll of Updates (you are reading it!)",
    ],
  },
  {
    version: "1.4",
    date: "Sep 2026",
    title: "Fishing & Weather Update",
    items: [
      "Fishing minigame with 5 rare fish species",
      "Random rain & storm weather",
      "6-track jukebox & speedrun timer",
      "Hidden grove warp - find the quiet meadow",
    ],
  },
  {
    version: "1.3",
    date: "Sep 2026",
    title: "Sound & Stats Update",
    items: [
      "8-bit SFX + procedural BGM soundtrack",
      "EXP bar, quest journal & achievements",
      "Day/night cycle + pet slime companion",
      "Contact form, minimap & GitHub stats panel",
    ],
  },
];
