import type { L } from "../i18n";

export const ui = {
  navHome: { en: "Home", id: "Beranda" },
  navExplore: { en: "Explore", id: "Jelajah" },
  navProjects: { en: "Projects", id: "Proyek" },
  navSkills: { en: "Skills", id: "Skill" },
  navUses: { en: "Uses", id: "Peralatan" },
  navContact: { en: "Contact", id: "Kontak" },
  heroTitle1: { en: "Building Digital", id: "Membangun Dunia" },
  heroTitle2: { en: "Worlds", id: "Digital" },
  heroTitle3: { en: "with Code", id: "dengan Kode" },
  viewProjects: { en: "▸ View Projects", id: "▸ Lihat Proyek" },
  contactMe: { en: "▸ Contact Me", id: "▸ Hubungi Saya" },
  caseStudyCta: { en: "Open full case study", id: "Buka studi kasus lengkap" },
  backHome: { en: "← Back to village", id: "← Kembali ke desa" },
  currentlyTitle: { en: "Currently", id: "Saat Ini" },
  currentlyIntro: {
    en: "What the developer is up to right now.",
    id: "Apa yang sedang dikerjakan developer saat ini.",
  },
  timelineTitle: { en: "Adventure Log", id: "Catatan Petualangan" },
  timelineIntro: {
    en: "The journey so far — work, projects, and milestones.",
    id: "Perjalanan sejauh ini — pekerjaan, proyek, dan pencapaian.",
  },
  testimonialsTitle: { en: "Party Members Say", id: "Kata Rekan Partai" },
  testimonialsIntro: {
    en: "Words from clients and collaborators.",
    id: "Kata-kata dari klien dan kolaborator.",
  },
  faqTitle: { en: "Elder's Wisdom", id: "Kebijaksanaan Tetua" },
  faqIntro: {
    en: "Frequently asked questions, answered by the village elder.",
    id: "Pertanyaan yang sering diajukan, dijawab oleh tetua desa.",
  },
  usesTitle: { en: "Gear & Setup", id: "Peralatan & Setup" },
  usesIntro: {
    en: "The hardware and software behind the quests.",
    id: "Perangkat keras dan lunak di balik setiap misi.",
  },
  notFoundTitle: { en: "You fell into a cave...", id: "Kamu jatuh ke gua..." },
  notFoundDesc: {
    en: "This page doesn't exist. But hey, at least you found 20 gold.",
    id: "Halaman ini tidak ada. Tapi setidaknya kamu menemukan 20 emas.",
  },
  notFoundBack: { en: "Climb back to the surface", id: "Panjat kembali ke permukaan" },
  caseStudyLabel: { en: "CASE STUDY", id: "STUDI KASUS" },
  overview: { en: "Overview", id: "Ringkasan" },
  problem: { en: "Problem", id: "Masalah" },
  challenge: { en: "Challenge", id: "Tantangan" },
  solution: { en: "Solution", id: "Solusi" },
  results: { en: "Results", id: "Hasil" },
  keyFeatures: { en: "Key Features", id: "Fitur Utama" },
  architecture: { en: "Architecture", id: "Arsitektur" },
  techStack: { en: "Tech Stack", id: "Tech Stack" },
  liveDemo: { en: "Live Demo", id: "Live Demo" },
} satisfies Record<string, L>;

export interface TimelineEntry {
  year: string;
  title: L;
  org: L;
  desc: L;
  type: "work" | "project" | "edu" | "milestone";
}

