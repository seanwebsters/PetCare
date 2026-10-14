import { $, esc, icon, card, confetti, enableTilt, toast, shareBlockie, logoMark } from "../ui.js";
import { addBlockie } from "../store.js";
import { session } from "../session.js";
import { createGenerator } from "../ai/generator.js";
import { rarity as getRarity } from "../core/catalog.js";
import { BADGES, levelTitle } from "../core/progression.js";
import { flame } from "./streak.js";

function streakCelebration(st) {
  const headline = st.milestone
    ? `${st.days}-day milestone!`
    : st.extended
      ? `Day ${st.days} of your streak!`
      : st.restarted
        ? "New streak started!"
        : "Streak started!";
  const notes = [
    st.usedFreezes ? `🧊 ${st.usedFreezes === 1 ? "A freeze" : `${st.usedFreezes} freezes`} saved your streak` : "",
    st.earnedFreeze ? "🧊 You earned a streak freeze!" : "",
    st.newBest && st.days > 1 ? "🏅 New personal best" : "",
    st.bonusXp ? `+${st.bonusXp} XP streak bonus` : "",
  ].filter(Boolean);
  return `<div class="streak-celebrate ${st.milestone ? "streak-celebrate--milestone" : ""}" data-open-streak role="button" tabindex="0">
    ${flame(st.days, { size: "lg" })}
    <div><b>${headline}</b>${notes.map((n) => `<small>${n}</small>`).join("")}</div>
  </div>`;
}

const generator = createGenerator();

export default function reveal(root) {
  const pending = session.pending;
  if (!pending) {
    location.replace("#/scan");
    return;
  }
  let alive = true;
  const { request } = pending;
  const dots = ["left", "right", "mouth"].map((k) => `<i class="dot dot--${k}" style="left:${request.face[k].x * 100}%;top:${request.face[k].y * 100}%"></i>`).join("");

  root.innerHTML = `
    <div class="reveal">
      <div class="reveal__stage" id="stage">
        <div class="analyse">
          <div class="analyse__photo"><img src="${request.photo}" alt="Your photo"><div class="analyse__beam"></div><div class="analyse__dots">${dots}</div><div class="analyse__grid"></div></div>
          <p class="analyse__label" id="stageLabel">Waking up the studio…</p>
          <div class="analyse__bar"><i id="bar"></i></div>
        </div>
      </div>
    </div>`;

  let progress = 0;
  const onStage = (label) => {
    if (!alive) return;
    progress = Math.min(95, progress + 24);
    $("#stageLabel", root).textContent = label;
    $("#bar", root).style.width = `${progress}%`;
  };

  generator
    .transform(request, onStage)
    .then((result) => {
      if (!alive) return;
      const outcome = addBlockie(result, { photo: { kind: "data", url: request.photo }, face: request.face, place: pending.place, shared: pending.shared });
      session.pending = null;
      showReveal(outcome);
    })
    .catch((err) => {
      if (!alive) return;
      $("#stage", root).innerHTML = `<div class="reveal__error"><p class="display-sm">The studio sneezed 🤧</p><p class="muted">${esc(err.message)}</p>
        <button class="btn btn--primary" id="retry">Try again</button><a class="link" href="#/scan">Back to camera</a></div>`;
      $("#retry", root).onclick = () => reveal(root);
    });

  function showReveal({ blockie: b, xpGained, challengeCompleted, streak, levelUp, newBadges }) {
    const r = getRarity(b.rarity);
    const flash = document.createElement("div");
    flash.className = "flash";
    document.body.append(flash);
    setTimeout(() => flash.remove(), 700);

    $("#stage", root).innerHTML = `
      <div class="reveal__result reveal--${b.rarity}">
        <div class="burst" aria-hidden="true"></div>
        <p class="reveal__stamp">${r.rank >= 2 ? "Whoa! " : ""}${r.label}${r.rank === 3 ? "!!" : "!"}</p>
        <div class="flipper" id="flipper" role="button" tabindex="0" aria-label="Flip card to see the original photo">
          <div class="flipper__inner">
            <div class="flipper__front">${card(b)}</div>
            <div class="flipper__back" id="cardBack"><div class="card-back">${logoMark(72)}<span>Faces in Places</span></div></div>
          </div>
        </div>
        <p class="hint-flip">${icon.flip} Tap the card to see the original</p>
        <div class="reveal__info">
          <h1 class="display-sm">Meet ${esc(b.name)}</h1>
          <p class="personality">“${esc(b.personality)}”</p>
          <div class="reward-row">
            <span class="pill pill--xp">${icon.bolt} +${xpGained} XP</span>
            ${challengeCompleted ? `<span class="pill pill--win">🏆 Challenge complete!</span>` : ""}
            ${levelUp ? `<span class="pill pill--level">⬆️ Level ${levelUp} · ${levelTitle(levelUp)}</span>` : ""}
          </div>
          ${streak ? streakCelebration(streak) : ""}
          ${newBadges.length ? `<div class="new-badges">${newBadges.map((id) => BADGES.find((x) => x.id === id)).map((x) => `<div class="badge badge--new"><span>${x.emoji}</span><b>${x.title}</b></div>`).join("")}</div>` : ""}
          <details class="why">
            <summary>Why ${r.label}? <span class="muted">${b.rarityScore} pts</span></summary>
            <ul>${b.rarityReasons.length ? b.rarityReasons.map((x) => `<li><span>${esc(x.label)}</span><b>+${x.points}</b></li>`).join("") : `<li><span>A classic everyday find</span><b>+0</b></li>`}</ul>
            <p class="muted small">Common 0–3 · Rare 4–6 · Epic 7–9 · Legendary 10+</p>
          </details>
          <div class="reveal__actions">
            <button class="btn btn--ghost" id="share">${icon.share} Share</button>
            <a class="btn btn--primary" href="#/blockie/${b.id}">View in collection</a>
          </div>
          <a class="link center" href="#/scan">${icon.camera} Scan another face</a>
        </div>
      </div>`;

    const flipper = $("#flipper", root);
    flipper.classList.add("flipper--intro");
    setTimeout(() => {
      if (!alive) return;
      $("#cardBack", root).innerHTML = `<div class="card-back card-back--photo"><img src="${request.photo}" alt="Original photo"><span>The original</span></div>`;
      enableTilt(root);
      if (r.rank >= 1) confetti([0, 40, 80, 160][r.rank]);
    }, 1400);
    const flip = () => flipper.classList.toggle("is-flipped");
    flipper.onclick = flip;
    flipper.onkeydown = (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), flip());

    $("#share", root).onclick = async () => {
      const res = await shareBlockie(b);
      if (res === "downloaded") toast("Card saved — post it anywhere!", { emoji: "🖼️" });
    };
  }

  return () => {
    alive = false;
  };
}
