import { $, esc, logoMark, card } from "../ui.js";
import { completeOnboarding } from "../store.js";
import { sceneDataUrl } from "../render/scenes.js";
import { communityBlockies } from "../data/seed.js";

export default function onboarding() {
  const pool = communityBlockies();
  const hero = pool.find((b) => b.photo.scene === "house") || pool[0];
  const trio = ["common", "rare", "legendary"].map((r) => pool.find((b) => b.rarity === r) || pool[0]);

  const slides = [
    {
      art: `<div class="ob-morph"><img src="${sceneDataUrl(hero.photo.scene, hero.photo.seed)}" alt=""><div class="ob-morph__arrow">✨</div>${card(hero, { tilt: false, className: "card--mini" })}</div>`,
      title: "Everywhere<br>has a face.",
      text: "Two windows and a door. A socket. A surprised bin. Once you see them, you can't stop.",
    },
    {
      art: `<div class="ob-steps"><div><span>👀</span><b>Spot</b></div><div><span>📸</span><b>Snap</b></div><div><span>✨</span><b>Transform</b></div></div>`,
      title: "Spot it.<br>Snap it.",
      text: "Photograph a hidden face and our studio turns it into a one-of-a-kind Blockie — with a name, personality and rarity.",
    },
    {
      art: `<div class="ob-fan">${trio.map((b) => card(b, { tilt: false, className: "card--mini" })).join("")}</div>`,
      title: "Collect them all.",
      text: "Beat the daily challenge, keep your streak, fill your map and show your crew. Rarity is earned, not random.",
    },
  ];
  let i = 0;

  const wrap = document.createElement("div");
  wrap.className = "onboarding";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-modal", "true");
  wrap.setAttribute("aria-label", "Welcome to Faces in Places");
  document.body.append(wrap);

  function draw() {
    const s = slides[i];
    wrap.innerHTML = `
      <div class="onboarding__top">${logoMark(40)}<button class="link" id="skip">Skip</button></div>
      <div class="onboarding__art" key="${i}">${s.art}</div>
      <div class="onboarding__copy">
        <h1 class="display">${s.title}</h1>
        <p>${esc(s.text)}</p>
      </div>
      <div class="onboarding__foot">
        <div class="dots">${slides.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
        <button class="btn btn--primary btn--xl" id="next">${i < slides.length - 1 ? "Next" : "Start spotting"}</button>
      </div>`;
    $("#next", wrap).onclick = () => (i < slides.length - 1 ? (i++, draw()) : done());
    $("#skip", wrap).onclick = done;
  }

  function done() {
    completeOnboarding();
    wrap.classList.add("onboarding--out");
    setTimeout(() => wrap.remove(), 350);
  }

  draw();
}
