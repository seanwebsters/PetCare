import { $, esc, icon, logoMark, tile, blockieArt, timeAgo, placeLabel } from "../ui.js";
import { state, currentStreak, todaysChallenge, level, streakInfo, acknowledgeStreakLoss } from "../store.js";
import { flame, streakBanner } from "./streak.js";
import { msUntilReset, dayKey } from "../core/challenges.js";
import { CHALLENGE_XP } from "../core/progression.js";
import { rarity as getRarity } from "../core/catalog.js";
import { friendBlockies, person } from "../data/seed.js";
import { composeBlockie } from "../core/factory.js";
import { syntheticAnalysis, defaultFace } from "../core/analysis.js";
import { renderBlockie } from "../render/blockie.js";

// A little character acting out today's challenge.
function challengeMascot(challenge) {
  const { traits } = composeBlockie({
    analysis: syntheticAnalysis({ hue: 196, sat: 0.7, light: 0.62, hash: 77 }),
    face: defaultFace(),
    category: challenge.rule.category || "street",
    mood: challenge.rule.mood || "happy",
    seed: 4242,
  });
  return renderBlockie(traits, { label: "" });
}

function countdown() {
  const ms = msUntilReset();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function weekStrip() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = dayKey(d);
    const done = state.challengesCompleted.includes(key);
    const frozen = !done && state.frozenDays.includes(key);
    days.push(`<li class="${done ? "done" : ""} ${frozen ? "frozen" : ""} ${i === 0 ? "today" : ""}"><span>${d.toLocaleDateString(undefined, { weekday: "narrow", timeZone: "UTC" })}</span><i>${done ? icon.check : frozen ? "🧊" : ""}</i></li>`);
  }
  return `<ol class="week">${days.join("")}</ol>`;
}

export function statusChips() {
  const lv = level();
  return `<div class="status-chips">
    <button class="chip chip--stat chip--streak ${streakInfo().atRisk ? "chip--risk" : ""}" data-open-streak aria-label="Streak: ${currentStreak()} days">${icon.flame}<b>${currentStreak()}</b></button>
    <a class="chip chip--stat" href="#/profile" aria-label="Level ${lv.level}">${icon.bolt}<b>Lv ${lv.level}</b></a>
    <a class="avatar avatar--sm" href="#/profile" style="--c:${state.profile.color}" aria-label="Your profile">${esc(state.profile.avatar)}</a>
  </div>`;
}

export default function home(root) {
  const { challenge, progress, completed } = todaysChallenge();
  const mine = state.blockies.slice(0, 8);
  const friendsToday = friendBlockies().sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  const dots = Array.from({ length: progress.target }, (_, i) => `<i class="${i < progress.current ? "on" : ""}"></i>`).join("");

  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#/home">${logoMark(34)}<span>Faces<br>in Places</span></a>
      ${statusChips()}
    </header>

    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow">${greeting()}, ${esc(state.profile.name)} 👋</p>
        <h1 class="display">Everywhere<br>has a <span class="hl">face.</span></h1>
      </div>
      <div class="hero__parade" aria-hidden="true">
        ${(mine.length >= 3 ? mine : friendsToday).slice(0, 3).map((b, i) => `<span class="hero__bk hero__bk--${i}">${blockieArt(b)}</span>`).join("")}
      </div>
    </section>

    ${streakBanner()}

    <section class="challenge ${completed ? "challenge--done" : ""}">
      <div class="challenge__head">
        <span class="eyebrow eyebrow--light">Today's challenge</span>
        <span class="challenge__timer" id="timer">⏱ ${countdown()}</span>
      </div>
      <div class="challenge__mascot" aria-hidden="true">${challengeMascot(challenge)}</div>
      <div class="challenge__main">
        <div class="challenge__emoji" aria-hidden="true">${challenge.emoji}</div>
        <div class="challenge__text">
          <h2>${esc(challenge.title)}</h2>
          <p>${esc(challenge.blurb)}</p>
        </div>
      </div>
      <div class="challenge__foot">
        <div class="challenge__dots" aria-label="${progress.current} of ${progress.target} found">${dots}<span>${progress.current}/${progress.target}</span></div>
        ${
          completed
            ? `<a class="btn btn--light" href="#/friends?tab=challenge">${icon.check} Done · See friends</a>`
            : `<a class="btn btn--light" href="#/scan?challenge=1">${icon.camera} Start hunting</a>`
        }
      </div>
      <p class="challenge__reward">${completed ? `Nice! You're on a ${currentStreak()}-day streak 🔥` : `+${CHALLENGE_XP} XP · ${currentStreak() ? `makes it day ${currentStreak() + 1} of your streak` : "starts your streak"}`}</p>
    </section>

    <section class="panel">
      <button class="streak-row" data-open-streak>
        ${flame(currentStreak(), { size: "md", lit: streakInfo().alive })}
        <span><h3>${currentStreak() ? `${currentStreak()}-day streak` : "Start a streak"}</h3><small class="muted">Best ${state.bestStreak} · ${"🧊".repeat(state.streakFreezes) || "no"} freeze${state.streakFreezes === 1 ? "" : "s"}</small></span>
        <span class="link">Details</span>
      </button>
      ${weekStrip()}
    </section>

    <section>
      <div class="section-head"><h3>Latest finds</h3>${mine.length ? `<a href="#/collection" class="link">See all</a>` : ""}</div>
      ${
        mine.length
          ? `<div class="hscroll">${mine.map((b) => tile(b)).join("")}</div>`
          : `<a class="empty-cta" href="#/scan">
              <div class="empty-cta__art">${friendsToday.slice(0, 3).map((b) => `<span>${blockieArt(b)}</span>`).join("")}</div>
              <div><b>Find your first face</b><p>Point your camera at anything with "eyes" — a house, a socket, a car.</p></div>
              <span class="btn btn--primary btn--sm">${icon.camera} Scan</span>
            </a>`
      }
    </section>

    <section>
      <div class="section-head"><h3>Friends are finding</h3><a href="#/friends" class="link">Feed</a></div>
      <div class="hscroll">
        ${friendsToday
          .map((b) => {
            const p = person(b.ownerId);
            return `<a class="mini-post" href="#/blockie/${b.id}">
              <div class="mini-post__art tile--${b.rarity}">${blockieArt(b)}</div>
              <div class="mini-post__who"><span class="avatar avatar--xs" style="--c:${p.color}">${p.avatar}</span>${esc(p.name)}</div>
              <div class="muted small">${getRarity(b.rarity).label} · ${esc(placeLabel(b))} · ${timeAgo(b.createdAt)}</div>
            </a>`;
          })
          .join("")}
      </div>
    </section>

    <a class="faceoff-teaser" href="#/friends?tab=faceoff">
      <span class="faceoff-teaser__vs">VS</span>
      <div><b>Today's Face-Off is live</b><p>Vote for the best face in the city.</p></div>
      <span class="faceoff-teaser__go">${icon.back}</span>
    </a>
  `;

  $("[data-ack-loss]", root)?.addEventListener("click", (e) => {
    acknowledgeStreakLoss();
    e.currentTarget.remove();
  });

  const timer = setInterval(() => {
    const el = $("#timer", root);
    if (el) el.textContent = `⏱ ${countdown()}`;
  }, 30000);
  return () => clearInterval(timer);
}
