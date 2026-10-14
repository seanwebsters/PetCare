// Draws a Blockie as an SVG string from its traits. Pure string output so it
// works in the browser, in tests and when composing share cards.
//
// Visual rules every Blockie follows (keeps the collection coherent):
//  - one chunky rounded body with a soft vinyl-toy gradient + specular highlight
//  - a category signature (roof, wheels, lid, faceplate, antenna, leaves, crust)
//  - big ink-outlined eyes, mood-driven mouth, optional blush
//  - stubby feet and arms, grounded by a soft shadow

import { hexToHsl, hsl } from "../core/color.js";

// Per-render palette: the outline is a deep tint of the body colour (reads as
// a premium vinyl toy rather than a flat sticker), eyes get a coloured iris.
let INK = "#1d1537";
let IRIS = "#2b2150";
let GID = "bk";
const MOUTH = "#3a1530";
const TONGUE = "#ff7a93";
let counter = 0;

const f = (n) => Math.round(n * 10) / 10;

function blobPath(cx, cy, rx, ry, seed) {
  const pts = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const wob = 1 + Math.sin(i * 2.7 + seed * 12) * 0.05;
    pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]);
  }
  let d = `M${f((pts[0][0] + pts[1][0]) / 2)},${f((pts[0][1] + pts[1][1]) / 2)}`;
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n];
    const next = pts[(i + 1) % n];
    d += ` Q${f(p[0])},${f(p[1])} ${f((p[0] + next[0]) / 2)},${f((p[1] + next[1]) / 2)}`;
  }
  return d + "Z";
}

function bodyShape(t, box) {
  const { x0, x1, top, bottom, bw, bh } = box;
  if (t.category === "nature") {
    return { tag: "path", d: blobPath((x0 + x1) / 2, (top + bottom) / 2, bw / 2, bh / 2, t.body.wobble) };
  }
  if (t.category === "food") {
    const rb = bw * 0.18;
    const d = `M${f(x0)},${f(top + bh * 0.5)} C${f(x0)},${f(top - bh * 0.08)} ${f(x1)},${f(top - bh * 0.08)} ${f(x1)},${f(top + bh * 0.5)} L${f(x1)},${f(bottom - rb)} Q${f(x1)},${f(bottom)} ${f(x1 - rb)},${f(bottom)} L${f(x0 + rb)},${f(bottom)} Q${f(x0)},${f(bottom)} ${f(x0)},${f(bottom - rb)}Z`;
    return { tag: "path", d };
  }
  const r = Math.min(bw, bh) * t.body.radius;
  return { tag: "rect", x: x0, y: top, w: bw, h: bh, r };
}

const shapeEl = (s, attrs) =>
  s.tag === "path"
    ? `<path d="${s.d}" ${attrs}/>`
    : `<rect x="${f(s.x)}" y="${f(s.y)}" width="${f(s.w)}" height="${f(s.h)}" rx="${f(s.r)}" ${attrs}/>`;

