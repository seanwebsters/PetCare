import { renderBlockie } from "./render/blockie.js";
import { sceneDataUrl } from "./render/scenes.js";
import { category as getCategory, mood as getMood, rarity as getRarity } from "./core/catalog.js";
import { neighbourhood } from "./data/places.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const svg = (body, extra = "") =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;

export const icon = {
  home: svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),
  grid: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  camera: svg('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.6"/>'),
  map: svg('<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>'),
  friends: svg('<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 5.2a3.3 3.3 0 0 1 0 6.6M18 14.6c2 .7 3.2 2.5 3.5 5.4"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  share: svg('<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12"/>'),
  upload: svg('<rect x="3.5" y="4" width="17" height="16" rx="3"/><circle cx="9" cy="9.5" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>'),
  flip: svg('<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>'),
  pin: svg('<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.4"/>'),
  sparkle: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  trash: svg('<path d="M4.5 7h15M10 11v6M14 11v6M6 7l1 12.5h10L18 7M9.5 7V4.5h5V7"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  wand: svg('<path d="m4 20 11-11M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 11l.6 1.4L21 13l-1.4.6L19 15l-.6-1.4L17 13l1.4-.6z"/>'),
  switch: svg('<path d="M4 8h13l-3-3M20 16H7l3 3"/>'),
  flame: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 2.5c.6 3.4 4.8 5.6 4.8 10.6a4.8 4.8 0 0 1-9.6 0c0-2.4 1.2-3.9 2.3-5 .2 1.6.9 2.6 1.9 3.1-.2-3.4.2-6.2.6-8.7z" fill="#ff6a3d"/><path d="M12 12.5c.3 1.6 2.3 2.4 2.3 4.4a2.3 2.3 0 0 1-4.6 0c0-1.3.9-2.4 2.3-4.4z" fill="#ffd23f"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M13.5 2 5 13.5h6L10 22l9-12h-6.2z" fill="#c6f432" stroke="#1d1537" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

export function logoMark(size = 36) {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" class="logo-mark">
    <rect x="3" y="5" width="42" height="40" rx="13" fill="#ff6a3d" stroke="#1d1537" stroke-width="3"/>
    <path d="M3 18c8-3 34-3 42 0" fill="none" stroke="#1d1537" stroke-width="2" opacity=".18"/>
    <circle cx="17" cy="23" r="5.2" fill="#fff" stroke="#1d1537" stroke-width="2.6"/><circle cx="31" cy="23" r="5.2" fill="#fff" stroke="#1d1537" stroke-width="2.6"/>
    <circle cx="17.6" cy="23.8" r="2.4" fill="#1d1537"/><circle cx="31.6" cy="23.8" r="2.4" fill="#1d1537"/>
    <path d="M17 32.5c3.8 3.6 10.2 3.6 14 0" fill="none" stroke="#1d1537" stroke-width="3" stroke-linecap="round"/>
    <path d="M6 2.5h-3.5V6M42 2.5h3.5V6" fill="none" stroke="#1d1537" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
}

export function photoSrc(b) {
  if (!b.photo) return "";
  return b.photo.kind === "scene" ? sceneDataUrl(b.photo.scene, b.photo.seed) : b.photo.url;
}

export function blockieArt(b, opts = {}) {
  if (b.art?.kind === "image") return `<img class="blockie-svg" src="${esc(b.art.url)}" alt="${esc(b.name)}">`;
  return renderBlockie(b.traits, { accessory: b.accessory, label: `${b.name}, a ${getMood(b.mood).label.toLowerCase()} ${getCategory(b.category).label.toLowerCase()} Blockie`, ...opts });
}

export const rarityBadge = (id) => `<span class="gem gem--${id}">${getRarity(id).label}</span>`;

export function placeLabel(b) {
  const n = b.place?.neighbourhoodId && neighbourhood(b.place.neighbourhoodId);
  return n ? n.name : b.place?.label || "";
}

// Collectible trading-card markup.
export function card(b, { tilt = true, className = "" } = {}) {
  const cat = getCategory(b.category);
  return `<article class="card card--${b.rarity} ${className}" ${tilt ? "data-tilt" : ""}>
    <div class="card__body">
      <header class="card__top"><span class="chip chip--ghost">${cat.emoji} ${esc(cat.label)}</span>${rarityBadge(b.rarity)}</header>
      <div class="card__art"><div class="card__rays"></div>${blockieArt(b)}</div>
      <h3 class="card__name">${esc(b.name)}</h3>
      <footer class="card__meta"><span>${getMood(b.mood).emoji} ${getMood(b.mood).label}</span><span class="mono">${esc(b.collectibleId)}</span></footer>
    </div>
    <div class="card__shine"></div>
  </article>`;
}

export function tile(b, href) {
  return `<a class="tile tile--${b.rarity}" href="${href || `#/blockie/${b.id}`}">
    <div class="tile__art">${blockieArt(b)}</div>
    <div class="tile__name">${esc(b.name)}</div>
    <div class="tile__rarity"><i></i>${getRarity(b.rarity).label}</div>
  </a>`;
}

// Pointer-driven 3D tilt + holographic shine for cards.
export function enableTilt(root = document) {
  for (const el of $$("[data-tilt]", root)) {
    if (el.dataset.tiltBound) continue;
    el.dataset.tiltBound = "1";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }
}

export function toast(message, { emoji = "✨", timeout = 2600 } = {}) {
  const host = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span>${emoji}</span><p>${esc(message)}</p>`;
  host.append(el);
  setTimeout(() => el.classList.add("toast--out"), timeout);
  setTimeout(() => el.remove(), timeout + 400);
}

export function sheet(html, { onMount, label = "Details" } = {}) {
  const host = $("#sheet-host");
  const wrap = document.createElement("div");
  wrap.className = "sheet-wrap";
  wrap.innerHTML = `<div class="sheet-backdrop" data-close></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}">
      <div class="sheet__grab"></div>
      <button class="icon-btn sheet__close" data-close aria-label="Close">${icon.close}</button>
      <div class="sheet__content">${html}</div>
    </section>`;
  const onKey = (e) => e.key === "Escape" && close();
  function close() {
    wrap.classList.add("sheet-wrap--out");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => wrap.remove(), 260);
  }
  wrap.addEventListener("click", (e) => e.target.closest("[data-close]") && close());
  document.addEventListener("keydown", onKey);
  host.append(wrap);
  onMount?.(wrap, close);
  enableTilt(wrap);
  return close;
}

export function confetti(intensity = 60, colours = ["#ff6a3d", "#c6f432", "#5cc8ff", "#ff5fa2", "#ffd23f", "#7a5cff"]) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "confetti";
  for (let i = 0; i < intensity; i++) {
    const p = document.createElement("i");
    p.style.setProperty("--x", `${Math.random() * 100}vw`);
    p.style.setProperty("--d", `${(Math.random() * 1.2 + 1.4).toFixed(2)}s`);
    p.style.setProperty("--r", `${Math.floor(Math.random() * 720 - 360)}deg`);
    p.style.setProperty("--delay", `${(Math.random() * 0.3).toFixed(2)}s`);
    p.style.background = colours[i % colours.length];
    if (i % 3 === 0) p.style.borderRadius = "50%";
    layer.append(p);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 3200);
}

