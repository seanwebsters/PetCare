# DIRECTION

A gamified life-direction app. Tell it a goal, get a personalised roadmap with milestones and daily missions, and build momentum with streaks and XP.

This first prototype covers five core screens: **Onboarding → Home → Direction Detail → Today → Progress**, plus a lightweight Explore tab. AI-generated paths are currently mocked — a keyword-matched template engine (`app/src/data/pathTemplates.ts`) turns a typed goal into a believable multi-milestone journey in a couple of seconds, ready to be swapped for a real model later.

## Run it

```bash
cd app
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## What's here

- **Onboarding** — type any goal (or pick a suggestion chip) and watch DIRECTION build a path in seconds.
- **Home** — greeting, streak, XP, your active Directions, and today's cross-goal missions.
- **Direction Detail** — the full milestone roadmap for a goal, with tasks, related content, and a "what's next" prompt once it's complete.
- **Today** — the daily mission loop with a completion celebration.
- **Progress** — streak, XP, milestones/goals reached, category trends, and achievements.
- **Explore** — content surfaced from your active Directions.

State (Directions, XP, streak, history) persists to `localStorage` — there's no backend yet.

---

*Previously this repo held a small "Calmling Care" pet-game stub (`index.html` / `styles.css` / `script.js` at the repo root); that code is preserved in git history.*
