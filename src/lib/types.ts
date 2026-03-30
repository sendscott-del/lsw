export type EntryValue = 'y' | 'n' | 'k'
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export interface Category {
  id: string
  user_id: string
  name: string
  sort_order: number
}

export interface Behavior {
  id: string
  user_id: string
  category_id: string
  name: string
  frequency: Frequency
  is_new: boolean
  is_archived: boolean
  sort_order: number
}

export interface Entry {
  id: string
  behavior_id: string
  entry_date: string // YYYY-MM-DD
  value: EntryValue
}

export interface CellComment {
  id: string
  behavior_id: string
  entry_date: string // YYYY-MM-DD
  comment: string
}

export interface Note {
  id: string
  user_id: string
  content: string
  updated_at: string
}
