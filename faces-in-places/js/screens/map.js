import { $, $$, esc, icon, card, blockieArt, sheet, timeAgo, tile } from "../ui.js";
import { state } from "../store.js";
import { hashString, mulberry32 } from "../core/random.js";
import { rarity as getRarity } from "../core/catalog.js";
import { CITIES, NEIGHBOURHOODS, MILESTONES } from "../data/places.js";
import { communityBlockies, person } from "../data/seed.js";

let cityId = "london";

const publicBlockies = () => [...state.blockies.filter((b) => b.shared && b.place?.neighbourhoodId), ...communityBlockies()];

// Pins sit at a stable, randomised offset around the neighbourhood centre —
// never at the real spot.
function pinPosition(b, hood) {
  const rng = mulberry32(hashString(b.id));
  const angle = rng() * Math.PI * 2;
  const dist = 3 + rng() * 7;
  return { x: hood.x + Math.cos(angle) * dist, y: hood.y + Math.sin(angle) * dist * 0.9 };
}

function decor(city) {
  const rng = mulberry32(hashString(city.id));
  const parks = Array.from({ length: 4 }, () => {
    const x = 8 + rng() * 84, y = 8 + rng() * 84, rx = 4 + rng() * 6, ry = 3 + rng() * 5;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" class="park"/>`;
  }).join("");
  const roads = Array.from({ length: 5 }, (_, i) => {
    const y = 10 + i * 20 + rng() * 6;
    return `<path d="M-5,${y.toFixed(1)} C30,${(y + rng() * 10 - 5).toFixed(1)} 60,${(y + rng() * 10 - 5).toFixed(1)} 105,${(y + rng() * 6 - 3).toFixed(1)}" class="road"/>`;
  }).join("");
  const avenues = Array.from({ length: 4 }, (_, i) => {
    const x = 12 + i * 25 + rng() * 6;
    return `<path d="M${x.toFixed(1)},-5 C${(x + rng() * 8 - 4).toFixed(1)},40 ${(x + rng() * 8 - 4).toFixed(1)},70 ${(x + rng() * 6 - 3).toFixed(1)},105" class="road road--minor"/>`;
  }).join("");
  return `<defs><pattern id="blocks" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="none"/><rect x="0.6" y="0.6" width="4.8" height="4.8" rx="1" class="block"/></pattern></defs>
    <rect width="100" height="100" fill="url(#blocks)"/>${parks}${roads}${avenues}<path d="${city.water}" class="water"/>`;
}

