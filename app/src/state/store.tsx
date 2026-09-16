import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { AppState, Direction } from '../types'
import { activeMilestoneIndex, isDirectionComplete, isMilestoneDone, levelFromXp } from '../lib/xp'
import { daysBetween, todayISO } from '../lib/id'

const STORAGE_KEY = 'direction_app_state_v1'
const MAX_TODAY_MISSIONS = 3

function initialState(): AppState {
  return {
    onboarded: false,
    directions: [],
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletionDate: null,
    missionsCompletedTotal: 0,
    milestonesCompletedTotal: 0,
    goalsCompletedTotal: 0,
    todayDate: todayISO(),
    todayMissionIds: [],
    history: [],
    name: 'there',
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw) as AppState
    return { ...initialState(), ...parsed }
  } catch {
    return initialState()
  }
}

function pickTodayMissionIds(directions: Direction[]): string[] {
  const active = directions.filter((d) => !isDirectionComplete(d))
  const picks: string[] = []

  for (const d of active) {
    const idx = activeMilestoneIndex(d)
    const milestone = d.milestones[idx]
    const task = milestone?.tasks.find((t) => !t.done)
    if (task) picks.push(task.id)
    if (picks.length >= MAX_TODAY_MISSIONS) break
  }

  if (picks.length < MAX_TODAY_MISSIONS) {
    for (const d of active) {
      const idx = activeMilestoneIndex(d)
      const milestone = d.milestones[idx]
      for (const task of milestone?.tasks ?? []) {
        if (!task.done && !picks.includes(task.id)) {
          picks.push(task.id)
        }
        if (picks.length >= MAX_TODAY_MISSIONS) break
      }
      if (picks.length >= MAX_TODAY_MISSIONS) break
    }
  }

  return picks.slice(0, MAX_TODAY_MISSIONS)
}

function rollTodayIfNeeded(state: AppState): AppState {
  const today = todayISO()
  if (state.todayDate === today && state.todayMissionIds.length > 0) return state
  if (state.todayDate === today && state.directions.length === 0) return state
  return {
    ...state,
    todayDate: today,
    todayMissionIds: pickTodayMissionIds(state.directions),
  }
}

type Action =
  | { type: 'ADD_DIRECTION'; direction: Direction }
  | { type: 'COMPLETE_TASK'; directionId: string; taskId: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'REFRESH_TODAY' }
  | { type: 'RESET' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_DIRECTION': {
      const directions = [...state.directions, action.direction]
      const next: AppState = { ...state, directions, onboarded: true }
      if (next.todayMissionIds.length < MAX_TODAY_MISSIONS) {
        const idx = activeMilestoneIndex(action.direction)
        const task = action.direction.milestones[idx]?.tasks.find((t) => !t.done)
        if (task) {
          next.todayMissionIds = [...next.todayMissionIds, task.id].slice(0, MAX_TODAY_MISSIONS)
        }
      }
      return next
    }

    case 'COMPLETE_TASK': {
      const today = todayISO()
      let earnedXp = 0
      let completedMilestone = false
      let completedGoal = false
      let category: Direction['category'] | null = null

      const directions = state.directions.map((d) => {
        if (d.id !== action.directionId) return d
        category = d.category
        const milestones = d.milestones.map((m) => {
          const hasTask = m.tasks.some((t) => t.id === action.taskId)
          if (!hasTask) return m
          const wasDone = isMilestoneDone(m)
          const tasks = m.tasks.map((t) => {
            if (t.id !== action.taskId || t.done) return t
            earnedXp = t.xp
            return { ...t, done: true, doneOn: today }
          })
          const nowDone = isMilestoneDone({ ...m, tasks })
          if (!wasDone && nowDone) completedMilestone = true
          return { ...m, tasks }
        })
        const wasComplete = d.completed
        const nowComplete = isDirectionComplete({ ...d, milestones })
        if (!wasComplete && nowComplete) completedGoal = true
        return { ...d, milestones, completed: nowComplete, completedAt: nowComplete ? new Date().toISOString() : d.completedAt }
      })

      if (earnedXp === 0) {
        return { ...state, directions }
      }

      let streak = state.streak
      if (state.lastCompletionDate === today) {
        // already counted today
      } else if (state.lastCompletionDate && daysBetween(state.lastCompletionDate, today) === 1) {
        streak += 1
      } else {
        streak = 1
      }

      const history = [...state.history]
      const entryIdx = history.findIndex((h) => h.date === today)
      if (entryIdx === -1) {
        history.push({ date: today, completed: 1, xp: earnedXp, categories: category ? { [category]: 1 } : {} })
      } else {
        const entry = { ...history[entryIdx] }
        entry.completed += 1
        entry.xp += earnedXp
        if (category) {
          entry.categories = { ...entry.categories, [category]: (entry.categories[category] ?? 0) + 1 }
        }
        history[entryIdx] = entry
      }

      const xp = state.xp + earnedXp

      return {
        ...state,
        directions,
        xp,
        level: levelFromXp(xp),
        streak,
        lastCompletionDate: today,
        missionsCompletedTotal: state.missionsCompletedTotal + 1,
        milestonesCompletedTotal: state.milestonesCompletedTotal + (completedMilestone ? 1 : 0),
        goalsCompletedTotal: state.goalsCompletedTotal + (completedGoal ? 1 : 0),
        history,
      }
    }

    case 'SET_NAME':
      return { ...state, name: action.name || 'there' }

    case 'REFRESH_TODAY':
      return {
        ...state,
        todayDate: todayISO(),
        todayMissionIds: pickTodayMissionIds(state.directions),
      }

    case 'RESET':
      return initialState()

    default:
      return state
  }
}

interface StoreValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => rollTodayIfNeeded(load()))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
