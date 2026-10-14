// Rule-based rarity. Rarity is earned, not rolled: every point comes from a
// rule the player can read on the character's card.

import { category as getCategory } from "./catalog.js";

const RARE_MOODS = new Set(["angry", "worried", "sleepy"]);

export function faceSymmetry(face) {
  const { left, right, mouth } = face;
  const mid = (left.x + right.x) / 2;
  const tilt = Math.abs(left.y - right.y);
  const offCentre = Math.abs(mouth.x - mid);
  const spacing = Math.max(0.05, Math.abs(right.x - left.x));
  return Math.max(0, 1 - (tilt + offCentre) / spacing);
}

export function scoreRarity({ analysis, category, mood, face, challengeMatch = false }) {
  const reasons = [];
  let score = 0;
  const add = (points, label) => {
    if (points > 0) {
      score += points;
      reasons.push({ points, label });
    }
  };

  const cat = getCategory(category);
  add(cat.difficulty - 1, `${cat.label} faces are harder to find`);

  if (analysis.saturation > 0.5) add(2, "Super vivid colours");
  else if (analysis.saturation > 0.3) add(1, "Bold colours");

  if (analysis.colourfulness >= 3) add(1, "Multi-coloured");
  if (analysis.contrast > 0.55) add(1, "Striking contrast");
  if (analysis.edges > 0.12) add(1, "Lots of detail");

  const symmetry = faceSymmetry(face);
  if (symmetry > 0.9) add(2, "Near-perfect face");
  else if (symmetry > 0.75) add(1, "Well-balanced face");

  if (RARE_MOODS.has(mood)) add(1, "Uncommon expression");
  if (challengeMatch) add(2, "Found for today's challenge");

  let rarity = "common";
  if (score >= 10) rarity = "legendary";
  else if (score >= 7) rarity = "epic";
  else if (score >= 4) rarity = "rare";

  return { rarity, score, reasons };
}
