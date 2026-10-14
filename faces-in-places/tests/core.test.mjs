// Run with: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";

import { analysePixels, suggestFace, defaultFace, syntheticAnalysis } from "../js/core/analysis.js";
import { scoreRarity, faceSymmetry } from "../js/core/rarity.js";
import { challengeForDate, challengeProgress, CHALLENGES, dayKey } from "../js/core/challenges.js";
import { levelFromXp, xpForLevel } from "../js/core/progression.js";
import { composeBlockie } from "../js/core/factory.js";
import { renderBlockie } from "../js/render/blockie.js";
import { CATEGORIES, MOODS, ACCESSORIES } from "../js/core/catalog.js";
import { mulberry32 } from "../js/core/random.js";
import { coarsen, nearestNeighbourhood } from "../js/data/places.js";
import { communityBlockies } from "../js/data/seed.js";

function image(w, h, fn) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.set([...fn(x, y), 255], (y * w + x) * 4);
  return data;
}

test("analysePixels picks the object's colour over the background", () => {
  // grey wall, teal object in the middle
  const data = image(64, 64, (x, y) => (x > 16 && x < 48 && y > 12 && y < 56 ? [40, 150, 150] : [200, 180, 150]));
  const a = analysePixels(data, 64, 64);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(a.palette[0].slice(i, i + 2), 16));
  assert.ok(g > r && b > r, `expected teal-ish dominant colour, got ${a.palette[0]}`);
  assert.ok(a.brightness > 0 && a.brightness < 1);
});

test("suggestFace finds two dark eyes and a mouth", () => {
  const dark = (cx, cy, x, y, r) => (x - cx) ** 2 + (y - cy) ** 2 < r * r;
  const data = image(64, 64, (x, y) => (dark(20, 20, x, y, 5) || dark(44, 20, x, y, 5) || dark(32, 48, x, y, 6) ? [10, 10, 10] : [230, 230, 230]));
  const face = suggestFace(data, 64, 64);
  assert.ok(face.left.x < 0.45 && face.right.x > 0.55, JSON.stringify(face));
  assert.ok(Math.abs(face.left.y - 20 / 64) < 0.1);
  assert.ok(face.mouth.y > face.left.y);
});

test("rarity is rule-based and explains itself", () => {
  const plain = scoreRarity({ analysis: syntheticAnalysis({ hue: 0, sat: 0.1, contrast: 0.2, edges: 0.05, colourfulness: 1, hash: 1 }), category: "building", mood: "happy", face: { left: { x: 0.3, y: 0.3 }, right: { x: 0.6, y: 0.45 }, mouth: { x: 0.7, y: 0.8 } } });
  assert.equal(plain.rarity, "common");

  const wow = scoreRarity({ analysis: syntheticAnalysis({ hue: 0, sat: 0.8, contrast: 0.7, edges: 0.2, colourfulness: 3, hash: 1 }), category: "food", mood: "angry", face: defaultFace(), challengeMatch: true });
  assert.equal(wow.rarity, "legendary");
  assert.equal(wow.score, wow.reasons.reduce((s, r) => s + r.points, 0));
});

test("rarity distribution keeps legendaries rare", () => {
  const rng = mulberry32(42);
  const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  for (let i = 0; i < 2000; i++) {
    const j = () => (rng() - 0.5) * 0.12;
    const face = { left: { x: 0.35 + j(), y: 0.4 + j() }, right: { x: 0.65 + j(), y: 0.4 + j() }, mouth: { x: 0.5 + j(), y: 0.7 + j() } };
    const analysis = syntheticAnalysis({ hue: rng() * 360, sat: rng() * 0.7, contrast: rng() * 0.8, edges: rng() * 0.18, colourfulness: 1 + Math.floor(rng() * 4), hash: i });
    counts[scoreRarity({ analysis, category: CATEGORIES[i % 7].id, mood: MOODS[i % 6].id, face, challengeMatch: rng() < 0.2 }).rarity]++;
  }
  assert.ok(counts.common > counts.legendary * 5, JSON.stringify(counts));
  assert.ok(counts.legendary > 0 && counts.legendary < 120, JSON.stringify(counts));
});

test("face symmetry rewards balanced faces", () => {
  assert.ok(faceSymmetry(defaultFace()) > 0.95);
  assert.ok(faceSymmetry({ left: { x: 0.3, y: 0.2 }, right: { x: 0.5, y: 0.4 }, mouth: { x: 0.8, y: 0.6 } }) < 0.5);
});

test("everyone gets the same daily challenge, and it rotates", () => {
  const a = challengeForDate(new Date("2026-10-14T01:00:00Z"));
  const b = challengeForDate(new Date("2026-10-14T23:00:00Z"));
  const c = challengeForDate(new Date("2026-10-15T01:00:00Z"));
  assert.equal(a.id, b.id);
  assert.notEqual(a.id, c.id);
  const seen = new Set();
  for (let d = 0; d < CHALLENGES.length; d++) seen.add(challengeForDate(new Date(Date.UTC(2026, 0, 1 + d))).id);
  assert.equal(seen.size, CHALLENGES.length);
  assert.equal(dayKey(new Date("2026-10-14T12:00:00Z")), "2026-10-14");
});

test("challenge progress counts matching finds", () => {
  const walk = CHALLENGES.find((c) => c.id === "walk");
  assert.deepEqual(challengeProgress(walk, [{}, {}]), { current: 2, target: 3, done: false });
  const angry = CHALLENGES.find((c) => c.id === "angry");
  assert.equal(challengeProgress(angry, [{ mood: "happy" }, { mood: "angry" }]).done, true);
});

test("levels grow with XP", () => {
  assert.equal(levelFromXp(0).level, 1);
  assert.equal(levelFromXp(xpForLevel(2)).level, 2);
  assert.equal(levelFromXp(xpForLevel(5) - 1).level, 4);
});

test("the same photo + face always makes the same Blockie", () => {
  const input = { analysis: syntheticAnalysis({ hue: 200, hash: 1234 }), face: defaultFace(), category: "street", mood: "angry" };
  const a = composeBlockie(input);
  const b = composeBlockie(input);
  assert.deepEqual(a, b);
  assert.match(a.collectibleId, /^FIP-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  assert.ok(a.name.length > 3 && a.personality.length > 20);
});

test("every category, mood and accessory renders a well-formed SVG", () => {
  let i = 0;
  for (const c of CATEGORIES) {
    for (const m of MOODS) {
      const b = composeBlockie({ analysis: syntheticAnalysis({ hue: i * 40, hash: i }), face: defaultFace(), category: c.id, mood: m.id });
      const svg = renderBlockie(b.traits, { accessory: ACCESSORIES[i++ % ACCESSORIES.length].id });
      assert.ok(svg.startsWith("<svg") && svg.trim().endsWith("</svg>"));
      assert.ok(!/NaN|undefined/.test(svg), `${c.id}/${m.id} produced NaN/undefined`);
    }
  }
});

test("locations are coarsened and snapped to neighbourhoods", () => {
  assert.deepEqual(coarsen({ lat: 51.52654321, lng: -0.07861234 }), { lat: 51.53, lng: -0.08 });
  assert.equal(nearestNeighbourhood({ lat: 51.53, lng: -0.08 }).id, "shoreditch");
  assert.equal(nearestNeighbourhood({ lat: 0, lng: 0 }), null);
});

test("seed community data is stable and complete", () => {
  const list = communityBlockies();
  assert.ok(list.length > 60);
  assert.equal(new Set(list.map((b) => b.id)).size, list.length);
  assert.ok(list.every((b) => b.place.neighbourhoodId && b.traits && b.photo.scene));
});
