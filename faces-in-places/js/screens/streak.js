import { esc, sheet } from "../ui.js";
import { streakInfo, todaysChallenge } from "../store.js";
import { dayKey, msUntilReset } from "../core/challenges.js";
import { STREAK_MILESTONES, FREEZE_EVERY, MAX_FREEZES, nextMilestone, addDays } from "../core/streak.js";
import { STREAK_BONUS_XP, CHALLENGE_XP } from "../core/progression.js";

export function untilReset() {
  const ms = msUntilReset();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h ? `${h}h ${m}m` : `${m}m`;
}

// The animated flame badge. `lit` = streak alive.
export function flame(n, { size = "md", lit = n > 0 } = {}) {
  return `<span class="flame flame--${size} ${lit ? "" : "flame--out"}" aria-label="${n}-day streak">
    <svg viewBox="0 0 64 72" aria-hidden="true">
      <path class="flame__outer" d="M32 2c2 11 16 17 16 35a16 16 0 0 1-32 0c0-8 4-13 8-17 .6 5 3 8.6 6.4 10C29.6 19 30.6 10 32 2z"/>
      <path class="flame__inner" d="M32 32c1 5.5 7.5 8 7.5 14.5a7.5 7.5 0 0 1-15 0c0-4.5 3-8 7.5-14.5z"/>
    </svg>
    <b>${n}</b>
  </span>`;
}

// Home banner: streak at risk, freeze about to be used, or a streak just ended.
export function streakBanner() {
  const s = streakInfo();
  if (s.doneToday) return "";
  if (s.atRisk) {
    const freezeNote = s.freezesNeeded ? `🧊 ${s.freezesNeeded === 1 ? "A freeze is covering the day" : `${s.freezesNeeded} freezes are covering the days`} you missed. ` : "";
    return `<button class="streak-banner streak-banner--risk" data-open-streak>
      ${flame(s.streak, { size: "sm" })}
      <span><b>Keep your ${s.streak}-day streak alive!</b><small>${freezeNote}Complete today's challenge in the next ${untilReset()}.</small></span>
    </button>`;
  }
  if (s.unseenLoss) {
    return `<button class="streak-banner streak-banner--lost" data-ack-loss>
      ${flame(0, { size: "sm", lit: false })}
      <span><b>Your ${s.unseenLoss}-day streak ended</b><small>Every legend restarts. Beat today's challenge to light a new one.</small></span>
    </button>`;
  }
  return "";
}

function calendar(s) {
  const today = dayKey();
  const done = new Set(s.completedDays);
  const frozen = new Set(s.frozenDays);
  // 5 weeks, Monday-first, ending with the current week.
  const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7;
  const start = addDays(today, -dow - 28);
  const cells = [];
  for (let i = 0; i < 35; i++) {
    const key = addDays(start, i);
    const future = key > today;
    const state = future ? "future" : done.has(key) ? "done" : frozen.has(key) ? "frozen" : key === today ? "today" : "missed";
    const day = Number(key.slice(8));
    cells.push(`<i class="cal__day cal__day--${state}" title="${key}">${state === "frozen" ? "🧊" : day}</i>`);
  }
  return `<div class="cal">
    ${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<span>${d}</span>`).join("")}
    ${cells.join("")}
  </div>
  <div class="cal__legend"><span><i class="cal__day cal__day--done"></i>Challenge done</span><span><i class="cal__day cal__day--frozen">🧊</i>Freeze used</span><span><i class="cal__day cal__day--missed"></i>Missed</span></div>`;
}

export function openStreakSheet() {
  const s = streakInfo();
  const { completed } = todaysChallenge();
  const next = nextMilestone(s.streak);
  const prev = [...STREAK_MILESTONES].reverse().find((m) => m <= s.streak) ?? 0;
  const pct = next ? ((s.streak - prev) / (next - prev)) * 100 : 100;
  const status = s.doneToday
    ? `Today's done ✓ Come back tomorrow for day ${s.streak + 1}.`
    : s.atRisk
      ? `Complete today's challenge in ${untilReset()} to reach day ${s.streak + 1}.`
      : `Complete today's challenge to start a streak.`;
  const toFreeze = FREEZE_EVERY - (s.streak % FREEZE_EVERY);

  sheet(
    `<div class="streak-sheet">
      <div class="streak-hero ${s.alive ? "" : "streak-hero--out"}">
        ${flame(s.streak, { size: "xl", lit: s.alive })}
        <h2 class="display-sm">${s.streak ? `${s.streak}-day streak` : "No streak yet"}</h2>
        <p class="muted">${esc(status)}</p>
        ${completed ? "" : `<a class="btn btn--primary" href="#/scan?challenge=1">Do today's challenge</a>`}
      </div>

      <div class="streak-stats">
        <div><b>${s.streak}</b><span>Current</span></div>
        <div><b>${s.best}</b><span>Best</span></div>
        <div><b>${s.completedDays.length}</b><span>Days done</span></div>
      </div>

      <section class="streak-block">
        <div class="section-head"><h3>Streak freezes</h3><span class="muted">${s.freezes}/${MAX_FREEZES}</span></div>
        <div class="freezes">${Array.from({ length: MAX_FREEZES }, (_, i) => `<span class="freeze ${i < s.freezes ? "freeze--on" : ""}">🧊</span>`).join("")}
          <p class="small muted">A freeze automatically covers a missed day. ${s.freezes >= MAX_FREEZES ? "Your freezes are full." : `Earn one in <b>${toFreeze}</b> more streak day${toFreeze === 1 ? "" : "s"}.`}</p>
        </div>
      </section>

      <section class="streak-block">
        <div class="section-head"><h3>Milestones</h3><span class="muted">${next ? `${next - s.streak} to go` : "All done!"}</span></div>
        <div class="bar bar--flame"><i style="width:${pct.toFixed(1)}%"></i></div>
        <div class="milestone-row">${STREAK_MILESTONES.map((m) => `<span class="${s.best >= m ? "is-hit" : ""} ${m === next ? "is-next" : ""}">${m}</span>`).join("")}</div>
      </section>

      <section class="streak-block">
        <div class="section-head"><h3>Last 5 weeks</h3></div>
        ${calendar(s)}
      </section>

      <details class="why">
        <summary>How streaks work</summary>
        <ul>
          <li><span>Complete the daily challenge to add a day</span><b>🔥</b></li>
          <li><span>Each challenge pays ${CHALLENGE_XP} XP + ${STREAK_BONUS_XP} XP per streak day (up to ${STREAK_BONUS_XP * 10})</span><b>⚡</b></li>
          <li><span>Every ${FREEZE_EVERY} days earns a freeze (hold up to ${MAX_FREEZES})</span><b>🧊</b></li>
          <li><span>Days reset at midnight UTC for everyone</span><b>🌍</b></li>
        </ul>
      </details>
    </div>`,
    { label: "Your streak" },
  );
}