function eye(x, y, r, mood, side) {
  const open = (pupil = 0.62, look = 0) => {
    const px = x - side * r * 0.08, py = y + r * 0.12 + look;
    return `
    <ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 1.1)}" fill="url(#${GID}s)" stroke="${INK}" stroke-width="3"/>
    <circle cx="${f(px)}" cy="${f(py)}" r="${f(r * pupil)}" fill="url(#${GID}i)"/>
    <circle cx="${f(px)}" cy="${f(py)}" r="${f(r * pupil * 0.55)}" fill="${INK}"/>
    <ellipse cx="${f(x - r * 0.22)}" cy="${f(py - r * 0.28)}" rx="${f(r * 0.24)}" ry="${f(r * 0.2)}" fill="#fff"/>
    <circle cx="${f(px + r * 0.22)}" cy="${f(py + r * 0.26)}" r="${f(r * 0.1)}" fill="#fff" opacity=".9"/>`;
  };
  const brow = (ox, oy, ix, iy) =>
    `<path d="M${f(x + side * r * ox)},${f(y - r * oy)} L${f(x - side * r * ix)},${f(y - r * iy)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;

  switch (mood) {
    case "surprised":
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.12)}" ry="${f(r * 1.22)}" fill="url(#${GID}s)" stroke="${INK}" stroke-width="3"/>
        <circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.4)}" fill="url(#${GID}i)"/>
        <circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.22)}" fill="${INK}"/>
        <circle cx="${f(x - r * 0.12)}" cy="${f(y - r * 0.12)}" r="${f(r * 0.11)}" fill="#fff"/>
        <path d="M${f(x - r * 0.8)},${f(y - r * 1.75)} Q${f(x)},${f(y - r * 2.25)} ${f(x + r * 0.8)},${f(y - r * 1.75)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case "angry":
      return open(0.52, r * 0.1) + brow(1.15, 1.55, 0.85, 0.85);
    case "worried":
      return open(0.5, -r * 0.15) + brow(1.1, 1.3, 0.75, 1.8);
    case "sleepy":
      return `<path d="M${f(x - r)},${f(y)} Q${f(x)},${f(y + r * 0.85)} ${f(x + r)},${f(y)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M${f(x + side * r * 0.95)},${f(y + r * 0.1)} l${f(side * r * 0.35)},${f(r * 0.25)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    case "cheeky":
      if (side < 0) {
        return `<path d="M${f(x - r)},${f(y + r * 0.2)} Q${f(x)},${f(y - r * 0.9)} ${f(x + r)},${f(y + r * 0.2)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
      }
      return open();
    default:
      return open();
  }
}

function mouth(mx, my, m, mood) {
  switch (mood) {
    case "surprised":
      return `<ellipse cx="${f(mx)}" cy="${f(my + m * 0.1)}" rx="${f(m * 0.22)}" ry="${f(m * 0.3)}" fill="${MOUTH}" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="${f(mx)}" cy="${f(my + m * 0.26)}" rx="${f(m * 0.12)}" ry="${f(m * 0.08)}" fill="${TONGUE}"/>`;
    case "angry": {
      const w = m * 0.9, h = m * 0.34;
      return `<rect x="${f(mx - w / 2)}" y="${f(my)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2.4)}" fill="#fff" stroke="${INK}" stroke-width="3.2"/>
        <path d="M${f(mx - w / 2)},${f(my + h / 2)} H${f(mx + w / 2)} M${f(mx - w / 6)},${f(my)} V${f(my + h)} M${f(mx + w / 6)},${f(my)} V${f(my + h)}" stroke="${INK}" stroke-width="2"/>`;
    }
    case "sleepy":
      return `<ellipse cx="${f(mx)}" cy="${f(my + m * 0.1)}" rx="${f(m * 0.13)}" ry="${f(m * 0.16)}" fill="${MOUTH}" stroke="${INK}" stroke-width="2.5"/>`;
    case "cheeky":
      return `<path d="M${f(mx + m * 0.02)},${f(my + m * 0.18)} q0,${f(m * 0.42)} ${f(m * 0.2)},${f(m * 0.42)} q${f(m * 0.2)},0 ${f(m * 0.2)},-${f(m * 0.42)}Z" fill="${TONGUE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M${f(mx - m * 0.5)},${f(my)} Q${f(mx)},${f(my + m * 0.45)} ${f(mx + m * 0.5)},${f(my)}" fill="none" stroke="${INK}" stroke-width="4.2" stroke-linecap="round"/>`;
    case "worried":
      return `<path d="M${f(mx - m * 0.5)},${f(my + m * 0.12)} q${f(m * 0.25)},-${f(m * 0.22)} ${f(m * 0.5)},0 t${f(m * 0.5)},0" fill="none" stroke="${INK}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    default:
      return `<path d="M${f(mx - m * 0.6)},${f(my)} Q${f(mx)},${f(my + m * 0.95)} ${f(mx + m * 0.6)},${f(my)}Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
        <ellipse cx="${f(mx)}" cy="${f(my + m * 0.33)}" rx="${f(m * 0.24)}" ry="${f(m * 0.1)}" fill="${TONGUE}"/>`;
  }
}