export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    title: { en: "Freelance Web Developer", id: "Web Developer Freelance" },
    org: { en: "Self-employed · Remote", id: "Mandiri · Remote" },
    desc: {
      en: "Building full-stack apps for clients — from photocard databases to family tools. Shipping fast with Nuxt, Bun, and Turso.",
      id: "Membangun aplikasi full-stack untuk klien — dari database photocard sampai tools keluarga. Rilis cepat dengan Nuxt, Bun, dan Turso.",
    },
    type: "work",
  },
  {
    year: "2026",
    title: { en: "HIBIKISHOP PC", id: "HIBIKISHOP PC" },
    org: { en: "16,200+ photocards · Live", id: "16.200+ photocard · Live" },
    desc: {
      en: "Shipped a full-stack K-Pop photocard database with price tracking, collection binder, and daily auto-sync from Pocamarket.",
      id: "Merilis database photocard K-Pop full-stack dengan pelacak harga, koleksi binder, dan sinkronisasi harian dari Pocamarket.",
    },
    type: "project",
  },
  {
    year: "2025",
    title: { en: "DuelDex & Family Tree", id: "DuelDex & Family Tree" },
    org: { en: "Two full-stack launches", id: "Dua peluncuran full-stack" },
    desc: {
      en: "Launched DuelDex (smart Yu-Gi-Oh! deck builder with synergy scoring) and Family Tree (genealogy app with D3 visualization).",
      id: "Meluncurkan DuelDex (deck builder Yu-Gi-Oh! pintar dengan skor sinergi) dan Family Tree (aplikasi silsilah dengan visualisasi D3).",
    },
    type: "project",
  },
  {
    year: "2025",
    title: { en: "Pixel Quest Portfolio", id: "Pixel Quest Portfolio" },
    org: { en: "This website", id: "Website ini" },
    desc: {
      en: "Turned this portfolio into an interactive RPG world — fishing, boss battles, achievements — as a love letter to games.",
      id: "Mengubah portofolio ini jadi dunia RPG interaktif — memancing, battle boss, achievement — sebagai surat cinta untuk game.",
    },
    type: "milestone",
  },
  {
    year: "2024",
    title: { en: "First Client Projects", id: "Proyek Klien Pertama" },
    org: { en: "Freelance", id: "Freelance" },
    desc: {
      en: "Started taking freelance web work — landing pages, dashboards, and small business sites. Learned to ship under real deadlines.",
      id: "Mulai menerima pekerjaan web freelance — landing page, dashboard, dan situs bisnis kecil. Belajar rilis di bawah deadline nyata.",
    },
    type: "work",
  },
  {
    year: "2023",
    title: { en: "Web Dev Journey Begins", id: "Perjalanan Web Dev Dimulai" },
    org: { en: "Vue · Nuxt · Tailwind", id: "Vue · Nuxt · Tailwind" },
    desc: {
      en: "Fell in love with the frontend — Vue's reactivity, Nuxt's structure, and the joy of shipping things people can actually use.",
      id: "Jatuh cinta dengan frontend — reaktivitas Vue, struktur Nuxt, dan kesenangan merilis sesuatu yang benar-benar dipakai orang.",
    },
    type: "edu",
  },
];

export const currently = {
  learning: {
    en: "AI-assisted workflows, Bun + Elysia edge patterns",
    id: "Alur kerja berbantuan AI, pola edge Bun + Elysia",
  },
  building: {
    en: "This portfolio (always another quest) + client apps",
    id: "Portofolio ini (selalu ada misi baru) + aplikasi klien",
  },
  reading: {
    en: "Game design docs & postmortems for fun",
    id: "Dokumen desain game & postmortem seru-seruan",
  },
  playing: {
    en: "RPGs, auto-battlers, and one too many card games",
    id: "RPG, auto-battler, dan terlalu banyak card game",
  },
};

export interface Faq {
  q: L;
  a: L;
}

export const faqs: Faq[] = [
  {
    q: {
      en: "Are you available for freelance work?",
      id: "Apakah tersedia untuk pekerjaan freelance?",
    },
    a: {
      en: "Yes! I'm open to freelance projects and collaborations. The fastest way to reach me is the contact form below — I usually reply within a day.",
      id: "Ya! Saya terbuka untuk proyek freelance dan kolaborasi. Cara tercepat menghubungi saya adalah formulir kontak di bawah — biasanya saya membalas dalam sehari.",
    },
  },
  {
    q: {
      en: "What's your main tech stack?",
      id: "Apa tech stack utama kamu?",
    },
    a: {
      en: "Vue + Nuxt on the frontend, Tailwind for styling, Bun/Elysia or Nitro on the backend, and Turso (libSQL) for data. I pick tools that ship fast and stay maintainable.",
      id: "Vue + Nuxt di frontend, Tailwind untuk styling, Bun/Elysia atau Nitro di backend, dan Turso (libSQL) untuk data. Saya memilih tools yang rilis cepat dan mudah dirawat.",
    },
  },
  {
    q: {
      en: "Do you work with international clients?",
      id: "Apakah bekerja dengan klien internasional?",
    },
    a: {
      en: "Absolutely — I'm based in Indonesia but work remotely with clients anywhere. I communicate in English and Indonesian.",
      id: "Tentu — saya berbasis di Indonesia tapi bekerja remote dengan klien di mana saja. Saya berkomunikasi dalam bahasa Inggris dan Indonesia.",
    },
  },
  {
    q: {
      en: "Why is your portfolio an RPG?",
      id: "Kenapa portofolionya RPG?",
    },
    a: {
      en: "Because I believe portfolios should be memorable, not just readable. The game doubles as proof — every NPC, battle, and minigame is real front-end engineering.",
      id: "Karena saya percaya portofolio harus mudah diingat, bukan hanya mudah dibaca. Game-nya sekaligus bukti — setiap NPC, battle, dan minigame adalah rekayasa front-end nyata.",
    },
  },
  {
    q: {
      en: "What kind of projects do you take on?",
      id: "Jenis proyek apa yang kamu kerjakan?",
    },
    a: {
      en: "Full-stack web apps: databases with search and filters, dashboards, auth-protected tools, and anything that needs a thoughtful UI. If it runs in a browser, I can probably build it.",
      id: "Aplikasi web full-stack: database dengan pencarian dan filter, dashboard, tools berproteksi auth, dan apa pun yang butuh UI yang matang. Kalau jalan di browser, kemungkinan besar bisa saya bangun.",
    },
  },
];

