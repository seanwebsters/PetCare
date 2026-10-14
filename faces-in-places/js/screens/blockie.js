import { $, $$, esc, icon, card, enableTilt, toast, shareBlockie, photoSrc, placeLabel, formatDate, timeAgo, sheet } from "../ui.js";
import { state, getBlockie, updateBlockie, removeBlockie, level, react } from "../store.js";
import { ACCESSORIES, category as getCategory, mood as getMood, rarity as getRarity } from "../core/catalog.js";
import { communityBlockies, person } from "../data/seed.js";

export default function blockieScreen(root, { params: [id] }) {
  const mine = getBlockie(id);
  const b = mine || communityBlockies().find((x) => x.id === id);
  if (!b) {
    root.innerHTML = `<div class="empty"><p class="display-sm">This Blockie wandered off</p><a class="btn btn--primary" href="#/collection">Back to collection</a></div>`;
    return;
  }
  const owner = mine ? null : person(b.ownerId);

  function draw() {
    const r = getRarity(b.rarity);
    const lv = level().level;
    const where = placeLabel(b);
    root.innerHTML = `
      <header class="page-head page-head--bar">
        <button class="icon-btn" id="back" aria-label="Back">${icon.back}</button>
        <span class="mono muted">${esc(b.collectibleId)}</span>
        <button class="icon-btn" id="share" aria-label="Share">${icon.share}</button>
      </header>

      <section class="profile-hero hero--${b.rarity}">
        <div class="flipper flipper--big" id="flipper" role="button" tabindex="0" aria-label="Flip between Blockie and original photo">
          <div class="flipper__inner">
            <div class="flipper__front">${card(b)}</div>
            <div class="flipper__back"><div class="card-back card-back--photo"><img src="${photoSrc(b)}" alt="Original photo of ${esc(b.name)}"><span>The original</span></div></div>
          </div>
        </div>
        <div class="seg-toggle">
          <button class="is-on" data-side="front">Blockie</button><button data-side="back">Original photo</button>
        </div>
      </section>

      <section class="panel">
        ${owner ? `<a class="owner" href="#/friends"><span class="avatar avatar--sm" style="--c:${owner.color}">${owner.avatar}</span><span>Found by <b>${esc(owner.name)}</b> · ${timeAgo(b.createdAt)}</span></a>` : ""}
        <h1 class="display-sm">${esc(b.name)}</h1>
        <p class="personality">“${esc(b.personality)}”</p>
        <dl class="facts">
          <div><dt>Category</dt><dd>${getCategory(b.category).emoji} ${getCategory(b.category).label}</dd></div>
          <div><dt>Mood</dt><dd>${getMood(b.mood).emoji} ${getMood(b.mood).label}</dd></div>
          <div><dt>Rarity</dt><dd><i class="rdot rdot--${b.rarity}"></i>${r.label}</dd></div>
          <div><dt>Discovered</dt><dd>${formatDate(b.createdAt)}</dd></div>
          <div><dt>Where</dt><dd>${where ? `📍 ${esc(where)}` : "🤫 Secret spot"}</dd></div>
          <div><dt>Collectible ID</dt><dd class="mono">${esc(b.collectibleId)}</dd></div>
        </dl>
      </section>

      <section class="panel">
        <details class="why" ${mine ? "" : "open"}>
          <summary>Why ${r.label}? <span class="muted">${b.rarityScore} pts</span></summary>
          <ul>${b.rarityReasons.length ? b.rarityReasons.map((x) => `<li><span>${esc(x.label)}</span><b>+${x.points}</b></li>`).join("") : `<li><span>A classic everyday find</span><b>+0</b></li>`}</ul>
          <p class="muted small">Common 0–3 · Rare 4–6 · Epic 7–9 · Legendary 10+</p>
        </details>
      </section>

      ${
        mine
          ? `<section class="panel">
          <div class="section-head"><h3>Dress up</h3><span class="muted">More unlock as you level up</span></div>
          <div class="accessories">
            ${ACCESSORIES.map((a) => {
              const locked = a.level > lv;
              return `<button class="acc ${b.accessory === a.id ? "is-on" : ""} ${locked ? "is-locked" : ""}" data-acc="${a.id}" ${locked ? `aria-disabled="true"` : ""} aria-label="${a.label}${locked ? `, unlocks at level ${a.level}` : ""}">
                <span>${a.emoji}</span><small>${locked ? `${icon.lock} Lv ${a.level}` : a.label}</small></button>`;
            }).join("")}
          </div>
        </section>
        <section class="panel settings-list">
          <label class="toggle">
            <input type="checkbox" id="shared" ${b.shared ? "checked" : ""}>
            <span class="toggle__track"><i></i></span>
            <span><b>Show on the map & friends feed</b><small>${where ? `Appears around ${esc(where)}, never at the exact spot.` : "Add a place to appear on the map."}</small></span>
          </label>
          <button class="row-btn" id="rename">✏️ Rename</button>
          <button class="row-btn" id="merch">🧸 Order a figure <span class="pill pill--soon">Soon</span></button>
          <button class="row-btn row-btn--danger" id="delete">${icon.trash} Release this Blockie</button>
        </section>`
          : `<section class="panel reactions-panel">
          <p class="muted">React to ${esc(owner.name)}'s find</p>
          <div class="reactions">${["😍", "😂", "🤯"].map((e) => `<button class="reaction ${state.reactions[b.id] === e ? "is-on" : ""}" data-react="${e}">${e}<b>${(b.reactions?.[e] || 0) + (state.reactions[b.id] === e ? 1 : 0)}</b></button>`).join("")}</div>
        </section>`
      }
    `;
    bind();
  }

  function bind() {
    enableTilt(root);
    $("#back", root).onclick = () => (history.length > 1 ? history.back() : (location.hash = "#/collection"));
    $("#share", root).onclick = async () => {
      const res = await shareBlockie(b);
      if (res === "downloaded") toast("Card image saved!", { emoji: "🖼️" });
    };
    const flipper = $("#flipper", root);
    const setSide = (side) => {
      flipper.classList.toggle("is-flipped", side === "back");
      $$("[data-side]", root).forEach((x) => x.classList.toggle("is-on", x.dataset.side === side));
    };
    flipper.onclick = () => setSide(flipper.classList.contains("is-flipped") ? "front" : "back");
    flipper.onkeydown = (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), flipper.click());
    for (const x of $$("[data-side]", root)) x.onclick = () => setSide(x.dataset.side);

    for (const x of $$("[data-react]", root)) x.onclick = () => (react(b.id, x.dataset.react), draw());

    if (!mine) return;
    for (const x of $$("[data-acc]", root)) {
      x.onclick = () => {
        const acc = ACCESSORIES.find((a) => a.id === x.dataset.acc);
        if (acc.level > level().level) return toast(`${acc.label} unlocks at level ${acc.level}`, { emoji: "🔒" });
        updateBlockie(b.id, { accessory: acc.id });
        draw();
      };
    }
    $("#shared", root).onchange = (e) => {
      const res = updateBlockie(b.id, { shared: e.target.checked });
      toast(e.target.checked ? `Shared with friends${res.xpGained ? ` · +${res.xpGained} XP` : ""}` : "Now private", { emoji: e.target.checked ? "📣" : "🔒" });
    };
    $("#rename", root).onclick = () =>
      sheet(
        `<h2 class="display-sm">Rename</h2><form class="stack" id="renameForm"><input class="input" id="nameInput" maxlength="28" value="${esc(b.name)}" aria-label="Name"><button class="btn btn--primary">Save name</button></form>`,
        {
          label: "Rename",
          onMount: (el, close) => {
            const input = $("#nameInput", el);
            input.focus();
            input.select();
            $("#renameForm", el).onsubmit = (e) => {
              e.preventDefault();
              const name = input.value.trim();
              if (name) updateBlockie(b.id, { name });
              close();
              draw();
            };
          },
        },
      );
    $("#merch", root).onclick = () => toast("Physical figures are coming — we'll let you know!", { emoji: "🧸" });
    $("#delete", root).onclick = () =>
      sheet(
        `<h2 class="display-sm">Release ${esc(b.name)}?</h2><p class="muted">They'll leave your collection for good. This can't be undone.</p>
         <div class="stack"><button class="btn btn--danger" id="confirmDelete">Release</button><button class="btn btn--ghost" data-close>Keep them</button></div>`,
        {
          label: "Confirm release",
          onMount: (el, close) => {
            $("#confirmDelete", el).onclick = () => {
              removeBlockie(b.id);
              close();
              toast(`${b.name} waved goodbye`, { emoji: "👋" });
              location.hash = "#/collection";
            };
          },
        },
      );
  }

  draw();
}
