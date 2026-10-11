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
  tags: string[];
  color: string;
  url: string;
  repo?: string;
  status: "completed" | "in-progress";
}

export const projects: Project[] = [
  {
    title: "HIBIKISHOP PC",
    slug: "kpop-photocard-tracker",
    description:
      "K-Pop photocard database — explore album PCs, POBs, lucky draws, and special photocards by group, member, album, and market reference. Powered by AI image search.",
    tags: ["Nuxt 4", "Vue 3", "Tailwind", "Bun", "HuggingFace AI"],
    color: "#C04BFF",
    url: "https://kpop-tracker-six.vercel.app/",
    status: "completed",
  },
  {
    title: "DuelDex",
    slug: "dueldex",
    description:
      "Monorepo card game platform — explore cards, build smarter decks, and strategize your next duel. Separate API (Elysia) and web (Nuxt) apps.",
    tags: ["Nuxt 4", "Elysia", "Bun", "Turso", "Tailwind"],
    color: "#35D9F2",
    url: "https://dueldex-web.onrender.com/",
    status: "completed",
  },
  {
    title: "Family Tree",
    slug: "family-tree",
    description:
      "Interactive family tree application for creating, editing, and visualizing family relationships and genealogy with auth and database.",
    tags: ["Nuxt 3", "Vue 3", "Drizzle", "Turso", "Tailwind"],
    color: "#27ae60",
    url: "https://family-tree-delta-peach.vercel.app/",
    status: "completed",
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
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contact" },
];