export default function map(root) {
  function draw() {
    const city = CITIES.find((c) => c.id === cityId);
    const hoods = NEIGHBOURHOODS.filter((n) => n.city === cityId);
    const all = publicBlockies();
    const pins = [];
    for (const hood of hoods) {
      for (const b of all.filter((x) => x.place?.neighbourhoodId === hood.id)) pins.push({ b, ...pinPosition(b, hood) });
    }
    const total = pins.length;
    const mineHere = state.blockies.filter((b) => hoods.some((h) => h.id === b.place?.neighbourhoodId)).length;

    root.innerHTML = `
      <header class="page-head">
        <div><p class="eyebrow">Explore</p><h1 class="display-sm">The face map</h1></div>
        <span class="pill">${total} faces</span>
      </header>
      <div class="city-tabs" role="tablist">
        ${CITIES.map((c) => `<button role="tab" aria-selected="${c.id === cityId}" class="${c.id === cityId ? "is-on" : ""}" data-city="${c.id}">${c.flag} ${c.name}</button>`).join("")}
      </div>
      <section class="map" aria-label="${city.name} map of discoveries">
        <svg class="map__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${decor(city)}
          ${hoods.map((h) => `<circle cx="${h.x}" cy="${h.y}" r="11" class="zone"/>`).join("")}
        </svg>
        ${pins
          .map(({ b, x, y }) => `<button class="pin pin--${b.rarity} ${b.ownerId === "me" ? "pin--mine" : ""}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%" data-pin="${b.id}" aria-label="${esc(b.name)}, ${getRarity(b.rarity).label}">${blockieArt(b)}</button>`)
          .join("")}
        ${hoods
          .map((h) => {
            const n = all.filter((b) => b.place?.neighbourhoodId === h.id).length;
            return `<button class="hood-label" style="left:${h.x}%;top:${h.y}%" data-hood="${h.id}">${esc(h.name)}<b>${n}</b></button>`;
          })
          .join("")}
        <p class="map__privacy">${icon.pin} Pins show rough areas, never exact spots</p>
      </section>

      <section>
        <div class="section-head"><h3>Neighbourhoods</h3><span class="muted">You've found ${mineHere} here</span></div>
        <div class="hood-list">
          ${hoods
            .map((h) => {
              const n = all.filter((b) => b.place?.neighbourhoodId === h.id).length;
              const next = MILESTONES.find((m) => m > n) || MILESTONES[MILESTONES.length - 1];
              const done = MILESTONES.filter((m) => n >= m).length;
              return `<button class="hood-row" data-hood="${h.id}">
                <div class="hood-row__medals">${MILESTONES.map((m, i) => `<i class="${i < done ? "on" : ""}" title="${m} faces"></i>`).join("")}</div>
                <div class="hood-row__main"><b>${esc(h.name)}</b><div class="bar"><i style="width:${Math.min(100, (n / next) * 100)}%"></i></div><small class="muted">${n}/${next} community faces to the next milestone</small></div>
                ${icon.back}
              </button>`;
            })
            .join("")}
        </div>
      </section>`;

    for (const b of $$("[data-city]", root)) b.onclick = () => ((cityId = b.dataset.city), draw());
    for (const b of $$("[data-pin]", root)) b.onclick = () => openPin(all.find((x) => x.id === b.dataset.pin));
    for (const b of $$("[data-hood]", root)) b.onclick = () => openHood(NEIGHBOURHOODS.find((h) => h.id === b.dataset.hood), all);
  }

  function openPin(b) {
    const p = b.ownerId === "me" ? { name: "You", avatar: state.profile.avatar, color: state.profile.color } : person(b.ownerId);
    const hood = NEIGHBOURHOODS.find((h) => h.id === b.place.neighbourhoodId);
    sheet(
      `<div class="pin-sheet">
        <div class="owner"><span class="avatar avatar--sm" style="--c:${p.color}">${p.avatar}</span><span><b>${esc(p.name)}</b> found this in ${esc(hood.name)} · ${timeAgo(b.createdAt)}</span></div>
        ${card(b)}
        <a class="btn btn--primary" href="#/blockie/${b.id}">See profile</a>
      </div>`,
      { label: b.name },
    );
  }

  function openHood(hood, all) {
    const here = all.filter((b) => b.place?.neighbourhoodId === hood.id);
    const n = here.length;
    const finders = {};
    for (const b of here) finders[b.ownerId] = (finders[b.ownerId] || 0) + 1;
    const top = Object.entries(finders).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const legendFound = state.blockies.some((b) => b.place?.neighbourhoodId === hood.id && b.rarity === "legendary");
    sheet(
      `<p class="eyebrow">${CITIES.find((c) => c.id === hood.city).flag} ${CITIES.find((c) => c.id === hood.city).name}</p>
       <h2 class="display-sm">${esc(hood.name)}</h2>
       <div class="milestones">${MILESTONES.map((m) => `<div class="milestone ${n >= m ? "is-done" : ""}"><b>${m}</b><span>${n >= m ? "Unlocked" : `${m - n} to go`}</span></div>`).join("")}</div>
       <div class="special ${legendFound ? "special--found" : ""}">
         <span>${legendFound ? "🌟" : "❔"}</span>
         <div><b>${legendFound ? esc(hood.special) : "Local legend: ???"}</b><p class="muted small">${legendFound ? "You found this area's legend!" : `Rumour says a legendary face hides in ${esc(hood.name)}. Find a Legendary here to reveal it.`}</p></div>
       </div>
       <h3>Top spotters</h3>
       <ol class="leader">${top.map(([id, c]) => {
         const p = id === "me" ? { name: "You", avatar: state.profile.avatar, color: state.profile.color } : person(id);
         return `<li><span class="avatar avatar--xs" style="--c:${p.color}">${p.avatar}</span><b>${esc(p.name)}</b><span>${c} faces</span></li>`;
       }).join("")}</ol>
       <h3>Spotted here</h3>
       <div class="grid grid--sheet">${here.slice(0, 9).map((b) => tile(b)).join("")}</div>`,
      { label: hood.name },
    );
  }

  draw();
}
