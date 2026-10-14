// Deterministic hashing + seeded randomness so a given photo always
// produces the same Blockie, and seed data is stable between reloads.

export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (rng, list) => list[Math.floor(rng() * list.length) % list.length];
export const between = (rng, min, max) => min + rng() * (max - min);
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function uid(prefix = "id") {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

// Short, human-readable collectible ID, e.g. FIP-7KQ2-M9XD
export function collectibleId(seed) {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const rng = mulberry32(seed);
  let out = "";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(rng() * alphabet.length)];
  return `FIP-${out.slice(0, 4)}-${out.slice(4)}`;
}
