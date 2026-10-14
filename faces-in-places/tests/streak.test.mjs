import { test } from "node:test";
import assert from "node:assert/strict";
import { streakStatus, completeDay, daysBetween, addDays, nextMilestone, MAX_FREEZES } from "../js/core/streak.js";

const D = "2026-10-14";

test("day maths works across month and year boundaries", () => {
  assert.equal(daysBetween("2026-10-31", "2026-11-01"), 1);
  assert.equal(daysBetween("2025-12-31", "2026-01-01"), 1);
  assert.equal(addDays("2026-02-28", 1), "2026-03-01");
  assert.equal(addDays(D, -14), "2026-09-30");
});

test("first completion starts a streak", () => {
  const { next, events } = completeDay({}, D);
  assert.equal(next.streak, 1);
  assert.equal(next.lastDay, D);
  assert.equal(events.extended, false);
  assert.equal(events.restarted, false);
});

test("consecutive days extend the streak and hit milestones", () => {
  let s = {};
  let events;
  for (let i = 0; i < 3; i++) ({ next: s, events } = completeDay(s, addDays(D, i)));
  assert.equal(s.streak, 3);
  assert.equal(s.best, 3);
  assert.equal(events.extended, true);
  assert.equal(events.milestone, 3);
});

test("completing twice in one day changes nothing", () => {
  const { next } = completeDay({}, D);
  const again = completeDay(next, D);
  assert.equal(again.next.streak, 1);
  assert.equal(again.events.alreadyDone, true);
});

test("status: done today, at risk tomorrow, broken after a missed day", () => {
  const s = { streak: 5, lastDay: D, freezes: 0 };
  assert.equal(streakStatus(s, D).doneToday, true);
  const tomorrow = streakStatus(s, addDays(D, 1));
  assert.equal(tomorrow.atRisk, true);
  assert.equal(tomorrow.streak, 5);
  const broken = streakStatus(s, addDays(D, 2));
  assert.equal(broken.streak, 0);
  assert.equal(broken.lost, 5);
});

test("missing a day without a freeze restarts at 1", () => {
  const { next, events } = completeDay({ streak: 5, best: 5, lastDay: D, freezes: 0 }, addDays(D, 2));
  assert.equal(next.streak, 1);
  assert.equal(next.best, 5);
  assert.equal(events.restarted, true);
  assert.equal(events.lost, 5);
});

test("every 7th day earns a freeze, capped", () => {
  let s = {};
  let earned = 0;
  for (let i = 0; i < 28; i++) {
    const r = completeDay(s, addDays(D, i));
    s = r.next;
    if (r.events.earnedFreeze) earned++;
  }
  assert.equal(s.streak, 28);
  assert.equal(earned, MAX_FREEZES);
  assert.equal(s.freezes, MAX_FREEZES);
});

test("a freeze covers a missed day and is shown on the calendar", () => {
  const start = { streak: 9, best: 9, lastDay: D, freezes: 1, frozenDays: [] };
  const status = streakStatus(start, addDays(D, 2));
  assert.equal(status.alive, true);
  assert.equal(status.freezesNeeded, 1);
  const { next, events } = completeDay(start, addDays(D, 2));
  assert.equal(next.streak, 10);
  assert.equal(next.freezes, 0);
  assert.equal(events.usedFreezes, 1);
  assert.deepEqual(next.frozenDays, [addDays(D, 1)]);
});

test("missing more days than freezes breaks the streak", () => {
  const start = { streak: 9, lastDay: D, freezes: 1 };
  assert.equal(streakStatus(start, addDays(D, 3)).alive, false);
  assert.equal(completeDay(start, addDays(D, 3)).next.streak, 1);
});

test("next milestone", () => {
  assert.equal(nextMilestone(0), 3);
  assert.equal(nextMilestone(3), 7);
  assert.equal(nextMilestone(400), null);
});
