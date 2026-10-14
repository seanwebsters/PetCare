// Assembles a complete Blockie from its inputs. Shared by the mock AI
// generator, the real-API adapter (for rarity/naming fallbacks) and seed data.

import { mulberry32, collectibleId } from "./random.js";
import { buildTraits } from "./traits.js";
import { scoreRarity } from "./rarity.js";
import { generateName, generatePersonality } from "./naming.js";

export function seedFor(analysis, face, category, mood) {
  const f = Math.round((face.left.x + face.right.y * 3 + face.mouth.x * 7) * 1000);
  return (analysis.hash ^ Math.imul(f, 2654435761) ^ (category.length * 977) ^ (mood.length * 131)) >>> 0;
}

export function composeBlockie({ analysis, face, category, mood, challengeMatch = false, seed }) {
  const s = seed ?? seedFor(analysis, face, category, mood);
  const rng = mulberry32(s ^ 0x9e3779b9);
  const traits = buildTraits({ analysis, face, category, mood, seed: s });
  const { rarity, score, reasons } = scoreRarity({ analysis, category, mood, face, challengeMatch });
  const name = generateName(rng, category, mood);
  const personality = generatePersonality(rng, name, category, mood, rarity);
  return {
    collectibleId: collectibleId(s),
    name,
    personality,
    category,
    mood,
    rarity,
    rarityScore: score,
    rarityReasons: reasons,
    traits,
  };
}