export function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

// ---------- Share card image ----------

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const RARITY_BG = { common: ["#3ec28f", "#1f8f69"], rare: ["#4aa8ff", "#2a5fe0"], epic: ["#a868ff", "#6a2fd8"], legendary: ["#ffcf3f", "#ff7a1a"] };

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
}

export async function shareCardBlob(b) {
  const W = 1080, H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const [c1, c2] = RARITY_BG[b.rarity];
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff6e9";
  roundRect(ctx, 60, 60, W - 120, H - 120, 56);
  ctx.fill();

  const font = (w, s) => `${w} ${s}px Fredoka, "Avenir Next", system-ui, sans-serif`;
  ctx.fillStyle = "#1d1537";
  ctx.font = font(700, 40);
  ctx.fillText("FACES IN PLACES", 110, 150);
  ctx.font = font(600, 34);
  ctx.textAlign = "right";
  ctx.fillText(getRarity(b.rarity).label.toUpperCase(), W - 110, 150);
  ctx.textAlign = "left";

  try {
    if (b.art?.kind === "image") {
      ctx.drawImage(await loadImage(b.art.url), 240, 190, 600, 600);
    } else {
      const markup = renderBlockie(b.traits, { accessory: b.accessory }).replace("<svg ", '<svg width="600" height="715" ');
      const img = await loadImage("data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup));
      ctx.drawImage(img, 240, 170, 600, 715);
    }
  } catch {
    /* art failed to load: card still useful */
  }

  try {
    const photo = await loadImage(photoSrc(b));
    ctx.save();
    roundRect(ctx, 110, 640, 240, 240, 32);
    ctx.clip();
    const s = Math.max(240 / photo.width, 240 / photo.height);
    ctx.drawImage(photo, 110 + (240 - photo.width * s) / 2, 640 + (240 - photo.height * s) / 2, photo.width * s, photo.height * s);
    ctx.restore();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#fff";
    roundRect(ctx, 110, 640, 240, 240, 32);
    ctx.stroke();
  } catch {
    /* no photo */
  }

  ctx.fillStyle = "#1d1537";
  ctx.font = font(700, 76);
  ctx.fillText(b.name, 110, 990, W - 220);
  ctx.font = font(500, 34);
  ctx.fillStyle = "#5b4f80";
  const where = placeLabel(b);
  ctx.fillText(`${getCategory(b.category).emoji} ${getCategory(b.category).label} · ${getMood(b.mood).label}${where ? " · " + where : ""}`, 110, 1050, W - 220);
  ctx.font = font(600, 30);
  ctx.fillText(b.collectibleId, 110, 1110);
  ctx.fillStyle = "#ff6a3d";
  ctx.font = font(700, 40);
  ctx.fillText("Everywhere has a face.", 110, 1220);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export async function shareBlockie(b) {
  const blob = await shareCardBlob(b);
  const file = new File([blob], `${b.name.replace(/\W+/g, "-").toLowerCase()}.png`, { type: "image/png" });
  const text = `I found ${b.name}, a ${getRarity(b.rarity).label} Blockie! #FacesInPlaces`;
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: b.name, text });
      return "shared";
    } catch (e) {
      if (e.name === "AbortError") return "cancelled";
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return "downloaded";
}
