import { $, $$, esc, icon, sheet, toast } from "../ui.js";
import { state, level, currentStreak, updateProfile, resetAll } from "../store.js";
import { BADGES, levelTitle } from "../core/progression.js";
import { CATEGORIES, RARITIES } from "../core/catalog.js";
import { createGenerator } from "../ai/generator.js";

const AVATARS = ["😎", "🦊", "🐸", "🦉", "🐙", "🐝", "🐼", "🦄", "🤖", "👽", "🐲", "🍄"];
const COLOURS = ["#ff6a3d", "#7a5cff", "#2fa8ff", "#3dbf7f", "#ff5fa2", "#f5b400"];

export default function profile(root) {
  function draw() {
    const lv = level();
    const hoods = new Set(state.blockies.map((b) => b.place?.neighbourhoodId).filter(Boolean)).size;
    const ring = 2 * Math.PI * 52;
    root.innerHTML = `
      <header class="page-head page-head--bar">
        <a class="icon-btn" href="#/home" aria-label="Back">${icon.back}</a>
        <b>Profile</b>
        <button class="icon-btn" id="edit" aria-label="Edit profile">✏️</button>
      </header>

      <section class="me">
        <div class="me__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" stroke-dasharray="${ring}" stroke-dashoffset="${ring * (1 - lv.progress)}"/></svg>
          <span class="avatar avatar--xl" style="--c:${state.profile.color}">${esc(state.profile.avatar)}</span>
          <span class="me__level">Lv ${lv.level}</span>
        </div>
        <h1 class="display-sm">${esc(state.profile.name)}</h1>
        <p class="muted">${esc(state.profile.handle)} · ${levelTitle(lv.level)}</p>
        <div class="xpbar"><i style="width:${(lv.progress * 100).toFixed(1)}%"></i></div>
        <p class="small muted">${lv.into} / ${lv.span} XP to level ${lv.level + 1}</p>
      </section>

      <section class="stats">
        <div><b>${state.blockies.length}</b><span>Blockies</span></div>
        <div><b>${icon.flame}${currentStreak()}</b><span>Streak</span></div>
        <div><b>${state.bestStreak}</b><span>Best streak</span></div>
        <div><b>${state.challengesCompleted.length}</b><span>Challenges</span></div>
        <div><b>${hoods}</b><span>Areas</span></div>
        <div><b>${state.xp}</b><span>Total XP</span></div>
      </section>

      <section class="panel">
        <div class="section-head"><h3>Badges</h3><span class="muted">${state.badges.length}/${BADGES.length}</span></div>
        <div class="badges">
          ${BADGES.map((b) => `<div class="badge ${state.badges.includes(b.id) ? "" : "is-locked"}" title="${esc(b.desc)}"><span>${b.emoji}</span><b>${b.title}</b><small>${b.desc}</small></div>`).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h3>Collection progress</h3></div>
        <div class="progress-list">
          ${CATEGORIES.map((c) => {
            const n = state.blockies.filter((b) => b.category === c.id).length;
            const best = RARITIES.slice().reverse().find((r) => state.blockies.some((b) => b.category === c.id && b.rarity === r.id));
            return `<div class="progress-item"><span>${c.emoji}</span><div><b>${c.label}</b><div class="bar"><i style="width:${Math.min(100, n * 20)}%"></i></div></div><small>${n ? `${n} · best ${best.label}` : "None yet"}</small></div>`;
          }).join("")}
        </div>
      </section>

      <section class="plus">
        <div class="plus__badge">Blockies<b>+</b></div>
        <h3>Make every find extra</h3>
        <ul>
          <li>✨ Exclusive outfits & animated accessories</li>
          <li>🎨 Remix colours and re-sculpt your Blockies</li>
          <li>🗂 Unlimited custom shelves & collections</li>
          <li>🧸 Early access to physical figures</li>
        </ul>
        <button class="btn btn--light btn--block" id="plus">£3.99/month · Coming soon</button>
      </section>

      <section class="panel settings-list">
        <div class="row-btn row-btn--static"><span>🧠 Blockie studio</span><span class="muted small">${createGenerator().name}</span></div>
        <button class="row-btn" id="replay">👋 Replay the intro</button>
        <button class="row-btn row-btn--danger" id="reset">${icon.trash} Reset prototype data</button>
      </section>
      <p class="muted small center">Faces in Places · prototype · Everywhere has a face.</p>
    `;

    $("#edit", root).onclick = editProfile;
    $("#plus", root).onclick = () => toast("Blockies+ isn't live yet — thanks for the interest!", { emoji: "💛" });
    $("#replay", root).onclick = () => import("./onboarding.js").then((m) => m.default());
    $("#reset", root).onclick = () =>
      sheet(`<h2 class="display-sm">Start over?</h2><p class="muted">This wipes your Blockies, XP and streak on this device.</p><div class="stack"><button class="btn btn--danger" id="doReset">Reset everything</button><button class="btn btn--ghost" data-close>Cancel</button></div>`, {
        onMount: (el, close) =>
          ($("#doReset", el).onclick = () => {
            resetAll();
            close();
            draw();
            toast("Fresh start! Go find some faces.", { emoji: "🌱" });
          }),
      });
  }

  function editProfile() {
    sheet(
      `<h2 class="display-sm">Edit profile</h2>
       <form class="stack" id="pf">
         <label class="label">Name<input class="input" name="name" maxlength="20" value="${esc(state.profile.name)}"></label>
         <label class="label">Handle<input class="input" name="handle" maxlength="20" value="${esc(state.profile.handle)}"></label>
         <p class="label">Avatar</p>
         <div class="picker">${AVATARS.map((a) => `<button type="button" class="pick ${a === state.profile.avatar ? "is-on" : ""}" data-avatar="${a}">${a}</button>`).join("")}</div>
         <p class="label">Colour</p>
         <div class="picker">${COLOURS.map((c) => `<button type="button" class="pick pick--colour ${c === state.profile.color ? "is-on" : ""}" data-colour="${c}" style="--c:${c}" aria-label="Colour ${c}"></button>`).join("")}</div>
         <button class="btn btn--primary">Save</button>
       </form>`,
      {
        label: "Edit profile",
        onMount: (el, close) => {
          let avatar = state.profile.avatar, color = state.profile.color;
          for (const b of $$("[data-avatar]", el)) b.onclick = () => ((avatar = b.dataset.avatar), $$("[data-avatar]", el).forEach((x) => x.classList.toggle("is-on", x === b)));
          for (const b of $$("[data-colour]", el)) b.onclick = () => ((color = b.dataset.colour), $$("[data-colour]", el).forEach((x) => x.classList.toggle("is-on", x === b)));
          $("#pf", el).onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            let handle = String(fd.get("handle") || "").trim().replace(/\s+/g, "");
            if (handle && !handle.startsWith("@")) handle = "@" + handle;
            updateProfile({ name: String(fd.get("name") || "").trim() || "You", handle: handle || state.profile.handle, avatar, color });
            close();
            draw();
          };
        },
      },
    );
  }

  draw();
}
