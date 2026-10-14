// Illustrated stand-ins for real photos: used for sample scans (so the app is
// playable on a laptop without a camera) and for seeded friends' discoveries.
// Each scene knows where its hidden face is.

import { mulberry32, between } from "../core/random.js";
import { hsl } from "../core/color.js";

const W = 400;

export const SCENES = {
  house: {
    label: "Terraced house",
    category: "building",
    mood: "happy",
    face: { left: { x: 0.33, y: 0.42 }, right: { x: 0.67, y: 0.42 }, mouth: { x: 0.5, y: 0.75 } },
    draw: (rng) => {
      const wall = hsl(between(rng, 0, 50), 0.5, 0.55);
      return `<rect width="400" height="400" fill="#9fd8ff"/><rect y="330" width="400" height="70" fill="#8b8f99"/>
        <rect x="40" y="90" width="320" height="260" fill="${wall}"/>
        <path d="M20,100 L200,20 L380,100Z" fill="#5b3b33"/>
        <rect x="80" y="130" width="100" height="80" fill="#cfeeff" stroke="#fff" stroke-width="10"/><rect x="220" y="130" width="100" height="80" fill="#cfeeff" stroke="#fff" stroke-width="10"/>
        <circle cx="130" cy="175" r="16" fill="#3c4a63"/><circle cx="270" cy="175" r="16" fill="#3c4a63"/>
        <rect x="160" y="250" width="80" height="100" rx="40" fill="#24304a"/>
        ${Array.from({ length: 14 }, (_, i) => `<rect x="${50 + (i % 7) * 44}" y="${100 + Math.floor(i / 7) * 220}" width="34" height="10" fill="#000" opacity=".06"/>`).join("")}`;
    },
  },
  socket: {
    label: "Plug socket",
    category: "household",
    mood: "surprised",
    face: { left: { x: 0.4, y: 0.42 }, right: { x: 0.6, y: 0.42 }, mouth: { x: 0.5, y: 0.62 } },
    draw: (rng) => {
      const wall = hsl(between(rng, 20, 60), 0.35, 0.82);
      return `<rect width="400" height="400" fill="${wall}"/><rect x="100" y="100" width="200" height="200" rx="24" fill="#fbfbf7" stroke="#d9d6cc" stroke-width="6"/>
        <rect x="150" y="150" width="20" height="36" rx="5" fill="#2b2b33"/><rect x="230" y="150" width="20" height="36" rx="5" fill="#2b2b33"/>
        <rect x="186" y="230" width="28" height="40" rx="8" fill="#2b2b33"/>
        <rect x="104" y="296" width="192" height="14" rx="6" fill="#000" opacity=".06"/>`;
    },
  },
  car: {
    label: "Hatchback",
    category: "vehicle",
    mood: "cheeky",
    face: { left: { x: 0.28, y: 0.55 }, right: { x: 0.72, y: 0.55 }, mouth: { x: 0.5, y: 0.73 } },
    draw: (rng) => {
      const paint = hsl(between(rng, 0, 360), 0.65, 0.5);
      return `<rect width="400" height="400" fill="#c2cad6"/><rect y="300" width="400" height="100" fill="#4d525c"/>
        <path d="M60,200 Q80,120 140,110 L260,110 Q320,120 340,200Z" fill="${paint}"/><path d="M100,190 Q115,135 150,130 L250,130 Q285,135 300,190Z" fill="#a9d6f2"/>
        <rect x="40" y="190" width="320" height="130" rx="40" fill="${paint}"/>
        <circle cx="112" cy="222" r="30" fill="#fff8d6" stroke="#d9d9d9" stroke-width="6"/><circle cx="288" cy="222" r="30" fill="#fff8d6" stroke="#d9d9d9" stroke-width="6"/>
        <rect x="150" y="270" width="100" height="34" rx="16" fill="#26262e"/><rect x="40" y="300" width="320" height="22" rx="10" fill="#2f2f37"/>`;
    },
  },
  bin: {
    label: "Wheelie bin",
    category: "street",
    mood: "angry",
    face: { left: { x: 0.4, y: 0.38 }, right: { x: 0.6, y: 0.38 }, mouth: { x: 0.5, y: 0.6 } },
    draw: (rng) => {
      const body = hsl(between(rng, 90, 220), 0.45, 0.4);
      return `<rect width="400" height="400" fill="#b9a790"/><rect y="320" width="400" height="80" fill="#7c7368"/>
        <rect x="110" y="70" width="180" height="34" rx="10" fill="${body}"/><rect x="110" y="70" width="180" height="34" rx="10" fill="#000" opacity=".22"/>
        <path d="M120,100 L280,100 L265,340 L135,340Z" fill="${body}"/>
        <path d="M140,140 L185,160 M260,140 L215,160" stroke="#1d1d24" stroke-width="12" stroke-linecap="round"/>
        <circle cx="160" cy="165" r="10" fill="#1d1d24"/><circle cx="240" cy="165" r="10" fill="#1d1d24"/>
        <rect x="160" y="230" width="80" height="22" rx="8" fill="#1d1d24"/>
        <circle cx="140" cy="345" r="18" fill="#222"/><circle cx="260" cy="345" r="18" fill="#222"/>`;
    },
  },
  tree: {
    label: "Old oak",
    category: "nature",
    mood: "sleepy",
    face: { left: { x: 0.4, y: 0.42 }, right: { x: 0.6, y: 0.43 }, mouth: { x: 0.5, y: 0.66 } },
    draw: () =>
      `<rect width="400" height="400" fill="#6fae5d"/><rect y="330" width="400" height="70" fill="#4d7a3c"/>
        <path d="M110,0 L290,0 L300,400 L100,400Z" fill="#7a5235"/>
        ${[130, 170, 230, 270].map((x) => `<path d="M${x},0 Q${x + 10},200 ${x - 6},400" stroke="#5c3b24" stroke-width="5" fill="none"/>`).join("")}
        <path d="M140,170 Q160,160 180,172" stroke="#3a2416" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M220,172 Q240,160 260,174" stroke="#3a2416" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="200" cy="265" rx="22" ry="26" fill="#2e1c10"/>`,
  },
  toast: {
    label: "Breakfast toast",
    category: "food",
    mood: "happy",
    face: { left: { x: 0.38, y: 0.42 }, right: { x: 0.62, y: 0.42 }, mouth: { x: 0.5, y: 0.64 } },
    draw: () =>
      `<rect width="400" height="400" fill="#e7f0f5"/><ellipse cx="200" cy="220" rx="180" ry="150" fill="#fff" stroke="#d9e2e8" stroke-width="6"/>
        <path d="M90,130 Q90,80 140,80 L260,80 Q310,80 310,130 L300,320 L100,320Z" fill="#c98a3d"/><path d="M110,140 Q110,100 150,100 L250,100 Q290,100 290,140 L282,300 L118,300Z" fill="#f2c27a"/>
        <circle cx="152" cy="168" r="14" fill="#2f5bd6"/><circle cx="248" cy="168" r="14" fill="#2f5bd6"/>
        <path d="M150,245 Q200,290 250,245" stroke="#e8c23a" stroke-width="18" fill="none" stroke-linecap="round"/>`,
  },
  digger: {
    label: "Digger",
    category: "machine",
    mood: "worried",
    face: { left: { x: 0.36, y: 0.38 }, right: { x: 0.64, y: 0.38 }, mouth: { x: 0.5, y: 0.6 } },
    draw: () =>
      `<rect width="400" height="400" fill="#f4d9a8"/><rect y="320" width="400" height="80" fill="#a87b4f"/>
        <rect x="80" y="80" width="240" height="210" rx="20" fill="#ffc21a"/><rect x="110" y="100" width="180" height="70" rx="10" fill="#bfe3f2"/>
        <circle cx="145" cy="152" r="18" fill="#fff" stroke="#333" stroke-width="5"/><circle cx="255" cy="152" r="18" fill="#fff" stroke="#333" stroke-width="5"/>
        <path d="M150,240 q25,-16 50,0 t50,0" stroke="#333" stroke-width="12" fill="none" stroke-linecap="round"/>
        <rect x="60" y="290" width="280" height="50" rx="25" fill="#333"/>`,
  },
};

export const SCENE_IDS = Object.keys(SCENES);

export function renderScene(kind, seed = 1) {
  const scene = SCENES[kind] || SCENES.house;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}">${scene.draw(mulberry32(seed))}</svg>`;
}

export const sceneDataUrl = (kind, seed) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(renderScene(kind, seed));
