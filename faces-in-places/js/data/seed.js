// Sample accounts and community discoveries so the social features feel
// alive in the prototype. Everything is deterministic from fixed seeds.

import { mulberry32, between, pick } from "../core/random.js";
import { syntheticAnalysis } from "../core/analysis.js";
import { composeBlockie } from "../core/factory.js";
import { MOODS } from "../core/catalog.js";
import { SCENES, SCENE_IDS } from "../render/scenes.js";
import { NEIGHBOURHOODS } from "./places.js";

export const FRIENDS = [
  { id: "maya", name: "Maya", handle: "@mayaspots", avatar: "🦊", color: "#ff7a59", level: 7, streak: 12, home: "shoreditch" },
  { id: "priya", name: "Priya", handle: "@priyapeeks", avatar: "🦉", color: "#7a5cff", level: 9, streak: 21, home: "soho" },
  { id: "jonah", name: "Jonah", handle: "@jonahlooks", avatar: "🐸", color: "#3dbf7f", level: 4, streak: 3, home: "camden" },
  { id: "kenji", name: "Kenji", handle: "@kenji.sees", avatar: "🐙", color: "#2fa8ff", level: 6, streak: 5, home: "shibuya" },
  { id: "lola", name: "Lola", handle: "@lolalooks", avatar: "🐝", color: "#f5b400", level: 3, streak: 1, home: "williamsburg" },
];

const STRANGERS = ["Ade", "Bea", "Cal", "Dee", "Eli", "Fen", "Gus", "Hana", "Ivo", "Jun", "Kit", "Luz", "Mo", "Nia", "Oz", "Pia", "Rui", "Sol", "Tam", "Uma"];
const STRANGER_AVATARS = ["🐼", "🦁", "🐨", "🐯", "🐰", "🦄", "🐳", "🐞", "🦖", "🐧"];

export const person = (id) =>
  FRIENDS.find((f) => f.id === id) || {
    id,
    name: id.replace("x_", ""),
    handle: "@" + id.replace("x_", "").toLowerCase(),
    avatar: STRANGER_AVATARS[id.length % STRANGER_AVATARS.length],
    color: "#9a8fbf",
  };

// Scene "tones" mirror the first rng draws each scene makes, so the seeded
// Blockie's colours match its illustrated photo.
const TONES = {
  house: (r) => ({ hue: between(r, 0, 50), sat: 0.5, light: 0.55 }),
  socket: () => ({ hue: 45, sat: 0.08, light: 0.9 }),
  car: (r) => ({ hue: between(r, 0, 360), sat: 0.65, light: 0.5 }),
  bin: (r) => ({ hue: between(r, 90, 220), sat: 0.45, light: 0.42 }),
  tree: () => ({ hue: 26, sat: 0.4, light: 0.38 }),
  toast: () => ({ hue: 36, sat: 0.75, light: 0.6 }),
  digger: () => ({ hue: 44, sat: 0.95, light: 0.55 }),
};

const HOUR = 3600000;

function seedBlockie(index, ownerId, neighbourhoodId, hoursAgo, now) {
  const rng = mulberry32(index * 7919 + 17);
  const sceneId = SCENE_IDS[(index * 3 + ownerId.length) % SCENE_IDS.length];
  const scene = SCENES[sceneId];
  const sceneSeed = index * 31 + 7;
  const tone = TONES[sceneId](mulberry32(sceneSeed));
  const analysis = syntheticAnalysis({
    ...tone,
    contrast: between(rng, 0.3, 0.7),
    edges: between(rng, 0.05, 0.16),
    colourfulness: 1 + Math.floor(rng() * 3),
    hash: index * 2654435761,
  });
  const mood = rng() < 0.6 ? scene.mood : pick(rng, MOODS).id;
  const record = composeBlockie({ analysis, face: scene.face, category: scene.category, mood, challengeMatch: rng() < 0.3, seed: index * 104729 + 11 });
  return {
    ...record,
    id: `seed_${index}`,
    ownerId,
    art: { kind: "procedural" },
    photo: { kind: "scene", scene: sceneId, seed: sceneSeed },
    face: scene.face,
    place: { neighbourhoodId },
    shared: true,
    accessory: rng() < 0.3 ? pick(rng, ["beanie", "partyhat", "shades", "bow", "cap", "flower", "crown"]) : "none",
    createdAt: now - hoursAgo * HOUR,
    reactions: { "😍": Math.floor(rng() * 40), "😂": Math.floor(rng() * 25), "🤯": Math.floor(rng() * 15) },
  };
}

let cache = null;

// Friends' feed + community pins. `now` is pinned to the hour so relative
// times stay stable while the app is open.
export function communityBlockies() {
  if (cache) return cache;
  const now = Math.floor(Date.now() / HOUR) * HOUR;
  const list = [];
  let i = 1;
  FRIENDS.forEach((friend, fi) => {
    for (let k = 0; k < 4; k++) {
      const hood = k < 2 ? friend.home : NEIGHBOURHOODS[(fi * 5 + k * 3) % NEIGHBOURHOODS.length].id;
      list.push(seedBlockie(i++, friend.id, hood, 1 + fi * 3 + k * 9 + (k * k * 5), now));
    }
  });
  NEIGHBOURHOODS.forEach((hood, ni) => {
    const count = 4 + ((ni * 7) % 6);
    for (let k = 0; k < count; k++) {
      const owner = "x_" + STRANGERS[(ni * 3 + k) % STRANGERS.length];
      list.push(seedBlockie(i++, owner, hood.id, 6 + k * 20 + ni * 4, now));
    }
  });
  cache = list;
  return list;
}

export const friendBlockies = () => communityBlockies().filter((b) => FRIENDS.some((f) => f.id === b.ownerId));

// Deterministic "who finished today's challenge" for the leaderboard.
export function friendChallengeStatus(dayIdx) {
  return FRIENDS.map((f, i) => {
    const r = mulberry32(dayIdx * 97 + i * 13)();
    return { friend: f, done: r < 0.55 + f.streak / 60, finds: 1 + Math.floor(r * 4) };
  });
}
