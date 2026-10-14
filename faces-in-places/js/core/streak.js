// Daily streak rules. A streak day = completing that day's challenge.
// Days are UTC dates ("YYYY-MM-DD") so everyone's day flips at the same moment
// as the shared daily challenge.
//
// Freezes: every 7th streak day earns a freeze (max 2 banked). Missed days are
// covered by banked freezes when you next complete a challenge; if you missed
// more days than you have freezes, the streak restarts at 1.

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 365];
export const FREEZE_EVERY = 7;
export const MAX_FREEZES = 2;

const DAY = 86400000;
const toUtc = (key) => Date.parse(`${key}T00:00:00Z`);
export const daysBetween = (fromKey, toKey) => Math.round((toUtc(toKey) - toUtc(fromKey)) / DAY);
export const addDays = (key, n) => new Date(toUtc(key) + n * DAY).toISOString().slice(0, 10);

export function nextMilestone(streak) {
  return STREAK_MILESTONES.find((m) => m > streak) ?? null;
}

// What the player should see right now.
export function streakStatus({ streak = 0, lastDay = null, freezes = 0 }, today) {
  if (!lastDay || streak <= 0) return { streak: 0, doneToday: false, alive: false, atRisk: false, missed: 0, freezesNeeded: 0 };
  const gap = daysBetween(lastDay, today);
  if (gap <= 0) return { streak, doneToday: true, alive: true, atRisk: false, missed: 0, freezesNeeded: 0 };
  const missed = gap - 1;
  if (missed <= freezes) return { streak, doneToday: false, alive: true, atRisk: true, missed, freezesNeeded: missed };
  return { streak: 0, doneToday: false, alive: false, atRisk: false, missed, freezesNeeded: 0, lost: streak };
}

// Apply today's challenge completion. Returns the new streak state plus what
// happened, so the UI can celebrate it.
export function completeDay({ streak = 0, best = 0, lastDay = null, freezes = 0, frozenDays = [] }, today) {
  const status = streakStatus({ streak, lastDay, freezes }, today);
  if (status.doneToday) {
    return { next: { streak, best, lastDay, freezes, frozenDays }, events: { alreadyDone: true } };
  }

  let usedFreezes = 0;
  let newFrozen = frozenDays;
  let nextStreak;
  if (status.alive) {
    usedFreezes = status.freezesNeeded;
    // Mark the covered days so the calendar can show them as frozen.
    newFrozen = [...frozenDays, ...Array.from({ length: usedFreezes }, (_, i) => addDays(lastDay, i + 1))];
    nextStreak = streak + 1;
  } else {
    nextStreak = 1;
  }

  let nextFreezes = freezes - usedFreezes;
  let earnedFreeze = false;
  if (nextStreak % FREEZE_EVERY === 0 && nextFreezes < MAX_FREEZES) {
    nextFreezes += 1;
    earnedFreeze = true;
  }

  return {
    next: { streak: nextStreak, best: Math.max(best, nextStreak), lastDay: today, freezes: nextFreezes, frozenDays: newFrozen.slice(-60) },
    events: {
      extended: status.alive,
      restarted: !status.alive && streak > 0,
      lost: status.alive ? 0 : (status.lost ?? 0),
      usedFreezes,
      earnedFreeze,
      milestone: STREAK_MILESTONES.includes(nextStreak) ? nextStreak : null,
      newBest: nextStreak > best,
    },
  };
}
