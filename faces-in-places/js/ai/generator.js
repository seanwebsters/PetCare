// Character generation service.
//
// The app only talks to `generator.transform(request)`. Today that is the
// MockGenerator, which builds a procedural SVG Blockie on-device. To plug in a
// real image model, set window.FIP_CONFIG = { generator: "http", endpoint: "..." }
// (see README) — the HttpGenerator posts the photo + face marks and expects an
// image URL back. Rarity, naming and IDs stay rule-based on our side so the game
// remains fair regardless of which model draws the art.
//
// TransformRequest  { photo: dataURL, analysis, face, category, mood, challengeMatch }
// TransformResult   { ...composeBlockie(), art: { kind: "procedural" } | { kind: "image", url } }

import { composeBlockie } from "../core/factory.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockGenerator {
  name = "On-device mock";

  async transform(request, onStage = () => {}) {
    const stages = ["Finding the face…", "Reading its mood…", "Sculpting your Blockie…", "Adding personality…"];
    for (const stage of stages) {
      onStage(stage);
      await wait(650);
    }
    return { ...composeBlockie(request), art: { kind: "procedural" } };
  }
}

export class HttpGenerator {
  name = "Remote image model";

  constructor({ endpoint, apiKey }) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async transform(request, onStage = () => {}) {
    const base = composeBlockie(request);
    onStage("Sending to the Blockie studio…");
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}) },
      body: JSON.stringify({
        photo: request.photo,
        face: request.face,
        category: request.category,
        mood: request.mood,
        palette: base.traits.colors,
        style: "rounded collectible vinyl toy, ink outline, big friendly eyes, keeps the object's recognisable shape and colours",
      }),
    });
    if (!res.ok) throw new Error(`Generator responded ${res.status}`);
    onStage("Adding personality…");
    const data = await res.json();
    return {
      ...base,
      name: data.name || base.name,
      personality: data.personality || base.personality,
      art: data.imageUrl ? { kind: "image", url: data.imageUrl } : { kind: "procedural" },
    };
  }
}

export function createGenerator(config = globalThis.FIP_CONFIG || {}) {
  if (config.generator === "http" && config.endpoint) return new HttpGenerator(config);
  return new MockGenerator();
}
