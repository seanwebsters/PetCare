import { $, $$, esc, icon, toast } from "../ui.js";
import { todaysChallenge, wouldMatchChallenge } from "../store.js";
import { session } from "../session.js";
import { analysePixels, suggestFace, suggestMood } from "../core/analysis.js";
import { CATEGORIES, MOODS } from "../core/catalog.js";
import { SCENES, SCENE_IDS, sceneDataUrl } from "../render/scenes.js";
import { NEIGHBOURHOODS, CITIES, coarsen, nearestNeighbourhood } from "../data/places.js";

const PHOTO_SIZE = 560; // stored photo is a square JPEG, ~40KB
const ANALYSIS_SIZE = 64;
const MARKERS = [
  { id: "left", label: "Left eye", emoji: "👁" },
  { id: "right", label: "Right eye", emoji: "👁" },
  { id: "mouth", label: "Mouth", emoji: "👄" },
];

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = src;
  });

// Centre-crop any image/video frame to a square and analyse it.
function processSource(source, sw, sh) {
  const side = Math.min(sw, sh);
  const sx = (sw - side) / 2, sy = (sh - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = PHOTO_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE);
  ctx.drawImage(source, sx, sy, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
  const photo = canvas.toDataURL("image/jpeg", 0.8);

  const small = document.createElement("canvas");
  small.width = small.height = ANALYSIS_SIZE;
  const sctx = small.getContext("2d", { willReadFrequently: true });
  sctx.drawImage(canvas, 0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
  const { data } = sctx.getImageData(0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
  return { photo, analysis: analysePixels(data, ANALYSIS_SIZE, ANALYSIS_SIZE), suggested: suggestFace(data, ANALYSIS_SIZE, ANALYSIS_SIZE) };
}

export default function scan(root, { query }) {
  const { challenge } = todaysChallenge();
  const s = {
    step: "capture",
    photo: null,
    analysis: null,
    face: null,
    suggested: null,
    category: null,
    mood: null,
    place: null,
    placeMode: "none",
    shared: true,
    selected: 0,
    facing: "environment",
  };
  if (query.get("challenge") && challenge.rule.category) s.category = challenge.rule.category;
  let stream = null;

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  async function startCamera() {
    const video = $("video", root);
    const vf = $(".viewfinder", root);
    if (!navigator.mediaDevices?.getUserMedia) {
      vf.classList.add("viewfinder--off");
      return;
    }
    try {
      stopCamera();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: s.facing, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      if (s.step !== "capture") return stopCamera();
      video.srcObject = stream;
      await video.play().catch(() => {});
      vf.classList.add("viewfinder--live");
    } catch {
      vf.classList.add("viewfinder--off");
    }
  }

  async function usePhoto(src, sceneId = null) {
    try {
      $(".viewfinder", root)?.classList.add("viewfinder--snap");
      const img = await loadImage(src);
      const out = processSource(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
      accept(out, sceneId);
    } catch (e) {
      toast(e.message || "That photo didn't work — try another", { emoji: "😬" });
    }
  }

  function accept({ photo, analysis, suggested }, sceneId) {
    stopCamera();
    s.photo = photo;
    s.analysis = analysis;
    const scene = sceneId && SCENES[sceneId];
    s.suggested = scene ? scene.face : suggested;
    s.face = structuredClone(s.suggested);
    s.mood = scene ? scene.mood : suggestMood(analysis);
    if (scene) s.category = scene.category;
    s.step = "spot";
    draw();
  }

  function captureFrame() {
    const video = $("video", root);
    if (!stream || !video.videoWidth) return;
    accept(processSource(video, video.videoWidth, video.videoHeight));
  }

  // ---------- Steps ----------

  function captureView() {
    return `
      <div class="viewfinder">
        <video playsinline muted autoplay></video>
        <div class="viewfinder__fallback">
          <div class="viewfinder__ghost">${icon.camera}</div>
          <p><b>Camera's napping.</b><br>Upload a photo or try a sample below.</p>
        </div>
        <div class="vf-corners"><i></i><i></i><i></i><i></i></div>
        <div class="vf-guide" aria-hidden="true"><i></i><i></i><b></b></div>
        <p class="vf-hint">Look for two eyes and a mouth…</p>
      </div>
      <div class="scan__controls">
        <label class="round-btn" aria-label="Upload a photo">${icon.upload}<input type="file" accept="image/*" id="upload" hidden></label>
        <button class="shutter" id="shutter" aria-label="Take photo"><span></span></button>
        <button class="round-btn" id="flip" aria-label="Switch camera">${icon.switch}</button>
      </div>
      <label class="native-cam">${icon.camera} Open phone camera<input type="file" accept="image/*" capture="environment" id="native" hidden></label>
      <div class="samples">
        <p class="eyebrow">No face nearby? Try a sample</p>
        <div class="samples__row">
          ${SCENE_IDS.map((id) => `<button class="sample" data-scene="${id}" aria-label="${esc(SCENES[id].label)}"><img src="${sceneDataUrl(id, 3)}" alt=""><span>${esc(SCENES[id].label)}</span></button>`).join("")}
        </div>
      </div>`;
  }

  function spotView() {
    return `
      <div class="spot" id="spot">
        <img src="${s.photo}" alt="Your photo" draggable="false">
        <svg class="spot__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path id="spotPath" /></svg>
        ${MARKERS.map((m, i) => `<button class="marker marker--${m.id} ${i === s.selected ? "is-selected" : ""}" data-marker="${i}" aria-label="${m.label}: drag to position">${m.emoji}</button>`).join("")}
      </div>
      <div class="spot__help">
        <p><b>We spotted a face!</b> Drag the markers onto the eyes and mouth — or tap the photo to place the highlighted one.</p>
        <div class="marker-legend">${MARKERS.map((m, i) => `<button class="chip ${i === s.selected ? "chip--on" : ""}" data-pick="${i}">${m.emoji} ${m.label}</button>`).join("")}</div>
      </div>
      <div class="scan__actions">
        <button class="btn btn--ghost" id="redetect">${icon.wand} Re-detect</button>
        <button class="btn btn--primary" id="toDetails">That's the face</button>
      </div>
      <button class="link center" id="retake">Retake photo</button>`;
  }

  function detailsView() {
    const cities = CITIES.map(
      (c) => `<optgroup label="${c.flag} ${c.name}">${NEIGHBOURHOODS.filter((n) => n.city === c.id)
        .map((n) => `<option value="${n.id}" ${s.place?.neighbourhoodId === n.id ? "selected" : ""}>${n.name}</option>`)
        .join("")}</optgroup>`,
    ).join("");
    return `
      <div class="details__photo"><img src="${s.photo}" alt=""><div class="details__face">${faceDots()}</div></div>
      <div class="field">
        <h3>What did you find?</h3>
        <div class="choice-grid">${CATEGORIES.map((c) => `<button class="choice ${s.category === c.id ? "is-on" : ""}" data-category="${c.id}"><span>${c.emoji}</span><b>${c.label}</b><small>${c.hint}</small></button>`).join("")}</div>
      </div>
      <div class="field">
        <h3>What's its mood?</h3>
        <div class="chip-row">${MOODS.map((m) => `<button class="chip chip--lg ${s.mood === m.id ? "chip--on" : ""}" data-mood="${m.id}">${m.emoji} ${m.label}</button>`).join("")}</div>
      </div>
      <div class="challenge-hint" id="challengeHint"></div>
      <div class="field">
        <h3>Where was it?</h3>
        <div class="segmented" role="radiogroup">
          <button data-place="none" class="${s.placeMode === "none" ? "is-on" : ""}">Keep it secret</button>
          <button data-place="near" class="${s.placeMode === "near" ? "is-on" : ""}">${icon.pin} Near me</button>
          <button data-place="pick" class="${s.placeMode === "pick" ? "is-on" : ""}">Pick area</button>
        </div>
        ${s.placeMode === "pick" ? `<select id="hood" class="select"><option value="">Choose a neighbourhood…</option>${cities}</select>` : ""}
        <p class="muted small" id="placeNote">${placeNote()}</p>
      </div>
      <label class="toggle">
        <input type="checkbox" id="shared" ${s.shared ? "checked" : ""}>
        <span class="toggle__track"><i></i></span>
        <span><b>Share with friends & the map</b><small>Map pins only ever show the neighbourhood.</small></span>
      </label>
      <button class="btn btn--primary btn--xl" id="transform" ${s.category && s.mood ? "" : "disabled"}>${icon.sparkle} Transform into a Blockie</button>`;
  }

  function placeNote() {
    if (s.placeMode === "none") return "No location saved.";
    if (s.place?.neighbourhoodId) return `📍 Saved as ${NEIGHBOURHOODS.find((n) => n.id === s.place.neighbourhoodId).name} (approximate).`;
    if (s.place?.label) return `📍 ${s.place.label} — we only keep a rough area.`;
    return s.placeMode === "near" ? "Finding your rough area…" : "Choose the closest neighbourhood.";
  }

  const faceDots = () =>
    MARKERS.map((m) => `<i class="dot dot--${m.id}" style="left:${s.face[m.id].x * 100}%;top:${s.face[m.id].y * 100}%"></i>`).join("");

  function draw() {
    const title = { capture: "Spot a face", spot: "Mark the face", details: "Almost there" }[s.step];
    const stepNo = { capture: 1, spot: 2, details: 3 }[s.step];
    root.innerHTML = `
      <div class="scan scan--${s.step}">
        <header class="scan__top">
          <button class="icon-btn" id="back" aria-label="${s.step === "capture" ? "Close" : "Back"}">${s.step === "capture" ? icon.close : icon.back}</button>
          <div class="scan__title"><b>${title}</b><span class="steps">${[1, 2, 3].map((n) => `<i class="${n <= stepNo ? "on" : ""}"></i>`).join("")}</span></div>
          <span class="pill pill--challenge" title="Today's challenge">${challenge.emoji}</span>
        </header>
        <div class="scan__body">${s.step === "capture" ? captureView() : s.step === "spot" ? spotView() : detailsView()}</div>
      </div>`;
    bind();
  }

  function bind() {
    $("#back", root).onclick = () => {
      if (s.step === "capture") location.hash = "#/home";
      else {
        s.step = s.step === "details" ? "spot" : "capture";
        draw();
      }
    };

    if (s.step === "capture") {
      startCamera();
      $("#shutter", root).onclick = () => (stream ? captureFrame() : $("#upload", root).click());
      $("#flip", root).onclick = () => {
        s.facing = s.facing === "environment" ? "user" : "environment";
        startCamera();
      };
      for (const id of ["#upload", "#native"]) {
        $(id, root).onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) usePhoto(URL.createObjectURL(file));
        };
      }
      for (const btn of $$(".sample", root)) btn.onclick = () => usePhoto(sceneDataUrl(btn.dataset.scene, 3), btn.dataset.scene);
    }

    if (s.step === "spot") bindSpot();

    if (s.step === "details") {
      for (const b of $$("[data-category]", root)) b.onclick = () => ((s.category = b.dataset.category), draw());
      for (const b of $$("[data-mood]", root)) b.onclick = () => ((s.mood = b.dataset.mood), draw());
      for (const b of $$("[data-place]", root)) b.onclick = () => choosePlace(b.dataset.place);
      $("#hood", root)?.addEventListener("change", (e) => {
        s.place = e.target.value ? { neighbourhoodId: e.target.value } : null;
        $("#placeNote", root).textContent = placeNote();
      });
      $("#shared", root).onchange = (e) => (s.shared = e.target.checked);
      $("#transform", root).onclick = transform;
      updateChallengeHint();
    }
  }

  function updateChallengeHint() {
    const el = $("#challengeHint", root);
    if (!el) return;
    const match = s.category && s.mood && wouldMatchChallenge(s.category, s.mood);
    el.className = `challenge-hint ${match ? "challenge-hint--yes" : ""}`;
    el.innerHTML = match
      ? `${icon.check}<span><b>Counts for today's challenge!</b> ${esc(challenge.title)}</span>`
      : `<span>${challenge.emoji}</span><span>Today: ${esc(challenge.title)}</span>`;
  }

  function choosePlace(mode) {
    s.placeMode = mode;
    s.place = null;
    if (mode === "near") {
      if (!navigator.geolocation) {
        toast("Location isn't available here — pick an area instead", { emoji: "📍" });
        s.placeMode = "pick";
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const rough = coarsen({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            const hood = nearestNeighbourhood(rough);
            s.place = hood ? { neighbourhoodId: hood.id } : { label: "Somewhere new" };
            if (s.step === "details") $("#placeNote", root).textContent = placeNote();
          },
          () => {
            toast("Couldn't get your location — pick an area instead", { emoji: "📍" });
            s.placeMode = "pick";
            draw();
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
        );
      }
    }
    draw();
  }

  function bindSpot() {
    const area = $("#spot", root);
    const path = $("#spotPath", root);
    const markers = $$(".marker", root);

    const layout = () => {
      MARKERS.forEach((m, i) => {
        markers[i].style.left = `${s.face[m.id].x * 100}%`;
        markers[i].style.top = `${s.face[m.id].y * 100}%`;
      });
      const { left, right, mouth } = s.face;
      path.setAttribute("d", `M${left.x * 100},${left.y * 100} L${right.x * 100},${right.y * 100} L${mouth.x * 100},${mouth.y * 100}Z`);
    };
    const select = (i) => {
      s.selected = i;
      markers.forEach((m, k) => m.classList.toggle("is-selected", k === i));
      $$("[data-pick]", root).forEach((c, k) => c.classList.toggle("chip--on", k === i));
    };
    const setFrom = (i, e) => {
      const r = area.getBoundingClientRect();
      s.face[MARKERS[i].id] = {
        x: Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width)),
        y: Math.min(0.97, Math.max(0.03, (e.clientY - r.top) / r.height)),
      };
      layout();
    };

    markers.forEach((el, i) => {
      el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        select(i);
        el.setPointerCapture(e.pointerId);
        el.classList.add("is-dragging");
        const move = (ev) => setFrom(i, ev);
        const up = () => {
          el.classList.remove("is-dragging");
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
      });
      // keyboard nudging for accessibility
      el.addEventListener("keydown", (e) => {
        const step = 0.02;
        const p = s.face[MARKERS[i].id];
        const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (!d) return;
        e.preventDefault();
        p.x = Math.min(0.97, Math.max(0.03, p.x + d[0]));
        p.y = Math.min(0.97, Math.max(0.03, p.y + d[1]));
        layout();
      });
    });
    area.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".marker")) return;
      setFrom(s.selected, e);
      select((s.selected + 1) % MARKERS.length);
    });
    for (const chip of $$("[data-pick]", root)) chip.onclick = () => select(+chip.dataset.pick);
    $("#redetect", root).onclick = () => {
      s.face = structuredClone(s.suggested);
      area.classList.remove("spot--scan");
      void area.offsetWidth;
      area.classList.add("spot--scan");
      layout();
    };
    $("#retake", root).onclick = () => {
      s.step = "capture";
      draw();
    };
    $("#toDetails", root).onclick = () => {
      s.step = "details";
      draw();
    };
    area.classList.add("spot--scan");
    layout();
  }

  function transform() {
    if (!s.category || !s.mood) return;
    if (s.placeMode === "pick" && !s.place) {
      toast("Pick a neighbourhood, or keep it secret", { emoji: "📍" });
      return;
    }
    session.pending = {
      request: {
        photo: s.photo,
        analysis: s.analysis,
        face: s.face,
        category: s.category,
        mood: s.mood,
        challengeMatch: wouldMatchChallenge(s.category, s.mood),
      },
      place: s.placeMode === "none" ? null : s.place,
      shared: s.shared,
    };
    location.hash = "#/reveal";
  }

  draw();
  return stopCamera;
}