function details(t, box, c) {
  const { x0, x1, top, bottom, bw, bh } = box;
  const s = t.flourish;
  switch (t.detail) {
    case "stripes":
      return `<rect x="${f(x0 - 5)}" y="${f(bottom - bh * 0.26)}" width="${f(bw + 10)}" height="${f(bh * 0.07)}" fill="${c.accent}" opacity=".85"/>
        <rect x="${f(x0 - 5)}" y="${f(bottom - bh * 0.15)}" width="${f(bw + 10)}" height="${f(bh * 0.04)}" fill="${c.accent}" opacity=".6"/>`;
    case "spots": {
      const spots = [[0.1, 0.25, 7], [0.88, 0.32, 9], [0.14, 0.82, 10], [0.84, 0.8, 6], [0.5, 0.94, 5], [0.72, 0.12, 5]];
      return spots
        .map(([px, py, r], i) => `<circle cx="${f(x0 + bw * px)}" cy="${f(top + bh * py)}" r="${f(r * (0.8 + ((s * 10 + i) % 1) * 0.5))}" fill="${c.accent}" opacity=".45"/>`)
        .join("");
    }
    case "bricks": {
      let out = "";
      const rows = [[0.12, 0.08], [0.2, 0.86], [0.78, 0.82], [0.86, 0.12]];
      for (const [px, py] of rows) {
        out += `<rect x="${f(x0 + bw * px - 12)}" y="${f(top + bh * py - 5)}" width="24" height="10" rx="3" fill="${c.shade}" opacity=".3"/>`;
      }
      return out;
    }
    case "panel":
      return `<rect x="${f(x0 + bw * 0.18)}" y="${f(bottom - bh * 0.24)}" width="${f(bw * 0.64)}" height="${f(bh * 0.14)}" rx="8" fill="${c.accent}" opacity=".45"/>`;
    case "rings":
      return `<path d="M${f(x0 + bw * 0.08)},${f(bottom - bh * 0.18)} q${f(bw * 0.12)},-${f(bh * 0.08)} ${f(bw * 0.24)},0" fill="none" stroke="${c.shade}" stroke-width="4" stroke-linecap="round" opacity=".45"/>
        <path d="M${f(x1 - bw * 0.3)},${f(top + bh * 0.16)} q${f(bw * 0.1)},-${f(bh * 0.06)} ${f(bw * 0.2)},0" fill="none" stroke="${c.shade}" stroke-width="4" stroke-linecap="round" opacity=".45"/>`;
    case "bolts":
      return [[0.1, 0.12], [0.9, 0.12], [0.1, 0.88], [0.9, 0.88]]
        .map(([px, py]) => `<circle cx="${f(x0 + bw * px)}" cy="${f(top + bh * py)}" r="5" fill="${c.light}" stroke="${c.shade}" stroke-width="2"/>`)
        .join("");
    default:
      return "";
  }
}

