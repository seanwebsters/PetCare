import { $, $$, esc, icon, blockieArt, photoSrc, placeLabel, timeAgo, sheet, tile, toast } from "../ui.js";
import { state, react, vote, todaysChallenge, todaysFinds, currentStreak, level } from "../store.js";
import { mulberry32 } from "../core/random.js";
import { dayIndex } from "../core/challenges.js";
import { RARITIES, rarity as getRarity, category as getCategory } from "../core/catalog.js";
import { FRIENDS, friendBlockies, communityBlockies, person, friendChallengeStatus } from "../data/seed.js";

const me = () => ({ id: "me", name: "You", avatar: state.profile.avatar, color: state.profile.color });

export function beforeAfter(b) {
  return `<div class="ba" style="--pos:50%">
    <img class="ba__photo" src="${photoSrc(b)}" alt="Original photo" draggable="false">
    <div class="ba__blockie tile--${b.rarity}">${blockieArt(b)}</div>
    <div class="ba__handle"><span>${icon.switch}</span></div>
    <span class="ba__tag ba__tag--l">Original</span><span class="ba__tag ba__tag--r">Blockie</span>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Slide to compare the original photo and the Blockie">
  </div>`;
}

export function bindBeforeAfter(root) {
  for (const ba of $$(".ba", root)) {
    $(".ba__range", ba).addEventListener("input", (e) => ba.style.setProperty("--pos", `${e.target.value}%`));
  }
}

let tab = "feed";
let round = 0;

