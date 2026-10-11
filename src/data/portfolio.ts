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
}

export const projects: Project[] = [
  {
    title: "Kpop Photocard Tracker",
    slug: "kpop-photocard-tracker",
    description:
      "Web app untuk mencari dan melacak photocard K-Pop dengan database lengkap.",
    tags: ["TanStack Start", "React", "Tailwind CSS"],
    color: "#C04BFF",
  },
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    description:
      "Personal website dengan tema game 8-bit, modern, dan interaktif.",
    tags: ["React", "Motion", "Tailwind CSS"],
    color: "#795CFF",
  },
  {
    title: "Game Mini Project",
    slug: "game-mini-project",
    description:
      "Mini game berbasis web dengan mekanik sederhana dan visual pixel art.",
    tags: ["React", "Canvas", "Tailwind CSS"],
    color: "#35D9F2",
  },
  {
    title: "Anime Gallery",
    slug: "anime-gallery",
    description: "Gallery gambar anime dengan fitur search dan kategori.",
    tags: ["React", "Tailwind CSS", "Lucide React"],
    color: "#FF6B9D",
  },
];

export interface TechItem {
  name: string;
  description: string;
  icon: string;
}

export const techStack: TechItem[] = [
  {
    name: "TanStack Start",
    description: "Routing, SSR, Server Functions",
    icon: "tanstack",
  },
  {
    name: "React",
    description: "Component Architecture",
    icon: "react",
  },
  {
    name: "Tailwind CSS",
    description: "Styling and Design System",
    icon: "tailwind",
  },
  {
    name: "Motion",
    description: "Transitions and Animations",
    icon: "motion",
  },
  {
    name: "TypeScript",
    description: "Type Safety",
    icon: "typescript",
  },
  {
    name: "Lucide React",
    description: "Icons",
    icon: "lucide",
  },
  {
    name: "Zod",
    description: "Validation",
    icon: "zod",
  },
  {
    name: "React Hook Form",
    description: "Form Handling",
    icon: "rhf",
  },
  {
    name: "Vite",
    description: "Build Tool",
    icon: "vite",
  },
  {
    name: "Vercel",
    description: "Deployment",
    icon: "vercel",
  },
  {
    name: "Playwright",
    description: "Testing",
    icon: "playwright",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contact" },
];