// Behind-the-body signature pieces.
function signatureBack(t, box, c, hasHat) {
  const { x0, x1, top, bottom, bw, bh, cx } = box;
  switch (t.category) {
    case "building": {
      const peak = top - bh * 0.32;
      return `<rect x="${f(x1 - bw * 0.3)}" y="${f(peak + bh * 0.02)}" width="${f(bw * 0.12)}" height="${f(bh * 0.3)}" rx="4" fill="${c.accentShade}" stroke="${INK}" stroke-width="3"/>
        <path d="M${f(x0 - 10)},${f(top + 14)} L${f(cx)},${f(peak)} L${f(x1 + 10)},${f(top + 14)}Z" fill="${c.accent}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
        <path d="M${f(x0 + 4)},${f(top + 6)} L${f(cx)},${f(peak + 14)} L${f(x1 - 4)},${f(top + 6)}" fill="none" stroke="${c.accentShade}" stroke-width="5" stroke-linejoin="round" opacity=".6"/>`;
    }
    case "vehicle":
      return [x0 + bw * 0.22, x1 - bw * 0.22]
        .map((wx) => `<circle cx="${f(wx)}" cy="${f(bottom - 2)}" r="${f(bh * 0.2)}" fill="${INK}"/><circle cx="${f(wx)}" cy="${f(bottom - 2)}" r="${f(bh * 0.08)}" fill="#c9c3dc"/>`)
        .join("");
    case "machine":
      return `<rect x="${f(x0 + 4)}" y="${f(bottom - 8)}" width="${f(bw - 8)}" height="22" rx="11" fill="${INK}"/>
        ${[0.2, 0.4, 0.6, 0.8].map((p) => `<circle cx="${f(x0 + 4 + (bw - 8) * p)}" cy="${f(bottom + 3)}" r="5" fill="#8f87ab"/>`).join("")}
        ${hasHat ? "" : `<path d="M${f(cx)},${f(top + 4)} V${f(top - 26)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="${f(cx)}" cy="${f(top - 30)}" r="9" fill="${c.accent}" stroke="${INK}" stroke-width="3"/>`}`;
    case "nature":
      if (hasHat) return "";
      return `<g stroke="${INK}" stroke-width="3">
          <ellipse cx="${f(cx - 16)}" cy="${f(top - 4)}" rx="12" ry="22" transform="rotate(-35 ${f(cx - 16)} ${f(top - 4)})" fill="#5ccf6b"/>
          <ellipse cx="${f(cx + 16)}" cy="${f(top - 4)}" rx="12" ry="22" transform="rotate(35 ${f(cx + 16)} ${f(top - 4)})" fill="#47b85a"/>
          <ellipse cx="${f(cx)}" cy="${f(top - 12)}" rx="11" ry="20" fill="#7be08a"/>
        </g>`;
    default:
      return "";
  }
}