export interface Testimonial {
  quote: L;
  name: string;
  role: L;
  project: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "He took my messy photocard spreadsheets and turned them into a real product. The price tracking alone saves me hours every week.",
      id: "Dia mengubah spreadsheet photocard berantakan saya jadi produk sungguhan. Pelacak harganya saja sudah menghemat waktu berjam-jam tiap minggu.",
    },
    name: "Rina A.",
    role: { en: "K-Pop collector & shop owner", id: "Kolektor & pemilik toko K-Pop" },
    project: "HIBIKISHOP PC",
  },
  {
    quote: {
      en: "The deck builder actually understands card synergy. My playgroup thought I hired a pro — it was just DuelDex.",
      id: "Deck builder-nya benar-benar paham sinergi kartu. Teman main saya kira saya sewa profesional — ternyata cuma DuelDex.",
    },
    name: "Dimas P.",
    role: { en: "Competitive Yu-Gi-Oh! player", id: "Pemain Yu-Gi-Oh! kompetitif" },
    project: "DuelDex",
  },
  {
    quote: {
      en: "Our relatives are not tech people, yet the whole family figured out the tree app in minutes. That's good design.",
      id: "Kerabat kami bukan orang tech, tapi seluruh keluarga paham aplikasi silsilah dalam hitungan menit. Itu desain yang bagus.",
    },
    name: "Sari W.",
    role: { en: "Family administrator", id: "Admin keluarga" },
    project: "Family Tree",
  },
];

export interface UsesCategory {
  category: L;
  items: string[];
}

export const usesGear: UsesCategory[] = [
  {
    category: { en: "Hardware", id: "Perangkat Keras" },
    items: [
      "Laptop (daily driver for every quest)",
      "External monitor for multi-window debugging",
      "Mechanical keyboard — the real boss fight is the typing",
      "Wireless mouse",
      "Budget IEMs for focus mode",
    ],
  },
  {
    category: { en: "Workspace", id: "Ruang Kerja" },
    items: [
      "VS Code with a dark pixel-ish theme",
      "Arc browser for research tabs (too many tabs)",
      "Notion for quest planning",
      "Figma for quick UI sketches",
    ],
  },
];

export const usesSoftware: UsesCategory[] = [
  {
    category: { en: "Daily Drivers", id: "Alat Harian" },
    items: [
      "Nuxt 4 + Vue 3 — primary framework",
      "Tailwind CSS — styling at the speed of thought",
      "Bun — runtime, package manager, and test runner",
      "Elysia — lightweight backend framework",
      "Turso (libSQL) — edge-friendly database",
      "Drizzle ORM — type-safe queries",
    ],
  },
  {
    category: { en: "DevOps & Tools", id: "DevOps & Tools" },
    items: [
      "Vercel — deploys in seconds",
      "GitHub — version control & CI",
      "TypeScript — everywhere it counts",
      "Vitest — fast unit tests",
      "Oxlint — lint that keeps up",
    ],
  },
  {
    category: { en: "Learning Queue", id: "Antrean Belajar" },
    items: [
      "WebGL / shaders for juicier pixel effects",
      "Rust + WASM experiments",
      "AI-assisted refactoring workflows",
    ],
  },
];

export interface CaseStudyExtra {
  challenge: L;
  solution: L;
  results: L[];
}

