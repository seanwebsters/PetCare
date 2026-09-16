import type { Direction, Milestone, Task } from '../types'

export interface TaskContext {
  task: Task
  milestone: Milestone
  direction: Direction
}

export function findTaskContext(directions: Direction[], taskId: string): TaskContext | null {
  for (const direction of directions) {
    for (const milestone of direction.milestones) {
      const task = milestone.tasks.find((t) => t.id === taskId)
      if (task) return { task, milestone, direction }
    }
  }
  return null
}
