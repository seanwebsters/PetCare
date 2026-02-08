const state = {
  hunger: 70,
  energy: 70,
  mood: 70,
  calm: 80,
};

const clamp = (v) => Math.max(0, Math.min(100, v));
const byId = (id) => document.getElementById(id);

const messageEl = byId("message");
const faceEl = byId("calmlingFace");
const calmlingEl = document.querySelector(".calmling");

function updateView() {
  for (const [key, value] of Object.entries(state)) {
    const meter = byId(key);
    const valueEl = byId(`${key}Value`);
    if (meter) meter.value = value;
    if (valueEl) valueEl.textContent = value;
  }

  const avg = (state.hunger + state.energy + state.mood + state.calm) / 4;
  if (avg > 75) {
    if (faceEl) faceEl.textContent = "😊";
    if (messageEl) messageEl.textContent = "Your Calmling feels fantastic!";
  } else if (avg > 45) {
    if (faceEl) faceEl.textContent = "😌";
    if (messageEl) messageEl.textContent = "Your Calmling is doing okay.";
  } else if (avg > 20) {
    if (faceEl) faceEl.textContent = "😟";
    if (messageEl) messageEl.textContent = "Your Calmling needs attention.";
  } else {
    if (faceEl) faceEl.textContent = "😭";
    if (messageEl) messageEl.textContent = "Your Calmling is overwhelmed — help now!";
  }
}

function applyAction(action) {
  const effects = {
    feed: { hunger: +24, mood: +4, calm: +3, energy: -3 },
    play: { mood: +16, energy: -8, hunger: -8, calm: -2 },
    rest: { energy: +22, calm: +8, hunger: -7 },
    breathe: { calm: +18, mood: +6, energy: +2 },
    pet: { calm: +4, mood: +3 },
  };

  for (const [stat, delta] of Object.entries(effects[action] || {})) {
    state[stat] = clamp(state[stat] + delta);
  }

  updateView();
}

for (const btn of document.querySelectorAll("button[data-action]")) {
  btn.addEventListener("click", () => applyAction(btn.dataset.action));
}

if (calmlingEl) {
  calmlingEl.addEventListener("click", () => applyAction("pet"));
}

setInterval(() => {
  state.hunger = clamp(state.hunger - 3);
  state.energy = clamp(state.energy - 2);
  state.mood = clamp(state.mood - 2);
  state.calm = clamp(state.calm - 1);
  updateView();
}, 5000);

updateView();
