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

function updateView() {
  for (const [key, value] of Object.entries(state)) {
    byId(key).value = value;
    byId(`${key}Value`).textContent = value;
  }

  const avg = (state.hunger + state.energy + state.mood + state.calm) / 4;
  if (avg > 75) {
    faceEl.textContent = "😊";
    messageEl.textContent = "Your Calmling feels fantastic!";
  } else if (avg > 45) {
    faceEl.textContent = "😌";
    messageEl.textContent = "Your Calmling is doing okay.";
  } else if (avg > 20) {
    faceEl.textContent = "😟";
    messageEl.textContent = "Your Calmling needs attention.";
  } else {
    faceEl.textContent = "😭";
    messageEl.textContent = "Your Calmling is overwhelmed — help now!";
  }
}

function applyAction(action) {
  const effects = {
    feed: { hunger: +24, mood: +4, calm: +3, energy: -3 },
    play: { mood: +16, energy: -8, hunger: -8, calm: -2 },
    rest: { energy: +22, calm: +8, hunger: -7 },
    breathe: { calm: +18, mood: +6, energy: +2 },
  };

  for (const [stat, delta] of Object.entries(effects[action] || {})) {
    state[stat] = clamp(state[stat] + delta);
  }

  updateView();
}

for (const btn of document.querySelectorAll("button[data-action]")) {
  btn.addEventListener("click", () => applyAction(btn.dataset.action));
}

setInterval(() => {
  state.hunger = clamp(state.hunger - 3);
  state.energy = clamp(state.energy - 2);
  state.mood = clamp(state.mood - 2);
  state.calm = clamp(state.calm - 1);
  updateView();
}, 5000);

updateView();
