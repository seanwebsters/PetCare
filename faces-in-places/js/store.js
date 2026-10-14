// Player state, persisted to localStorage. All game rules that mutate state
// live here so the screens stay presentational.

import { uid } from "./core/random.js";
import { rarity as getRarity } from "./core/catalog.js";
import { challengeForDate, challengeProgress, dayKey, findMatches } from "./core/challenges.js";
import { CHALLENGE_XP, STREAK_BONUS_XP, SHARE_XP, levelFromXp, earnedBadges } from "./core/progression.js";

const KEY = "fip:v1";

const fresh = () => ({
  version: 1,
  onboarded: false,
  profile: { name: "You", handle: "@facefinder", avatar: "😎", color: "#ff6a3d" },
  xp: 0,
  blockies: [],
  streak: 0,
  bestStreak: 0,
  lastChallengeDay: null,
  challengesCompleted: [],
  reactions: {},
  votes: {},
  badges: [],
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: play in memory */
  }
  return fresh();
}

export const state = load();
const listeners = new Set();
let storageWarning = null;

export const onStorageWarning = (fn) => (storageWarning = fn);
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageWarning?.("Your device storage is full — new finds are kept until you close the app.");
  }
  listeners.forEach((fn) => fn(state));
}

const yesterdayKey = (date = new Date()) => dayKey(new Date(date.getTime() - 86400000));

// Streak shown to the player: alive if the last completion was today or yesterday.
export function currentStreak(date = new Date()) {
  const last = state.lastChallengeDay;
  return last === dayKey(date) || last === yesterdayKey(date) ? state.streak : 0;
}

export const todaysFinds = (date = new Date()) => state.blockies.filter((b) => dayKey(new Date(b.createdAt)) === dayKey(date));

export function todaysChallenge(date = new Date()) {
  const challenge = challengeForDate(date);
  return { challenge, progress: challengeProgress(challenge, todaysFinds(date)), completed: state.challengesCompleted.includes(dayKey(date)) };
}

export const level = () => levelFromXp(state.xp);
export const getBlockie = (id) => state.blockies.find((b) => b.id === id);

// Would a find with this category/mood count towards today's challenge?
export const wouldMatchChallenge = (category, mood) => findMatches(challengeForDate(), { category, mood });

export function addBlockie(result, { photo, face, place, shared }) {
  const before = level().level;
  const badgesBefore = new Set(state.badges);
  const blockie = {
    ...result,
    id: uid("bk"),
    ownerId: "me",
    photo,
    face,
    place,
    shared: !!shared,
    accessory: "none",
    createdAt: Date.now(),
  };
  state.blockies.unshift(blockie);

  let xpGained = getRarity(blockie.rarity).xp + (shared ? SHARE_XP : 0);
  let challengeCompleted = false;
  const today = dayKey();
  const { progress } = todaysChallenge();
  if (progress.done && !state.challengesCompleted.includes(today)) {
    challengeCompleted = true;
    state.streak = state.lastChallengeDay === yesterdayKey() ? state.streak + 1 : 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.lastChallengeDay = today;
    state.challengesCompleted.push(today);
    xpGained += CHALLENGE_XP + Math.min(state.streak, 10) * STREAK_BONUS_XP;
  }
  state.xp += xpGained;
  state.badges = earnedBadges(state);
  save();

  return {
    blockie,
    xpGained,
    challengeCompleted,
    levelUp: level().level > before ? level().level : null,
    newBadges: state.badges.filter((id) => !badgesBefore.has(id)),
  };
}

export function updateBlockie(id, patch) {
  const b = getBlockie(id);
  if (!b) return null;
  let xpGained = 0;
  if (patch.shared && !b.shared) xpGained = SHARE_XP;
  Object.assign(b, patch);
  state.xp += xpGained;
  state.badges = earnedBadges(state);
  save();
  return { blockie: b, xpGained };
}

export function removeBlockie(id) {
  state.blockies = state.blockies.filter((b) => b.id !== id);
  state.badges = earnedBadges(state);
  save();
}

export function react(blockieId, emoji) {
  state.reactions[blockieId] = state.reactions[blockieId] === emoji ? null : emoji;
  save();
}

export function vote(pairKey, side) {
  state.votes[pairKey] = side;
  save();
}

export function updateProfile(patch) {
  Object.assign(state.profile, patch);
  save();
}

export function completeOnboarding() {
  state.onboarded = true;
  save();
}

export function resetAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  Object.assign(state, fresh(), { onboarded: true });
  save();
}
