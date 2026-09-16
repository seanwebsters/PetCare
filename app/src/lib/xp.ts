import type { Direction, Milestone } from '../types'

const XP_PER_LEVEL = 150

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpIntoLevel(xp: number): { current: number; needed: number; pct: number } {
  const current = xp % XP_PER_LEVEL
  return { current, needed: XP_PER_LEVEL, pct: Math.round((current / XP_PER_LEVEL) * 100) }
}

export function milestoneProgress(m: Milestone): number {
  if (m.tasks.length === 0) return 0
  const done = m.tasks.filter((t) => t.done).length
  return Math.round((done / m.tasks.length) * 100)
}

export function isMilestoneDone(m: Milestone): boolean {
  return m.tasks.length > 0 && m.tasks.every((t) => t.done)
}

export function directionProgress(d: Direction): number {
  const total = d.milestones.reduce((n, m) => n + m.tasks.length, 0)
  if (total === 0) return 0
  const done = d.milestones.reduce((n, m) => n + m.tasks.filter((t) => t.done).length, 0)
  return Math.round((done / total) * 100)
}

export function activeMilestoneIndex(d: Direction): number {
  const idx = d.milestones.findIndex((m) => !isMilestoneDone(m))
  return idx === -1 ? d.milestones.length - 1 : idx
}

export function isDirectionComplete(d: Direction): boolean {
  return d.milestones.length > 0 && d.milestones.every(isMilestoneDone)
}
