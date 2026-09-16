import type { Category, CategoryMeta } from '../types'

export const CATEGORIES: Record<Category, CategoryMeta> = {
  career: { label: 'Career', color: 'var(--color-career)', soft: 'var(--color-career-soft)', icon: 'briefcase' },
  money: { label: 'Money', color: 'var(--color-money)', soft: 'var(--color-money-soft)', icon: 'coin' },
  health: { label: 'Health', color: 'var(--color-health)', soft: 'var(--color-health-soft)', icon: 'heart' },
  life: { label: 'Life', color: 'var(--color-life)', soft: 'var(--color-life-soft)', icon: 'plane' },
  relationships: { label: 'Relationships', color: 'var(--color-relationships)', soft: 'var(--color-relationships-soft)', icon: 'people' },
}

export const CATEGORY_ORDER: Category[] = ['career', 'money', 'health', 'life', 'relationships']