// In-front-of-body signature pieces (drawn before the face).
function signatureFront(t, box, c, eyes) {
  const { x0, x1, top, bottom, bw, bh, cx } = box;
  switch (t.category) {
    case "building":
      return eyes
        .map(({ x, y, r }) => `<rect x="${f(x - r * 1.5)}" y="${f(y - r * 1.55)}" width="${f(r * 3)}" height="${f(r * 3.05)}" rx="${f(r * 0.5)}" fill="#d9f2ff" stroke="${INK}" stroke-width="3"/>
          <rect x="${f(x - r * 1.75)}" y="${f(y + r * 1.4)}" width="${f(r * 3.5)}" height="7" rx="3.5" fill="${c.light}" stroke="${INK}" stroke-width="2.5"/>`)
        .join("");
    case "vehicle":
      return `<rect x="${f(x0 + bw * 0.16)}" y="${f(top + bh * 0.06)}" width="${f(bw * 0.68)}" height="${f(bh * 0.13)}" rx="8" fill="#d9f2ff" opacity=".85"/>
        <rect x="${f(x0 - 6)}" y="${f(bottom - bh * 0.16)}" width="${f(bw + 12)}" height="14" rx="7" fill="#d8d3e8" stroke="${INK}" stroke-width="3"/>
        ${eyes.map(({ x, y, r }) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.42)}" fill="${c.light}" stroke="${INK}" stroke-width="3"/>`).join("")}`;
    case "street":
      return `<rect x="${f(x0 - 7)}" y="${f(top - 8)}" width="${f(bw + 14)}" height="24" rx="11" fill="${c.accent}" stroke="${INK}" stroke-width="3.2"/>
        <rect x="${f(cx - 14)}" y="${f(top - 16)}" width="28" height="10" rx="5" fill="${c.accentShade}" stroke="${INK}" stroke-width="3"/>`;
    case "household":
      return `<rect x="${f(x0 + 10)}" y="${f(top + 10)}" width="${f(bw - 20)}" height="${f(bh - 20)}" rx="${f(Math.min(bw, bh) * 0.2)}" fill="${c.light}" opacity=".45"/>
        ${[top + 18, bottom - 18].map((sy) => `<circle cx="${f(cx)}" cy="${f(sy)}" r="5" fill="${c.light}" stroke="${INK}" stroke-width="2"/><path d="M${f(cx - 3)},${f(sy)} H${f(cx + 3)}" stroke="${INK}" stroke-width="2"/>`).join("")}`;
    case "food":
      return [[-0.22, 0.1, -20], [0.05, 0.03, 10], [0.25, 0.12, 30], [-0.05, 0.16, -5], [0.32, 0.26, 50], [-0.34, 0.24, -45]]
        .map(([px, py, rot]) => `<ellipse cx="${f(cx + bw * px)}" cy="${f(top + bh * py)}" rx="3" ry="6" transform="rotate(${rot} ${f(cx + bw * px)} ${f(top + bh * py)})" fill="#fff6dc" opacity=".9"/>`)
        .join("");
    default:
      return "";
  }
}

function accessoryEl(id, box, headY, eyes) {
  const { cx, bw, x1 } = box;
  switch (id) {
    case "beanie": {
      const hw = Math.min(bw * 0.36, 52);
      return `<path d="M${f(cx - hw)},${f(headY + 8)} Q${f(cx - hw)},${f(headY - hw * 1.05)} ${f(cx)},${f(headY - hw * 1.05)} Q${f(cx + hw)},${f(headY - hw * 1.05)} ${f(cx + hw)},${f(headY + 8)}Z" fill="#ff5a6e" stroke="${INK}" stroke-width="3"/>
        <rect x="${f(cx - hw - 4)}" y="${f(headY - 2)}" width="${f(hw * 2 + 8)}" height="16" rx="8" fill="#e23d55" stroke="${INK}" stroke-width="3"/>
        <circle cx="${f(cx)}" cy="${f(headY - hw * 1.05 - 6)}" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
    }
    case "partyhat":
      return `<g transform="rotate(12 ${f(cx)} ${f(headY)})"><path d="M${f(cx - 22)},${f(headY + 4)} L${f(cx)},${f(headY - 54)} L${f(cx + 22)},${f(headY + 4)}Z" fill="#7a5cff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M${f(cx - 14)},${f(headY - 16)} L${f(cx + 14)},${f(headY - 10)} M${f(cx - 8)},${f(headY - 34)} L${f(cx + 8)},${f(headY - 30)}" stroke="#c6f432" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${f(cx)}" cy="${f(headY - 58)}" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>`;
    case "crown":
      return `<path d="M${f(cx - 30)},${f(headY + 6)} L${f(cx - 34)},${f(headY - 26)} L${f(cx - 15)},${f(headY - 10)} L${f(cx)},${f(headY - 34)} L${f(cx + 15)},${f(headY - 10)} L${f(cx + 34)},${f(headY - 26)} L${f(cx + 30)},${f(headY + 6)}Z" fill="#ffc83d" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${f(cx)}" cy="${f(headY - 6)}" r="5" fill="#ff5a6e" stroke="${INK}" stroke-width="2"/>`;
    case "cap": {
      const hw = Math.min(bw * 0.34, 48);
      return `<path d="M${f(cx - hw)},${f(headY + 6)} Q${f(cx - hw)},${f(headY - hw)} ${f(cx)},${f(headY - hw)} Q${f(cx + hw)},${f(headY - hw)} ${f(cx + hw)},${f(headY + 6)}Z" fill="#2fa8ff" stroke="${INK}" stroke-width="3"/>
        <path d="M${f(cx + hw - 6)},${f(headY + 6)} Q${f(cx + hw + 34)},${f(headY + 2)} ${f(cx + hw + 40)},${f(headY + 12)} L${f(cx + hw - 6)},${f(headY + 14)}Z" fill="#1c86d6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${f(cx)}" cy="${f(headY - hw)}" r="5" fill="#1c86d6" stroke="${INK}" stroke-width="2.5"/>`;
    }
    case "bow":
      return `<g transform="translate(${f(x1 - 18)} ${f(headY + 4)}) rotate(18)"><path d="M0,0 L-24,-14 L-24,14Z M0,0 L24,-14 L24,14Z" fill="#ff6fb5" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle r="7" fill="#ff3d95" stroke="${INK}" stroke-width="3"/></g>`;
    case "flower":
      return `<g transform="translate(${f(cx - bw * 0.3)} ${f(headY + 2)})">${[0, 72, 144, 216, 288]
        .map((a) => `<ellipse cx="0" cy="-11" rx="7" ry="11" transform="rotate(${a})" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`)
        .join("")}<circle r="7" fill="#ffc83d" stroke="${INK}" stroke-width="2.5"/></g>`;
    case "shades": {
      const [l, r] = eyes;
      return `<g><rect x="${f(l.x - l.r * 1.4)}" y="${f(l.y - l.r * 0.9)}" width="${f(l.r * 2.8)}" height="${f(l.r * 1.9)}" rx="${f(l.r * 0.6)}" fill="${INK}"/>
        <rect x="${f(r.x - r.r * 1.4)}" y="${f(r.y - r.r * 0.9)}" width="${f(r.r * 2.8)}" height="${f(r.r * 1.9)}" rx="${f(r.r * 0.6)}" fill="${INK}"/>
        <path d="M${f(l.x + l.r * 1.3)},${f(l.y - l.r * 0.4)} H${f(r.x - r.r * 1.3)}" stroke="${INK}" stroke-width="4"/>
        <path d="M${f(l.x - l.r * 0.8)},${f(l.y - l.r * 0.4)} l${f(l.r * 0.6)},0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path d="M${f(r.x - r.r * 0.8)},${f(r.y - r.r * 0.4)} l${f(r.r * 0.6)},0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`;
    }
    default:
      return "";
  }
}

