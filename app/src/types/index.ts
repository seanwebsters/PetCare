export type Category =
  | 'career'
  | 'money'
  | 'health'
  | 'life'
  | 'relationships'

export interface CategoryMeta {
  label: string
  color: string
  soft: string
  icon: string
}

export interface Task {
  id: string
  title: string
  minutes: number
  xp: number
  done: boolean
  doneOn?: string
}

export type MilestoneStatus = 'done' | 'active' | 'locked'

export interface Milestone {
  id: string
  title: string
  blurb: string
  tasks: Task[]
}

export interface ContentItem {
  id: string
  kind: 'video' | 'article' | 'challenge' | 'people' | 'template' | 'course'
  title: string
  meta: string
}

export interface Direction {
  id: string
  goal: string
  category: Category
  createdAt: string
  milestones: Milestone[]
  completed: boolean
  completedAt?: string
  content: ContentItem[]
  nextSuggestions: string[]
  numericTarget?: {
    label: string
    unit: string
    current: number
    target: number
  }
}

export interface DayLog {
  date: string
  completed: number
  xp: number
  categories: Partial<Record<Category, number>>
}

export interface AppState {
  onboarded: boolean
  directions: Direction[]
  xp: number
  level: number
  streak: number
  lastCompletionDate: string | null
  missionsCompletedTotal: number
  milestonesCompletedTotal: number
  goalsCompletedTotal: number
  todayDate: string
  todayMissionIds: string[]
  history: DayLog[]
  name: string
}
