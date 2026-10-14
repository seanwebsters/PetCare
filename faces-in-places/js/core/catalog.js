// Static game catalogue: object categories, moods, rarities and cosmetics.

export const CATEGORIES = [
  { id: "building", label: "Building", emoji: "🏠", difficulty: 1, hint: "Windows, doors, shopfronts" },
  { id: "street", label: "Street stuff", emoji: "🗑️", difficulty: 1, hint: "Bins, postboxes, bollards" },
  { id: "household", label: "Household", emoji: "🔌", difficulty: 1, hint: "Sockets, taps, appliances" },
  { id: "vehicle", label: "Vehicle", emoji: "🚗", difficulty: 2, hint: "Cars, buses, scooters" },
  { id: "machine", label: "Machine", emoji: "🚜", difficulty: 2, hint: "Diggers, robots, gadgets" },
  { id: "nature", label: "Nature", emoji: "🌳", difficulty: 3, hint: "Trees, rocks, clouds" },
  { id: "food", label: "Food & drink", emoji: "🥐", difficulty: 3, hint: "Toast, coffee, fruit" },
];

export const MOODS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "surprised", label: "Surprised", emoji: "😮" },
  { id: "angry", label: "Angry", emoji: "😠" },
  { id: "sleepy", label: "Sleepy", emoji: "😴" },
  { id: "cheeky", label: "Cheeky", emoji: "😜" },
  { id: "worried", label: "Worried", emoji: "😟" },
];

export const RARITIES = [
  { id: "common", label: "Common", xp: 20, rank: 0 },
  { id: "rare", label: "Rare", xp: 40, rank: 1 },
  { id: "epic", label: "Epic", xp: 80, rank: 2 },
  { id: "legendary", label: "Legendary", xp: 150, rank: 3 },
];

export const ACCESSORIES = [
  { id: "none", label: "None", emoji: "✖️", level: 1 },
  { id: "beanie", label: "Beanie", emoji: "🧶", level: 1 },
  { id: "partyhat", label: "Party hat", emoji: "🎉", level: 1 },
  { id: "shades", label: "Shades", emoji: "🕶️", level: 2 },
  { id: "bow", label: "Bow", emoji: "🎀", level: 2 },
  { id: "cap", label: "Cap", emoji: "🧢", level: 3 },
  { id: "flower", label: "Flower", emoji: "🌼", level: 4 },
  { id: "crown", label: "Crown", emoji: "👑", level: 6 },
];

export const byId = (list, id) => list.find((item) => item.id === id) || list[0];
export const category = (id) => byId(CATEGORIES, id);
export const mood = (id) => byId(MOODS, id);
export const rarity = (id) => byId(RARITIES, id);
export const accessory = (id) => byId(ACCESSORIES, id);
