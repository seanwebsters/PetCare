// Daily challenges: everyone on Earth gets the same one, keyed off the UTC date.

export const CHALLENGES = [
  { id: "happy", title: "Find a happy face", blurb: "Something out there is grinning at you.", emoji: "😊", rule: { mood: "happy" } },
  { id: "angry", title: "Find an angry face", blurb: "Spot something that looks thoroughly fed up.", emoji: "😠", rule: { mood: "angry" } },
  { id: "building", title: "Find a face on a building", blurb: "Windows for eyes, door for a mouth.", emoji: "🏠", rule: { category: "building" } },
  { id: "machine", title: "Find a face made of metal", blurb: "Machines, gadgets and anything that clanks.", emoji: "⚙️", rule: { category: "machine" } },
  { id: "walk", title: "Find three faces on your walk", blurb: "Any face counts. Three before midnight!", emoji: "🚶", rule: { count: 3 } },
  { id: "surprised", title: "Find a surprised face", blurb: "Look for wide eyes and an 'O' mouth.", emoji: "😮", rule: { mood: "surprised" } },
  { id: "vehicle", title: "Find a face on wheels", blurb: "Headlights make great eyes.", emoji: "🚗", rule: { category: "vehicle" } },
  { id: "sleepy", title: "Find a sleepy face", blurb: "Droopy eyes, heavy lids, total snooze.", emoji: "😴", rule: { mood: "sleepy" } },
  { id: "street", title: "Find a face on the street", blurb: "Bins, postboxes, bollards — check them all.", emoji: "🗑️", rule: { category: "street" } },
  { id: "nature", title: "Find a face in nature", blurb: "Bark, rocks and clouds hide the shyest faces.", emoji: "🌳", rule: { category: "nature" } },
  { id: "cheeky", title: "Find a cheeky face", blurb: "Something winking? Tongue out? Perfect.", emoji: "😜", rule: { mood: "cheeky" } },
  { id: "household", title: "Find a face at home", blurb: "Plug sockets are a classic for a reason.", emoji: "🔌", rule: { category: "household" } },
  { id: "two", title: "Double take: find two faces", blurb: "Two discoveries today, any kind.", emoji: "✌️", rule: { count: 2 } },
  { id: "food", title: "Find a face in your food", blurb: "Breakfast is watching you.", emoji: "🥐", rule: { category: "food" } },
  { id: "worried", title: "Find a worried face", blurb: "Something looks like it forgot its keys.", emoji: "😟", rule: { mood: "worried" } },
];

const EPOCH = Date.UTC(2025, 0, 1);
const DAY = 86400000;

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export function dayIndex(date = new Date()) {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utcMidnight - EPOCH) / DAY);
}

export function challengeForDate(date = new Date()) {
  const i = dayIndex(date);
  // Stride by 7 (co-prime with 15) so similar challenges don't land on consecutive days.
  return CHALLENGES[(((i * 7) % CHALLENGES.length) + CHALLENGES.length) % CHALLENGES.length];
}

export function msUntilReset(date = new Date()) {
  const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return next - date.getTime();
}

// Does a single find satisfy a mood/category rule?
export function findMatches(challenge, find) {
  const { rule } = challenge;
  if (rule.mood && find.mood !== rule.mood) return false;
  if (rule.category && find.category !== rule.category) return false;
  return true;
}

// Progress for today given today's finds (array of {mood, category}).
export function challengeProgress(challenge, todaysFinds) {
  const target = challenge.rule.count || 1;
  const matching = todaysFinds.filter((f) => findMatches(challenge, f)).length;
  return { current: Math.min(target, matching), target, done: matching >= target };
}