export default function friends(root, { query }) {
  if (query.get("tab")) tab = query.get("tab");

  function draw() {
    root.innerHTML = `
      <header class="page-head">
        <div><p class="eyebrow">Friends</p><h1 class="display-sm">The crew</h1></div>
        <button class="btn btn--ghost btn--sm" id="invite">+ Invite</button>
      </header>
      <div class="friend-strip">
        ${FRIENDS.map((f) => `<button class="friend-bubble" data-friend="${f.id}"><span class="avatar" style="--c:${f.color}">${f.avatar}</span><b>${esc(f.name)}</b><small>${icon.flame}${f.streak}</small></button>`).join("")}
      </div>
      <div class="tabs" role="tablist">
        ${[["feed", "Feed"], ["faceoff", "Face-Off"], ["challenge", "Challenge"]].map(([id, label]) => `<button role="tab" aria-selected="${tab === id}" class="${tab === id ? "is-on" : ""}" data-tab="${id}">${label}</button>`).join("")}
      </div>
      <div id="tabBody">${tab === "feed" ? feed() : tab === "faceoff" ? faceOff() : challengeBoard()}</div>`;

    for (const b of $$("[data-tab]", root)) b.onclick = () => ((tab = b.dataset.tab), draw());
    for (const b of $$("[data-friend]", root)) b.onclick = () => compare(FRIENDS.find((f) => f.id === b.dataset.friend));
    $("#invite", root).onclick = async () => {
      const data = { title: "Faces in Places", text: "Everywhere has a face. Come hunt Blockies with me!", url: location.href.split("#")[0] };
      if (navigator.share) navigator.share(data).catch(() => {});
      else {
        await navigator.clipboard?.writeText(data.url).catch(() => {});
        toast("Invite link copied", { emoji: "🔗" });
      }
    };
    for (const x of $$("[data-react]", root)) {
      x.onclick = () => {
        react(x.dataset.id, x.dataset.react);
        draw();
      };
    }
    for (const x of $$("[data-vote]", root)) x.onclick = () => (vote(x.dataset.key, x.dataset.vote), draw());
    $("#nextMatch", root)?.addEventListener("click", () => ((round += 1), draw()));
    bindBeforeAfter(root);
  }

  function feed() {
    const mine = state.blockies.filter((b) => b.shared).map((b) => ({ ...b, ownerId: "me" }));
    const posts = [...mine, ...friendBlockies()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 24);
    return `<div class="feed">${posts
      .map((b) => {
        const p = b.ownerId === "me" ? me() : person(b.ownerId);
        const where = placeLabel(b);
        const r = getRarity(b.rarity);
        return `<article class="post">
          <header class="post__head">
            <span class="avatar avatar--sm" style="--c:${p.color}">${p.avatar}</span>
            <div><b>${esc(p.name)}</b> found ${r.rank ? `a <span class="rtext rtext--${b.rarity}">${r.label}</span>` : "a"} ${getCategory(b.category).label.toLowerCase()} face
              <div class="muted small">${where ? `📍 ${esc(where)} · ` : ""}${timeAgo(b.createdAt)}</div></div>
          </header>
          ${beforeAfter(b)}
          <a class="post__name" href="#/blockie/${b.id}"><b>${esc(b.name)}</b><span class="muted">${esc(b.collectibleId)}</span></a>
          <p class="post__text">${esc(b.personality)}</p>
          ${
            b.ownerId === "me"
              ? `<p class="muted small">Your post · friends can react</p>`
              : `<div class="reactions">${["😍", "😂", "🤯"].map((e) => `<button class="reaction ${state.reactions[b.id] === e ? "is-on" : ""}" data-react="${e}" data-id="${b.id}">${e}<b>${(b.reactions?.[e] || 0) + (state.reactions[b.id] === e ? 1 : 0)}</b></button>`).join("")}</div>`
          }
        </article>`;
      })
      .join("")}</div>`;
  }

  function faceOff() {
    const pool = communityBlockies();
    const day = dayIndex();
    const rng = mulberry32(day * 1009 + round * 31);
    const a = pool[Math.floor(rng() * pool.length)];
    let b = pool[Math.floor(rng() * pool.length)];
    if (b.id === a.id) b = pool[(pool.indexOf(a) + 7) % pool.length];
    const key = `${day}:${a.id}:${b.id}`;
    const choice = state.votes[key];
    const base = [40 + Math.floor(rng() * 120), 40 + Math.floor(rng() * 120)];
    if (choice === "a") base[0]++;
    if (choice === "b") base[1]++;
    const pct = Math.round((base[0] / (base[0] + base[1])) * 100);
    const side = (x, id, p) => {
      const owner = person(x.ownerId);
      return `<button class="fo-card tile--${x.rarity} ${choice === id ? "is-picked" : ""} ${choice && choice !== id ? "is-lost" : ""}" data-vote="${id}" data-key="${key}" ${choice ? "disabled" : ""}>
        <div class="fo-card__art">${blockieArt(x)}</div>
        <b>${esc(x.name)}</b><small>${owner.avatar} ${esc(owner.name)} · ${getRarity(x.rarity).label}</small>
        ${choice ? `<span class="fo-card__pct">${p}%</span>` : ""}
      </button>`;
    };
    return `<section class="faceoff">
      <p class="eyebrow center">Round ${round + 1} · ${base[0] + base[1]} votes</p>
      <h2 class="display-sm center">Which face wins?</h2>
      <div class="fo-pair">${side(a, "a", pct)}<span class="fo-vs">VS</span>${side(b, "b", 100 - pct)}</div>
      ${choice ? `<div class="fo-bar"><i style="width:${pct}%"></i></div><button class="btn btn--primary btn--block" id="nextMatch">Next match →</button>` : `<p class="muted center">Tap your favourite to vote</p>`}
    </section>`;
  }

  function challengeBoard() {
    const { challenge, progress, completed } = todaysChallenge();
    const rows = friendChallengeStatus(dayIndex()).map((x) => ({ who: x.friend, done: x.done, finds: x.finds, streak: x.friend.streak + (x.done ? 1 : 0) }));
    rows.push({ who: { ...me(), name: "You" }, done: completed, finds: todaysFinds().length, streak: currentStreak(), me: true });
    rows.sort((a, b) => b.done - a.done || b.finds - a.finds);
    return `<section class="challenge challenge--compact ${completed ? "challenge--done" : ""}">
        <div class="challenge__main"><div class="challenge__emoji">${challenge.emoji}</div><div><span class="eyebrow eyebrow--light">Today, for everyone</span><h2>${esc(challenge.title)}</h2></div></div>
        ${completed ? `<p class="challenge__reward">You're done for today 🎉</p>` : `<a class="btn btn--light" href="#/scan?challenge=1">${icon.camera} ${progress.current}/${progress.target} · Go</a>`}
      </section>
      <ol class="leader leader--big">
        ${rows
          .map((r, i) => `<li class="${r.me ? "is-me" : ""}"><span class="leader__rank">${i + 1}</span><span class="avatar avatar--sm" style="--c:${r.who.color}">${r.who.avatar}</span>
            <div><b>${esc(r.who.name)}</b><small class="muted">${r.finds} finds today · ${icon.flame}${r.streak}</small></div>
            <span class="leader__state ${r.done ? "done" : ""}">${r.done ? icon.check : "…"}</span></li>`)
          .join("")}
      </ol>`;
  }

  function compare(f) {
    const theirs = friendBlockies().filter((b) => b.ownerId === f.id);
    const count = (list, id) => list.filter((b) => b.rarity === id).length;
    // Friends' totals include finds beyond the four seeded ones in the feed.
    const theirTotals = Object.fromEntries(RARITIES.map((r, i) => [r.id, count(theirs, r.id) + Math.max(0, f.level * 3 - i * f.level - 2)]));
    sheet(
      `<div class="compare">
        <div class="compare__head">
          <div><span class="avatar avatar--lg" style="--c:${state.profile.color}">${state.profile.avatar}</span><b>You</b><small>Lv ${level().level} · ${icon.flame}${currentStreak()}</small></div>
          <span class="fo-vs">VS</span>
          <div><span class="avatar avatar--lg" style="--c:${f.color}">${f.avatar}</span><b>${esc(f.name)}</b><small>Lv ${f.level} · ${icon.flame}${f.streak}</small></div>
        </div>
        <table class="compare__table">
          ${RARITIES.map((r) => `<tr><td>${count(state.blockies, r.id)}</td><th><i class="rdot rdot--${r.id}"></i>${r.label}</th><td>${theirTotals[r.id]}</td></tr>`).join("")}
        </table>
        <h3>${esc(f.name)}'s latest</h3>
        <div class="grid grid--sheet">${theirs.map((b) => tile(b)).join("")}</div>
        <button class="btn btn--ghost btn--block" id="trade" >🔁 Propose a trade <span class="pill pill--soon">Soon</span></button>
      </div>`,
      { label: `Compare with ${f.name}`, onMount: (el) => ($("#trade", el).onclick = () => toast("Trading is coming in a future update!", { emoji: "🔁" })) },
    );
  }

  draw();
}
