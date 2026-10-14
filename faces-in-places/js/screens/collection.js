import { $, $$, esc, icon, tile, blockieArt, photoSrc } from "../ui.js";
import { state } from "../store.js";
import { CATEGORIES, RARITIES, rarity as getRarity } from "../core/catalog.js";
import { NEIGHBOURHOODS } from "../data/places.js";
import { friendBlockies } from "../data/seed.js";

const SORTS = {
  newest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  rarity: (a, b) => getRarity(b.rarity).rank - getRarity(a.rarity).rank || b.createdAt - a.createdAt,
  name: (a, b) => a.name.localeCompare(b.name),
};

const filters = { rarity: "all", category: "all", hood: "all", sort: "newest", view: "grid" };

export default function collection(root) {
  function draw() {
    const all = state.blockies;
    const list = all
      .filter((b) => filters.rarity === "all" || b.rarity === filters.rarity)
      .filter((b) => filters.category === "all" || b.category === filters.category)
      .filter((b) => filters.hood === "all" || (filters.hood === "secret" ? !b.place?.neighbourhoodId : b.place?.neighbourhoodId === filters.hood))
      .sort(SORTS[filters.sort]);
    const hoods = [...new Set(all.map((b) => b.place?.neighbourhoodId).filter(Boolean))];
    const catsFound = CATEGORIES.filter((c) => all.some((b) => b.category === c.id)).length;

    root.innerHTML = `
      <header class="page-head">
        <div><p class="eyebrow">Your Blockidex</p><h1 class="display-sm">Collection</h1></div>
        <a class="btn btn--primary btn--sm" href="#/scan">${icon.camera} Scan</a>
      </header>

      <section class="dex-summary">
        ${RARITIES.map((r) => `<button class="dex-stat dex-stat--${r.id} ${filters.rarity === r.id ? "is-on" : ""}" data-rarity="${r.id}"><b>${all.filter((b) => b.rarity === r.id).length}</b><span>${r.label}</span></button>`).join("")}
      </section>

      <section class="dex-progress">
        <div class="section-head"><h3>Category set</h3><span class="muted">${catsFound}/${CATEGORIES.length} found</span></div>
        <div class="dex-cats">
          ${CATEGORIES.map((c) => {
            const n = all.filter((b) => b.category === c.id).length;
            return `<button class="dex-cat ${n ? "found" : ""} ${filters.category === c.id ? "is-on" : ""}" data-category="${c.id}" aria-label="${c.label}: ${n} found"><span>${c.emoji}</span><b>${n || "?"}</b></button>`;
          }).join("")}
        </div>
      </section>

      <section class="filters">
        <div class="chip-row chip-row--scroll">
          <button class="chip ${filters.rarity === "all" && filters.category === "all" && filters.hood === "all" ? "chip--on" : ""}" data-clear>All · ${all.length}</button>
          ${RARITIES.map((r) => `<button class="chip ${filters.rarity === r.id ? "chip--on" : ""}" data-rarity="${r.id}"><i class="rdot rdot--${r.id}"></i>${r.label}</button>`).join("")}
        </div>
        <div class="filters__row">
          <select class="select select--sm" id="hood" aria-label="Neighbourhood">
            <option value="all">📍 All places</option>
            ${hoods.map((id) => `<option value="${id}" ${filters.hood === id ? "selected" : ""}>${NEIGHBOURHOODS.find((n) => n.id === id)?.name}</option>`).join("")}
            <option value="secret" ${filters.hood === "secret" ? "selected" : ""}>🤫 Secret spots</option>
          </select>
          <select class="select select--sm" id="sort" aria-label="Sort">
            ${Object.keys(SORTS).map((k) => `<option value="${k}" ${filters.sort === k ? "selected" : ""}>Sort: ${k[0].toUpperCase() + k.slice(1)}</option>`).join("")}
          </select>
          <button class="icon-btn" id="viewToggle" aria-label="${filters.view === "grid" ? "Show original photos" : "Show Blockies"}">${filters.view === "grid" ? icon.upload : icon.grid}</button>
        </div>
      </section>

      ${
        !all.length
          ? emptyState()
          : !list.length
            ? `<div class="empty"><p class="display-sm">Nothing here… yet</p><p class="muted">No Blockies match these filters.</p><button class="btn btn--ghost" data-clear>Clear filters</button></div>`
            : filters.view === "grid"
              ? `<div class="grid">${list.map((b) => tile(b)).join("")}</div>`
              : `<div class="photo-grid">${list.map((b) => `<a href="#/blockie/${b.id}" class="photo-cell tile--${b.rarity}"><img src="${photoSrc(b)}" alt="Original photo of ${esc(b.name)}"><span>${blockieArt(b)}</span></a>`).join("")}</div>`
      }
    `;

    for (const b of $$("[data-rarity]", root)) b.onclick = () => ((filters.rarity = filters.rarity === b.dataset.rarity ? "all" : b.dataset.rarity), draw());
    for (const b of $$("[data-category]", root)) b.onclick = () => ((filters.category = filters.category === b.dataset.category ? "all" : b.dataset.category), draw());
    for (const b of $$("[data-clear]", root)) b.onclick = () => (Object.assign(filters, { rarity: "all", category: "all", hood: "all" }), draw());
    $("#hood", root).onchange = (e) => ((filters.hood = e.target.value), draw());
    $("#sort", root).onchange = (e) => ((filters.sort = e.target.value), draw());
    $("#viewToggle", root).onclick = () => ((filters.view = filters.view === "grid" ? "photos" : "grid"), draw());
  }

  function emptyState() {
    const examples = friendBlockies().slice(0, 4);
    return `<div class="empty">
      <div class="empty__art">${examples.map((b) => `<span class="ghost-tile">${blockieArt(b)}</span>`).join("")}</div>
      <p class="display-sm">Your shelf is empty</p>
      <p class="muted">Every face you find becomes a one-of-a-kind Blockie. Start with something nearby — a plug socket is a classic.</p>
      <a class="btn btn--primary" href="#/scan">${icon.camera} Find your first face</a>
    </div>`;
  }

  draw();
}
