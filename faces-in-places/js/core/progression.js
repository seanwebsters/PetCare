// XP, levels and badges.

import { CATEGORIES } from "./catalog.js";

export const CHALLENGE_XP = 50;
export const STREAK_BONUS_XP = 10; // per streak day, capped
export const SHARE_XP = 5;

// Level n starts at 50 * n * (n - 1) XP: 0, 100, 300, 600, 1000...
export const xpForLevel = (level) => 50 * level * (level - 1);

export function levelFromXp(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, into: xp - start, span: next - start, progress: (xp - start) / (next - start) };
}

export const LEVEL_TITLES = ["Face Finder", "Street Spotter", "Window Watcher", "Block Hunter", "City Seeker", "Pareidoliac", "Face Whisperer", "Legend of the Lanes"];
export const levelTitle = (level) => LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, level - 1)];

export const BADGES = [
  { id: "first", emoji: "👀", title: "First Face", desc: "Collect your first Blockie", test: (s) => s.blockies.length >= 1 },
  { id: "ten", emoji: "🧺", title: "Collector", desc: "Collect 10 Blockies", test: (s) => s.blockies.length >= 10 },
  { id: "rare", emoji: "💎", title: "Rare Hunter", desc: "Find a Rare (or better)", test: (s) => s.blockies.some((b) => b.rarity !== "common") },
  { id: "epic", emoji: "🔮", title: "Epic Eye", desc: "Find an Epic (or better)", test: (s) => s.blockies.some((b) => b.rarity === "epic" || b.rarity === "legendary") },
  { id: "legendary", emoji: "🌟", title: "Living Legend", desc: "Find a Legendary", test: (s) => s.blockies.some((b) => b.rarity === "legendary") },
  { id: "streak3", emoji: "🔥", title: "On Fire", desc: "3-day challenge streak", test: (s) => s.bestStreak >= 3 },
  { id: "streak7", emoji: "☄️", title: "Unstoppable", desc: "7-day challenge streak", test: (s) => s.bestStreak >= 7 },
  { id: "streak30", emoji: "🌋", title: "Inferno", desc: "30-day challenge streak", test: (s) => s.bestStreak >= 30 },
  { id: "explorer", emoji: "🧭", title: "Explorer", desc: "Find faces in 3 neighbourhoods", test: (s) => new Set(s.blockies.map((b) => b.place?.neighbourhoodId).filter(Boolean)).size >= 3 },
  { id: "set", emoji: "🧩", title: "Full Set", desc: "One Blockie from every category", test: (s) => CATEGORIES.every((c) => s.blockies.some((b) => b.category === c.id)) },
  { id: "social", emoji: "📣", title: "Show-Off", desc: "Share 3 discoveries", test: (s) => s.blockies.filter((b) => b.shared).length >= 3 },
  { id: "challenger", emoji: "🏅", title: "Challenger", desc: "Complete 5 daily challenges", test: (s) => s.challengesCompleted.length >= 5 },
];

export const earnedBadges = (state) => BADGES.filter((b) => b.test(state)).map((b) => b.id);
