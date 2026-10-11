# Pixel Quest — FixDiriloe Developer Portfolio

An interactive pixel-art RPG portfolio. Explore a living 2D village, talk to NPCs, clear quests (real projects!), fish, battle the final boss, and discover achievements — all while browsing a modern developer portfolio.

🌐 **Live:** https://pixel-quest-portfolio.vercel.app

## Features

### RPG World
- **Explore a 30×22 tile village** — WASD/Arrow keys to move, E/Space to interact (touch D-pad + E button on mobile)
- **Day/night cycle** based on your real local time — NPCs head home at night, and the Night Watch only appears after dark
- **Quest boards** — 3 real projects (HIBIKISHOP, DuelDex, Family Tree) with live demo links
- **Debug Dragon boss battle** — appears in the plaza after all 3 quests are cleared; JRPG-style battle box, timing-bar CRIT (gold core = free turn!), player HP + game over/retry, enrage phase with MERGE CONFLICT, Blessed Water items, victory confetti
- **Inventory & loot** — treasure chests on the map, coffee potions, Blessed Water (boss damage), Halloween candy
- **Waypoint stones** — 3 teleport shrines for fast travel
- **Fishing minigame** — cast a line at any water tile; 7 species incl. rare Golden Koi and night-only Moon Eel
- **Titles** — earned titles (Dragon Slayer, Master Angler...) float above your player
- **Friendship hearts** — talk to villagers to build hearts (♥ up to 5 per NPC); 3+ hearts unlock secret dialogue lines
- **Weather** — random rain & storm bursts
- **Testimonial NPCs + Hire Me portal** — real client stories and a glowing portal to contact
- **Halloween event (October)** — jack-o'-lanterns with candy, glowing pumpkins
- **Mini music player** — bottom-left corner track cycler
- **Water shimmer** — animated sparkle on ponds and the fountain
- **Pet slime** — a slime companion follows you everywhere
- **Hidden grove** — a secret warp tile and a hidden cat NPC (Momo)
- **Terrain-aware footstep sounds** — grass, stone path, and wooden bridge each sound different
- **Speedrun timer** with persisted best time

### Portfolio
- **Projects & skills** presented as quest boards and status panels
- **Quest Journal** (floating button) — places visited, quests cleared, fish log, and a **daily quest** that resets every day
- **Achievements system** — 20+ achievements with toast popups (Explorer, Angler, Dragon Slayer, Best Friend, Devotee…)
- **8-bit soundtrack** — 6 procedural chiptune tracks with an in-game jukebox + full SFX set
- **EXP scroll bar** that tracks page progress
- **Scroll of Updates** — changelog section
- **GitHub stats panel** (repos, stars, followers)
- **Contact form** (FormSubmit AJAX) and **visitor counter** at the Pixel Inn
- **CRT scanline toggle**, Konami code easter egg, hover blips, typewriter hero text
- **Vercel Analytics**, SEO meta/OG image, PWA manifest + service worker

## Tech Stack

- **React 19 + TypeScript** on **Vite** (Rolldown)
- **Tailwind CSS v4** (CSS-first config)
- **TanStack Router**
- **Motion** (Framer Motion successor)
- **Lucide** icons
- Audio: procedural WebAudio chiptune (no audio files)
- Deployed on **Vercel**

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview  # preview production build
```

## Project Structure

```
src/
  components/
    RPGWorld.tsx        # the game: map, player, NPCs, boss, fishing, battle UI
    QuestJournal.tsx    # journal modal (progress, fish log, daily quest)
    UpdateScroll.tsx    # changelog section
    PlayerProfile.tsx   # achievements + settings (SFX/BGM/CRT)
    ...                 # hero, about, projects, skills, contact, etc.
  game/
    entities.ts         # NPCs, boss dragon, dialogue
    tileMap.ts          # 30×22 tile map data
    achievements.ts     # stats + achievement definitions + track()
    daily.ts            # date-seeded daily quest
    friendship.ts       # per-NPC heart counter
    fishing.ts          # fish species + minigame constants
    music.ts / sfx.ts   # procedural chiptune BGM + sound effects
    dayNight.ts         # time-of-day tint + night flag
    journal.ts          # section/project visit tracking
    toast.ts            # global toast events
  data/
    portfolio.ts        # site config, projects, tech, changelog updates
  routes/
    routeTree.tsx       # root layout: start screen, EXP bar, sections
public/
  sw.js                 # service worker (network-first assets)
```

## Controls

| Input | Action |
| --- | --- |
| WASD / Arrows | Move |
| E / Space | Interact, talk, fish, attack |
| ESC | Pause menu |
| D-pad + E (mobile) | Touch controls |

## Deployment

Push to `main`, then deploy manually:

```bash
git push origin main
vercel deploy --prod --yes
```

## Author

**FixDiriloe** — frontend developer (Vue/Nuxt, TypeScript, Tailwind, Bun, Turso)
github.com/fixdiriloe
