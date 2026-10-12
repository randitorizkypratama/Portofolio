import { getLevel, levelProgress } from "./level";
import { getGold } from "./gold";
import { getTotalHearts } from "./friendship";
import { getStats, getUnlockedIds, ACHIEVEMENT_DEFS } from "./achievements";
import { getTitle } from "./titles";
import { getActiveSkin } from "./skins";

/** Draws a shareable character card (800×420) and returns the canvas. */
export function drawCharacterCard(): HTMLCanvasElement {
  const W = 800;
  const H = 420;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) return canvas;

  const skin = getActiveSkin();
  const level = getLevel();
  const expPct = levelProgress();
  const gold = getGold();
  const hearts = getTotalHearts();
  const stats = getStats();
  const unlocked = getUnlockedIds();
  const title = getTitle();

  // Background
  g.fillStyle = "#0f1923";
  g.fillRect(0, 0, W, H);
  g.strokeStyle = "#d4a847";
  g.lineWidth = 6;
  g.strokeRect(8, 8, W - 16, H - 16);
  g.strokeStyle = "#3a4256";
  g.lineWidth = 2;
  g.strokeRect(16, 16, W - 32, H - 32);

  // Pixel avatar (simple head + hoodie in skin colors)
  const ax = 48;
  const ay = 64;
  g.fillStyle = "#2a2a38";
  g.fillRect(ax + 8, ay, 48, 20); // hair
  g.fillStyle = "#f0c8a0";
  g.fillRect(ax + 12, ay + 20, 40, 28); // face
  g.fillStyle = "#2a2a38";
  g.fillRect(ax + 20, ay + 30, 8, 8);
  g.fillRect(ax + 40, ay + 30, 8, 8);
  g.fillStyle = skin.colors.scarf;
  g.fillRect(ax + 4, ay + 48, 56, 12); // scarf
  g.fillStyle = skin.colors.body;
  g.fillRect(ax, ay + 60, 64, 56); // hoodie
  g.fillStyle = skin.colors.dark;
  g.fillRect(ax, ay + 100, 64, 16);
  g.fillStyle = "#f0c8a0";
  g.fillRect(ax - 8, ay + 72, 12, 12);
  g.fillRect(ax + 60, ay + 72, 12, 12);

  // Name + title
  g.fillStyle = "#f0e6d2";
  g.font = 'bold 34px "Press Start 2P", monospace';
  g.fillText("FIXDIRILOE", 160, 88);
  g.fillStyle = "#d4a847";
  g.font = '14px "Press Start 2P", monospace';
  g.fillText(title.toUpperCase(), 160, 120);

  // LV chip + EXP bar
  g.fillStyle = "#1e293b";
  g.fillRect(160, 142, 90, 34);
  g.strokeStyle = "#d4a847";
  g.lineWidth = 2;
  g.strokeRect(160, 142, 90, 34);
  g.fillStyle = "#d4a847";
  g.font = 'bold 16px "Press Start 2P", monospace';
  g.fillText(`LV ${level}`, 172, 166);

  g.fillStyle = "#1e293b";
  g.fillRect(268, 142, 300, 34);
  g.strokeStyle = "#3a4256";
  g.strokeRect(268, 142, 300, 34);
  g.fillStyle = "#8ae6b0";
  g.fillRect(271, 145, 294 * expPct, 28);
  g.fillStyle = "#94a3b8";
  g.font = '10px "Press Start 2P", monospace';
  g.fillText(`${Math.round(expPct * 100)}% EXP`, 360, 192);

  // Hearts + gold
  g.font = 'bold 18px "Press Start 2P", monospace';
  g.fillStyle = "#e05a6a";
  g.fillText(`♥♥♥ X${hearts}`, 160, 232);
  g.fillStyle = "#d4a847";
  g.fillText(`GOLD ◆${gold}`, 400, 232);

  // Achievements
  g.fillStyle = "#94a3b8";
  g.font = '11px "Press Start 2P", monospace';
  g.fillText(`ACHIEVEMENTS ${unlocked.length}/${ACHIEVEMENT_DEFS.length}`, 160, 272);

  // Stat rows
  g.font = '11px "Press Start 2P", monospace';
  const rows: [string, string][] = [
    ["STEPS", String(stats.steps ?? 0)],
    ["FISH CAUGHT", String(stats.fish ?? 0)],
    ["GEMS MINED", String(stats.gems ?? 0)],
    ["CROPS HARVESTED", String(stats.harvest ?? 0)],
  ];
  rows.forEach(([label, value], i) => {
    const x = 160 + (i % 2) * 260;
    const y = 310 + Math.floor(i / 2) * 36;
    g.fillStyle = "#64748b";
    g.fillText(label, x, y);
    g.fillStyle = "#f0e6d2";
    g.fillText(value, x + 170, y);
  });

  // Footer
  g.fillStyle = "#64748b";
  g.font = '10px "Press Start 2P", monospace';
  g.fillText("PIXEL QUEST — github.com/fixdiriloe", 160, H - 40);

  return canvas;
}

/** Generates the card and triggers a PNG download. */
export function downloadCharacterCard(): void {
  const canvas = drawCharacterCard();
  const link = document.createElement("a");
  link.download = "fixdiriloe-character-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
