import { useState, useEffect } from "react";
import { Star, Users, FolderGit2, ExternalLink } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";
import { sfx } from "../game/sfx";
import { useLocale, pick } from "../i18n";
import { ui } from "../data/content";

interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
}

interface GhStats {
  repos: number;
  followers: number;
  totalStars: number;
  topRepos: GhRepo[];
}

const CACHE_KEY = "pq_gh_stats_v1";
const CACHE_MS = 15 * 60 * 1000;

const username = siteConfig.socials.github.split("/").filter(Boolean).pop()!;

async function fetchGithub(): Promise<GhStats> {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null") as
      | { ts: number; data: GhStats }
      | null;
    if (cached && Date.now() - cached.ts < CACHE_MS) return cached.data;
  } catch {
    /* ignore */
  }

  const [uRes, rRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);
  if (!uRes.ok || !rRes.ok) throw new Error("GitHub API failed");

  const user = (await uRes.json()) as { public_repos: number; followers: number };
  const repos = (await rRes.json()) as (GhRepo & { fork: boolean })[];
  const owned = repos.filter((r) => !r.fork);
  const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topRepos = [...owned]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(({ name, html_url, description, stargazers_count }) => ({
      name,
      html_url,
      description,
      stargazers_count,
    }));

  const data: GhStats = {
    repos: user.public_repos,
    followers: user.followers,
    totalStars,
    topRepos,
  };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* ignore */
  }
  return data;
}

export function GitHubStats() {
  const lang = useLocale();
  const [data, setData] = useState<GhStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchGithub()
      .then((d) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return null;

  const stats = [
    { icon: FolderGit2, label: "REPOS", value: data?.repos ?? "—" },
    { icon: Star, label: "STARS", value: data?.totalStars ?? "—" },
    { icon: Users, label: "FOLLOWERS", value: data?.followers ?? "—" },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="dialogue-box rounded-lg p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <span className="retro-font text-[8px] text-gold block mb-2">
                  ✦ GITHUB SCOUT ✦
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-cream">
                  {pick(ui.githubTitle, lang)}
                </h2>
              </div>
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sfx.hover()}
                className="retro-font text-[6px] text-text-secondary hover:text-gold px-3 py-1.5 border border-border hover:border-gold/40 rounded transition-all flex items-center gap-1.5"
              >
                @{username}
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Stat bars */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded border-2 border-border bg-bg-main/50 p-3 text-center"
                >
                  <Icon size={14} className="text-gold mx-auto mb-1.5" />
                  <p className="pixel-font text-[12px] text-cream mb-0.5">
                    {data ? value : "···"}
                  </p>
                  <p className="retro-font text-[5px] text-text-secondary">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Top repos */}
            <h3 className="retro-font text-[6px] text-gold mb-2">
              ✦ MOST STARRED
            </h3>
            <ul className="space-y-2">
              {(data?.topRepos ?? Array.from({ length: 3 })).map((repo, i) => {
                const r = repo as GhRepo | undefined;
                return (
                  <li key={r?.name ?? i}>
                    {r ? (
                      <a
                        href={r.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => sfx.hover()}
                        className="flex items-start justify-between gap-3 rounded border border-border/50 hover:border-gold/40 bg-bg-main/40 px-3 py-2 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="retro-font text-[6px] text-cream group-hover:text-gold transition-colors truncate">
                            {r.name}
                          </p>
                          {r.description && (
                            <p className="text-xs text-text-secondary truncate">
                              {r.description}
                            </p>
                          )}
                        </div>
                        <span className="retro-font text-[6px] text-gold flex items-center gap-1 shrink-0">
                          <Star size={9} />
                          {r.stargazers_count}
                        </span>
                      </a>
                    ) : (
                      <div className="rounded border border-border/50 bg-bg-main/40 px-3 py-2 animate-pulse h-[42px]" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