export const caseStudyExtras: Record<string, CaseStudyExtra> = {
  "kpop-photocard-tracker": {
    challenge: {
      en: "Collectors tracked prices across scattered sources — marketplaces, social media, and spreadsheets. Nothing showed the full picture, and price moves happened overnight.",
      id: "Kolektor melacak harga dari sumber yang tersebar — marketplace, media sosial, dan spreadsheet. Tidak ada yang menampilkan gambaran utuh, dan pergerakan harga terjadi semalaman.",
    },
    solution: {
      en: "Built an SSR app that auto-syncs 16,000+ cards daily from Pocamarket, enriches releases with MusicBrainz and Apple Music, and surfaces the biggest 36-hour price movers on the homepage. Faceted filters and a command palette keep navigation fast.",
      id: "Membangun aplikasi SSR yang sinkron otomatis 16.000+ kartu harian dari Pocamarket, memperkaya rilis dengan MusicBrainz dan Apple Music, dan menampilkan pergerakan harga terbesar 36 jam di beranda. Filter berlapis dan command palette menjaga navigasi tetap cepat.",
    },
    results: [
      {
        en: "16,200+ photocards searchable in milliseconds",
        id: "16.200+ photocard bisa dicari dalam milidetik",
      },
      {
        en: "Daily 00:00 WIB cron keeps data fresh with zero manual work",
        id: "Cron harian 00.00 WIB menjaga data segar tanpa kerja manual",
      },
      {
        en: "Collection binder with wishlist tracking per user",
        id: "Binder koleksi dengan pelacakan wishlist per pengguna",
      },
      {
        en: "ID/EN toggle — built for a bilingual collector community",
        id: "Toggle ID/EN — dibangun untuk komunitas kolektor dwibahasa",
      },
    ],
  },
  dueldex: {
    challenge: {
      en: "Card databases let you search, but none of them can build a deck for you. Players still had to know banlists, synergy, and ratios by heart.",
      id: "Database kartu memungkinkan pencarian, tapi tidak ada yang bisa menyusun deck untukmu. Pemain masih harus hafal banlist, sinergi, dan rasio.",
    },
    solution: {
      en: "Created a monorepo with an Elysia API and a Nuxt web app. Selecting any card triggers a deck recommendation engine that scores card synergy, detects archetypes, and enforces the current TCG banlist — all persisted with JWT-auth accounts on Turso.",
      id: "Membuat monorepo dengan Elysia API dan aplikasi web Nuxt. Memilih kartu apa pun memicu mesin rekomendasi deck yang menilai sinergi, mendeteksi arketipe, dan menegakkan banlist TCG terkini — semuanya tersimpan dengan akun JWT-auth di Turso.",
    },
    results: [
      {
        en: "Complete competitive decks generated from a single card pick",
        id: "Deck kompetitif lengkap dihasilkan dari satu pilihan kartu",
      },
      {
        en: "Banlist badges (Forbidden/Limited) integrated into search",
        id: "Badge banlist (Forbidden/Limited) terintegrasi di pencarian",
      },
      {
        en: "Favorites + deck saving with secure HMAC-SHA256 JWT auth",
        id: "Favorit + simpan deck dengan JWT auth HMAC-SHA256 aman",
      },
    ],
  },
  "family-tree": {
    challenge: {
      en: "Genealogy data is deeply relational, but the users are families — including grandparents. The app had to be powerful for admins and simple for everyone else.",
      id: "Data silsilah sangat relasional, tapi penggunanya adalah keluarga — termasuk kakek nenek. Aplikasi harus kuat untuk admin dan sederhana untuk semua orang.",
    },
    solution: {
      en: "Designed a 4-step creation wizard (Person → Spouse → Children → Review) over a Drizzle + Turso backend, then visualized the result with an interactive D3-based family chart. Role-based access keeps editing safe.",
      id: "Merancang wizard pembuatan 4 langkah (Orang → Pasangan → Anak → Tinjau) di atas backend Drizzle + Turso, lalu memvisualisasikannya dengan family chart D3 interaktif. Akses berbasis role menjaga proses editing tetap aman.",
    },
    results: [
      {
        en: "Non-technical family members onboarded in minutes",
        id: "Anggota keluarga non-teknis bisa langsung pakai dalam hitungan menit",
      },
      {
        en: "Dashboard with family stats, gender ratio & birthday reminders",
        id: "Dashboard dengan statistik keluarga, rasio gender & pengingat ulang tahun",
      },
      {
        en: "Multi-language (ID/EN/Sunda) + CSV export + dark mode",
        id: "Multi-bahasa (ID/EN/Sunda) + ekspor CSV + mode gelap",
      },
    ],
  },
};
