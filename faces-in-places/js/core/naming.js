// Name + personality generator. Deterministic for a given rng.

import { pick } from "./random.js";

const STEMS = {
  building: ["Bricksley", "Windowna", "Gable", "Doorothy", "Terrace", "Slatey", "Archie", "Porchia"],
  street: ["Binsley", "Posty", "Bollardo", "Hydra", "Grate", "Kerbie", "Lampton", "Meterina"],
  household: ["Sockette", "Plugsy", "Tappy", "Kettleby", "Switchy", "Drawers", "Toastra", "Ventura"],
  vehicle: ["Bumper", "Vroomie", "Grillbert", "Hubcapella", "Scootie", "Fender", "Busby", "Wiper"],
  machine: ["Diggory", "Cogsworth", "Boltina", "Craney", "Gizmo", "Rivet", "Sprocket", "Dozer"],
  nature: ["Knotty", "Barkley", "Mossimo", "Pebbles", "Twiggy", "Cloudia", "Stumpy", "Fernando"],
  food: ["Crumbs", "Toastie", "Muffina", "Bagelbert", "Pretzella", "Latte", "Waffles", "Crumpet"],
};

const SURNAMES = {
  happy: ["Sunbeam", "Grinwell", "Beamsworth", "McChuckle", "Gladstone", "Brightside"],
  surprised: ["Gobsmack", "Wowington", "O'Gasp", "Blinkley", "Jawdrop", "Eek"],
  angry: ["Grumbleton", "Crossley", "Huffington", "Scowlby", "Fumeworth", "Von Grump"],
  sleepy: ["Snoozeford", "Yawnsley", "Dozington", "Nodd", "Pillowby", "Drowse"],
  cheeky: ["Mischief", "Winkworth", "Sly", "Tumbleweed", "Fibbs", "Larkin"],
  worried: ["Frettley", "Wobbleton", "Fidgett", "Nervington", "Quiver", "Uh-Oh"],
};

const TITLES = ["Sir", "Lady", "Captain", "Professor", "Little", "Old", "Doctor", "Big"];

const TRAITS = {
  happy: ["beams at every passer-by", "hums show tunes when no one's listening", "thinks every day is a bank holiday"],
  surprised: ["has been startled since 1987", "can't believe you noticed them", "gasps at pigeons, every single time"],
  angry: ["is furious about parking", "glares at anyone who drops litter", "has strong opinions about the weather"],
  sleepy: ["naps between deliveries", "dreams of quiet Sunday mornings", "yawns loud enough to rattle windows"],
  cheeky: ["winks at tourists", "knows every shortcut in town", "swaps everyone's umbrellas for fun"],
  worried: ["frets about the next rain shower", "keeps counting the pigeons", "is sure they left the oven on"],
};

const HABITS = {
  building: "Guards the street from behind freshly cleaned windows.",
  street: "Keeps the pavement tidy and collects local gossip.",
  household: "Powers through chores and secretly loves a cuppa.",
  vehicle: "Lives for the open road and a good car wash.",
  machine: "Builds tiny cities when the site goes quiet.",
  nature: "Has watched the seasons change for decades.",
  food: "Smells amazing and knows it.",
};

const RARITY_FLAVOUR = {
  common: "",
  rare: " Rarely seen smiling for the camera.",
  epic: " Locals whisper about this one.",
  legendary: " A once-in-a-lifetime find — the city's best-kept secret.",
};

export function generateName(rng, categoryId, moodId) {
  const stem = pick(rng, STEMS[categoryId] || STEMS.building);
  const surname = pick(rng, SURNAMES[moodId] || SURNAMES.happy);
  if (rng() < 0.3) return `${pick(rng, TITLES)} ${stem}`;
  return `${stem} ${surname}`;
}

export function generatePersonality(rng, name, categoryId, moodId, rarityId) {
  const [first] = name.split(" ");
  const subject = TITLES.includes(first) ? name : first;
  const trait = pick(rng, TRAITS[moodId] || TRAITS.happy);
  return `${subject} ${trait}. ${HABITS[categoryId] || ""}${RARITY_FLAVOUR[rarityId] || ""}`.trim();
}
