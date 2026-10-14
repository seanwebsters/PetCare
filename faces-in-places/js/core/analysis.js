// Lightweight on-device "vision": summarises a photo's pixels into the
// features the character generator uses. Pure functions (no DOM) so they can
// run in Node tests and be swapped for a real vision API later.

import { rgbToHsl, toHex, hsl } from "./color.js";

const HUE_BUCKETS = 12;

export function analysePixels(data, width, height) {
  const count = width * height;
  let r = 0, g = 0, b = 0, satSum = 0, lumaSum = 0, lumaSq = 0;
  const buckets = Array.from({ length: HUE_BUCKETS }, () => ({ w: 0, r: 0, g: 0, b: 0 }));
  const luma = new Float32Array(count);
  let hash = 0x811c9dc5;

  for (let i = 0; i < count; i++) {
    const pr = data[i * 4], pg = data[i * 4 + 1], pb = data[i * 4 + 2];
    r += pr; g += pg; b += pb;
    const [h, s, l] = rgbToHsl(pr, pg, pb);
    satSum += s;
    const y = 0.299 * pr + 0.587 * pg + 0.114 * pb;
    luma[i] = y;
    lumaSum += y;
    lumaSq += y * y;
    // Only reasonably saturated, mid-light pixels vote for a hue, and pixels
    // near the centre (where the object usually is) count far more than the background.
    const dx = (i % width) / width - 0.5, dy = Math.floor(i / width) / height - 0.5;
    const centre = Math.exp(-(dx * dx + dy * dy) / 0.045);
    const weight = s * (1 - Math.abs(l - 0.5) * 1.6) * centre;
    if (weight > 0.03) {
      const bucket = buckets[Math.floor(h / (360 / HUE_BUCKETS)) % HUE_BUCKETS];
      bucket.w += weight; bucket.r += pr * weight; bucket.g += pg * weight; bucket.b += pb * weight;
    }
    if (i % 3 === 0) {
      hash ^= (pr >> 4) | ((pg >> 4) << 4) | ((pb >> 4) << 8);
      hash = Math.imul(hash, 0x01000193);
    }
  }

  let edgeSum = 0;
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const i = y * width + x;
      edgeSum += Math.abs(luma[i] - luma[i + 1]) + Math.abs(luma[i] - luma[i + width]);
    }
  }

  const mean = lumaSum / count;
  const totalWeight = buckets.reduce((sum, bk) => sum + bk.w, 0) || 1;
  const ranked = buckets
    .map((bk, i) => ({ ...bk, i, share: bk.w / totalWeight }))
    .filter((bk) => bk.w > 0)
    .sort((a, b) => b.w - a.w);

  const avg = [r / count, g / count, b / count];
  const palette = ranked.slice(0, 3).map((bk) => toHex([bk.r / bk.w, bk.g / bk.w, bk.b / bk.w]));
  if (!palette.length) palette.push(toHex(avg));

  return {
    avg: toHex(avg),
    palette,
    brightness: mean / 255,
    contrast: Math.sqrt(Math.max(0, lumaSq / count - mean * mean)) / 128,
    saturation: satSum / count,
    edges: edgeSum / ((width - 1) * (height - 1) * 2 * 255),
    colourfulness: ranked.filter((bk) => bk.share > 0.08).length,
    hash: hash >>> 0,
  };
}

// Guess a face: the two darkest cells in the upper half that sit side by side
// become eyes, the darkest cell below them becomes the mouth.
export function suggestFace(data, width, height) {
  const grid = 8;
  const cw = width / grid, ch = height / grid;
  const cells = [];
  for (let gy = 0; gy < grid; gy++) {
    for (let gx = 0; gx < grid; gx++) {
      let sum = 0, n = 0;
      for (let y = Math.floor(gy * ch); y < Math.floor((gy + 1) * ch); y++) {
        for (let x = Math.floor(gx * cw); x < Math.floor((gx + 1) * cw); x++) {
          const i = (y * width + x) * 4;
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          n++;
        }
      }
      cells.push({ gx, gy, v: n ? sum / n : 255 });
    }
  }
  const at = (gx, gy) => cells[gy * grid + gx].v;
  const centre = (gx, gy) => ({ x: (gx + 0.5) / grid, y: (gy + 0.5) / grid });

  let best = null;
  for (let gy = 1; gy < grid - 3; gy++) {
    for (let lx = 0; lx < grid / 2; lx++) {
      for (let gap = 2; gap <= 4; gap++) {
        const rx = lx + gap;
        if (rx >= grid) continue;
        const between = at(Math.floor((lx + rx) / 2), gy);
        // dark eyes, brighter "bridge" between them, and roughly centred
        const offCentre = Math.abs((lx + rx) / 2 - (grid - 1) / 2);
        const score = between - (at(lx, gy) + at(rx, gy)) / 2 - offCentre * 6;
        if (!best || score > best.score) best = { score, lx, rx, gy };
      }
    }
  }
  if (!best) return defaultFace();

  const mx = Math.round((best.lx + best.rx) / 2);
  let mouth = null;
  for (let gy = best.gy + 2; gy < grid; gy++) {
    for (let gx = Math.max(0, mx - 1); gx <= Math.min(grid - 1, mx + 1); gx++) {
      if (!mouth || at(gx, gy) < mouth.v) mouth = { gx, gy, v: at(gx, gy) };
    }
  }
  return {
    left: centre(best.lx, best.gy),
    right: centre(best.rx, best.gy),
    mouth: mouth ? centre(mouth.gx, mouth.gy) : { x: (best.lx + best.rx + 1) / 2 / grid, y: 0.75 },
  };
}

export const defaultFace = () => ({
  left: { x: 0.36, y: 0.4 },
  right: { x: 0.64, y: 0.4 },
  mouth: { x: 0.5, y: 0.68 },
});

export function suggestMood(analysis) {
  if (analysis.brightness < 0.3) return "sleepy";
  if (analysis.contrast > 0.62) return "surprised";
  if (analysis.saturation > 0.45 && analysis.brightness > 0.5) return "happy";
  if (analysis.saturation < 0.12) return "worried";
  return analysis.hash % 2 ? "cheeky" : "happy";
}

// For seed data and tests: a plausible analysis derived from a few numbers.
export function syntheticAnalysis({ hue, sat = 0.5, light = 0.55, contrast = 0.4, edges = 0.08, colourfulness = 2, hash }) {
  return {
    avg: hsl(hue, sat * 0.7, light),
    palette: [hsl(hue, sat, light), hsl(hue + 40, sat, light - 0.1), hsl(hue + 180, sat * 0.8, light)],
    brightness: light,
    contrast,
    saturation: sat,
    edges,
    colourfulness,
    hash: hash >>> 0,
  };
}