export function renderBlockie(t, { accessory = "none", label = "Blockie character", className = "" } = {}) {
  const id = `bk${++counter}${Math.floor(Math.random() * 1e6).toString(36)}`;
  const c = t.colors;
  const cx = 120;
  const bw = 148 * t.body.w;
  const bh = 138 * t.body.h;
  const bottom = 216;
  const top = bottom - bh;
  const box = { cx, bw, bh, bottom, top, x0: cx - bw / 2, x1: cx + bw / 2 };
  const shape = bodyShape(t, box);
  const hat = accessory && accessory !== "none" && accessory !== "shades";

  // Face layout
  const fy = top + bh * (t.category === "street" ? 0.45 : 0.42);
  let r = bw * t.face.eyeSize * 0.95;
  if (t.category === "building") r *= 0.85;
  const gap = Math.max(bw * t.face.gap, r * 2.9);
  const eyes = [
    { x: cx - gap / 2, y: fy, r },
    { x: cx + gap / 2, y: fy, r },
  ];
  const m = Math.max(32, gap * 0.68);
  let my = fy + gap * t.face.mouthDrop * 0.62;
  my = Math.min(Math.max(my, fy + r * 1.7), bottom - (t.category === "vehicle" ? bh * 0.2 + m * 0.5 : m * 0.6) - 4);
  const mx = cx + gap * t.face.mouthShift * 0.4;
  const tiltDeg = (t.face.tilt * 180) / Math.PI;

  const showLimbs = t.category !== "vehicle" && t.category !== "machine";
  const armLift = { happy: -28, cheeky: -20, surprised: -40, angry: 12, sleepy: 18, worried: 6 }[t.mood] ?? 0;
  const headY = t.category === "building" ? top - bh * 0.2 : t.category === "street" ? top - 10 : top + 2;

  const [hue, sat] = hexToHsl(c.main);
  INK = hsl(hue, Math.min(0.55, sat * 0.8 + 0.1), 0.15);
  IRIS = hsl(hexToHsl(c.accent)[0], 0.6, 0.38);
  GID = id;
  const limb = (cxl, cyl, rx, ry, rot) =>
    `<ellipse cx="${f(cxl)}" cy="${f(cyl)}" rx="${rx}" ry="${ry}" ${rot === undefined ? "" : `transform="rotate(${rot} ${f(cxl)} ${f(cyl)})"`} fill="url(#${id}l)" stroke="${INK}" stroke-width="3"/>`;

  return `<svg class="blockie-svg ${className}" viewBox="0 -26 240 286" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}g" cx=".32" cy=".26" r=".95" fx=".3" fy=".22">
      <stop offset="0" stop-color="${c.light}"/><stop offset=".42" stop-color="${c.main}"/><stop offset="1" stop-color="${c.shade}"/>
    </radialGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${c.main}"/><stop offset="1" stop-color="${c.shade}"/></linearGradient>
    <radialGradient id="${id}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}o" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${INK}" stop-opacity=".32"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}s" cx=".45" cy=".35" r=".7"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#e4e0f2"/></radialGradient>
    <radialGradient id="${id}i" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="${hsl(hexToHsl(c.accent)[0], 0.75, 0.62)}"/><stop offset="1" stop-color="${IRIS}"/></radialGradient>
    <radialGradient id="${id}b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff6b8b" stop-opacity=".65"/><stop offset="1" stop-color="#ff6b8b" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}c">${shapeEl(shape, "")}</clipPath>
  </defs>
  <ellipse cx="${cx}" cy="${bottom + 17}" rx="${f(bw * 0.58)}" ry="14" fill="url(#${id}o)"/>
  ${showLimbs ? `
  ${limb(box.x0 + 4, top + bh * 0.62, 10, 19, 30 + armLift)}
  ${limb(box.x1 - 4, top + bh * 0.62, 10, 19, -30 - armLift)}
  ${limb(cx - bw * 0.22, bottom + 8, 17, 10)}
  ${limb(cx + bw * 0.22, bottom + 8, 17, 10)}` : ""}
  ${signatureBack(t, box, c, hat)}
  ${shapeEl(shape, `fill="url(#${id}g)"`)}
  <g clip-path="url(#${id}c)">
    ${details(t, box, c)}
    <ellipse cx="${f(cx)}" cy="${f(bottom + bh * 0.12)}" rx="${f(bw * 0.75)}" ry="${f(bh * 0.3)}" fill="${c.shade}" opacity=".4"/>
    ${shapeEl(shape, `fill="none" stroke="${c.shade}" stroke-width="12" opacity=".55" transform="translate(-4 -5)"`)}
    ${shapeEl(shape, `fill="none" stroke="#fff" stroke-width="9" opacity=".32" transform="translate(4 5)"`)}
    <ellipse cx="${f(box.x0 + bw * 0.3)}" cy="${f(top + bh * 0.19)}" rx="${f(bw * 0.28)}" ry="${f(bh * 0.14)}" transform="rotate(-22 ${f(box.x0 + bw * 0.3)} ${f(top + bh * 0.19)})" fill="url(#${id}h)"/>
    <ellipse cx="${f(box.x0 + bw * 0.24)}" cy="${f(top + bh * 0.14)}" rx="${f(bw * 0.09)}" ry="${f(bh * 0.04)}" transform="rotate(-28 ${f(box.x0 + bw * 0.24)} ${f(top + bh * 0.14)})" fill="#fff" opacity=".85"/>
  </g>
  ${shapeEl(shape, `fill="none" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"`)}
  <g transform="rotate(${f(tiltDeg)} ${cx} ${f(fy)})">
    ${signatureFront(t, box, c, eyes)}
    ${t.face.blush ? eyes.map((e, i) => `<ellipse cx="${f(e.x + (i ? 1 : -1) * r * 0.55)}" cy="${f(e.y + r * 1.55)}" rx="${f(r * 0.85)}" ry="${f(r * 0.5)}" fill="url(#${id}b)"/>`).join("") : ""}
    ${eye(eyes[0].x, eyes[0].y, r, t.mood, -1)}
    ${eye(eyes[1].x, eyes[1].y, r, t.mood, 1)}
    ${mouth(mx, my, m, t.mood)}
    ${accessory === "shades" ? accessoryEl("shades", box, headY, eyes) : ""}
  </g>
  ${t.mood === "sleepy" ? `<text x="${f(box.x1 + 2)}" y="${f(top + 6)}" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="${INK}">z<tspan font-size="15" dy="-12">z</tspan></text>` : ""}
  ${hat ? accessoryEl(accessory, box, headY, eyes) : ""}
</svg>`;
}
