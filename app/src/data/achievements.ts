import type { AppState } from '../types'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  isUnlocked: (s: AppState) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first mission',
    icon: '✨',
    isUnlocked: (s) => s.missionsCompletedTotal >= 1,
  },
  {
    id: 'first-direction',
    title: 'New Direction',
    description: 'Start your first Direction',
    icon: '🧭',
    isUnlocked: (s) => s.directions.length >= 1,
  },
  {
    id: 'three-streak',
    title: 'Building Momentum',
    description: 'Reach a 3-day streak',
    icon: '🔥',
    isUnlocked: (s) => s.streak >= 3,
  },
  {
    id: 'week-streak',
    title: 'One Week Strong',
    description: 'Reach a 7-day streak',
    icon: '💪',
    isUnlocked: (s) => s.streak >= 7,
  },
  {
    id: 'milestone-one',
    title: 'First Milestone',
    description: 'Complete a milestone in any Direction',
    icon: '🏁',
    isUnlocked: (s) => s.milestonesCompletedTotal >= 1,
  },
  {
    id: 'ten-missions',
    title: 'In Motion',
    description: 'Complete 10 missions',
    icon: '⚡',
    isUnlocked: (s) => s.missionsCompletedTotal >= 10,
  },
  {
    id: 'multi-direction',
    title: 'Full Spectrum',
    description: 'Have 3 active Directions at once',
    icon: '🌈',
    isUnlocked: (s) => s.directions.filter((d) => !d.completed).length >= 3,
  },
  {
    id: 'goal-complete',
    title: 'Direction Achieved',
    description: 'Complete a full Direction',
    icon: '🏆',
    isUnlocked: (s) => s.goalsCompletedTotal >= 1,
  },
]
