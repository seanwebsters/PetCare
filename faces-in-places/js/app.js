import { $, $$, icon, toast } from "./ui.js";
import { state, onStorageWarning } from "./store.js";
import home from "./screens/home.js";
import scan from "./screens/scan.js";
import reveal from "./screens/reveal.js";
import collection from "./screens/collection.js";
import blockie from "./screens/blockie.js";
import map from "./screens/map.js";
import friends from "./screens/friends.js";
import profile from "./screens/profile.js";
import onboarding from "./screens/onboarding.js";
import { openStreakSheet } from "./screens/streak.js";

const routes = [
  { path: /^\/home$/, screen: home, tab: "home" },
  { path: /^\/scan$/, screen: scan, tab: "scan", immersive: true },
  { path: /^\/reveal$/, screen: reveal, tab: "scan", immersive: true },
  { path: /^\/collection$/, screen: collection, tab: "collection" },
  { path: /^\/blockie\/([\w-]+)$/, screen: blockie, tab: "collection" },
  { path: /^\/map$/, screen: map, tab: "map" },
  { path: /^\/friends$/, screen: friends, tab: "friends" },
  { path: /^\/profile$/, screen: profile, tab: "home" },
];

const view = $("#view");
let cleanup = null;

for (const el of $$("[data-icon]")) el.innerHTML = icon[el.dataset.icon];

export function parseHash() {
  const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
  return { path: path || "/home", query: new URLSearchParams(query) };
}

function render() {
  const { path, query } = parseHash();
  const route = routes.find((r) => r.path.test(path));
  if (!route) {
    location.replace("#/home");
    return;
  }
  cleanup?.();
  cleanup = null;
  for (const el of $$(".sheet-wrap")) el.remove();
  const params = path.match(route.path).slice(1);
  document.body.classList.toggle("immersive", !!route.immersive);
  for (const a of $$("#tabbar a")) a.classList.toggle("active", a.dataset.tab === route.tab);
  view.innerHTML = "";
  view.scrollTop = 0;
  window.scrollTo(0, 0);
  view.classList.remove("view--enter");
  void view.offsetWidth;
  view.classList.add("view--enter");
  cleanup = route.screen(view, { params, query }) || null;
}

// Any element with data-open-streak opens the streak sheet.
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-open-streak]")) openStreakSheet();
});

onStorageWarning((msg) => toast(msg, { emoji: "💾", timeout: 4000 }));
window.addEventListener("hashchange", render);
if (!location.hash) location.replace("#/home");
render();
if (!state.onboarded) onboarding();
