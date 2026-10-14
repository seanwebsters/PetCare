// Turns photo analysis + the player's face marks into a Blockie "genome":
// everything the renderer needs to draw a consistent character.

import { mulberry32, pick, between, clamp } from "./random.js";
import { hexToHsl, hsl } from "./color.js";

const DETAILS = {
  building: ["bricks", "none", "stripes"],
  street: ["stripes", "none", "spots"],
  household: ["none", "panel", "spots"],
  vehicle: ["stripes", "none", "panel"],
  machine: ["bolts", "stripes", "panel"],
  nature: ["spots", "rings", "none"],
  food: ["spots", "none", "rings"],
};

// Make photo colours toy-like: keep the hue, tame the extremes.
function toyColour(hex, rng, minSat = 0.45) {
  let [h, s, l] = hexToHsl(hex);
  if (s < 0.12) {
    // Greyscale objects (concrete, metal) keep a soft tint so they stay charming.
    s = between(rng, 0.12, 0.25);
    h = h || between(rng, 190, 230);
  } else {
    s = clamp(s * 1.15, minSat, 0.85);
  }
  l = clamp(l, 0.5, 0.7);
  return { h, s, l };
}

export function buildTraits({ analysis, face, category, mood, seed }) {
  const rng = mulberry32(seed);
  const main = toyColour(analysis.palette[0] || analysis.avg, rng);
  const accentSrc = analysis.palette[1] ? toyColour(analysis.palette[1], rng, 0.5) : { h: main.h + 150, s: 0.7, l: 0.6 };
  if (Math.abs(accentSrc.h - main.h) < 25) accentSrc.h = main.h + between(rng, 120, 200);

  // Face geometry from the player's marks, normalised by eye spacing so the
  // character keeps the object's proportions without breaking the design.
  const spacing = Math.max(0.05, Math.hypot(face.right.x - face.left.x, face.right.y - face.left.y));
  const mid = { x: (face.left.x + face.right.x) / 2, y: (face.left.y + face.right.y) / 2 };
  const tilt = clamp(Math.atan2(face.right.y - face.left.y, face.right.x - face.left.x), -0.3, 0.3);
  const mouthDrop = clamp((face.mouth.y - mid.y) / spacing, 0.45, 1.5);
  const mouthShift = clamp((face.mouth.x - mid.x) / spacing, -0.35, 0.35);

  const tall = category === "street" || category === "nature";
  const wide = category === "vehicle" || category === "machine";

  return {
    v: 1,
    seed,
    category,
    mood,
    body: {
      w: wide ? between(rng, 1.05, 1.18) : tall ? between(rng, 0.78, 0.9) : between(rng, 0.9, 1.04),
      h: tall ? between(rng, 1.05, 1.15) : wide ? between(rng, 0.78, 0.88) : between(rng, 0.88, 1.0),
      radius: between(rng, 0.22, 0.36),
      wobble: rng(),
    },
    colors: {
      main: hsl(main.h, main.s, main.l),
      light: hsl(main.h, main.s * 0.85, Math.min(0.88, main.l + 0.16)),
      shade: hsl(main.h + 4, Math.min(0.9, main.s + 0.08), Math.max(0.28, main.l - 0.2)),
      accent: hsl(accentSrc.h, accentSrc.s, accentSrc.l),
      accentShade: hsl(accentSrc.h, accentSrc.s, Math.max(0.3, accentSrc.l - 0.18)),
    },
    face: {
      gap: clamp(spacing * 1.2, 0.3, 0.5),
      eyeSize: clamp(0.11 + spacing * 0.08, 0.11, 0.15) * between(rng, 0.92, 1.08),
      tilt,
      mouthDrop,
      mouthShift,
      blush: mood !== "angry" && rng() > 0.25,
    },
    detail: pick(rng, DETAILS[category] || ["none"]),
    flourish: rng(),
  };
}
