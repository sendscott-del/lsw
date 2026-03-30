'use client'

import { Pencil, MessageSquare } from 'lucide-react'
import type { Category, Behavior, Entry, CellComment, EntryValue } from '@/lib/types'
import { formatDate, matchesRecurrence } from '@/lib/dates'

interface DailyViewProps {
  date: Date
  categories: Category[]
  behaviorsByCategory: Map<string, Behavior[]>
  entries: Map<string, Entry>
  comments: Map<string, CellComment>
  onCellTap: (behaviorId: string, date: string, currentValue: EntryValue | null) => void
  onCellLongPress: (behaviorId: string, date: string) => void
  onEditBehavior: (behaviorId: string) => void
  onAddBehavior: (categoryId: string) => void
}

function cycleValue(current: EntryValue | null): EntryValue | null {
  if (!current) return 'y'
  if (current === 'y') return 'n'
  return null
}

export default function DailyView({
  date,
  categories,
  behaviorsByCategory,
  entries,
  comments,
  onCellTap,
  onCellLongPress,
  onEditBehavior,
  onAddBehavior,
}: DailyViewProps) {
  const dateStr = formatDate(date)

  return (
    <div className="space-y-3 p-4">
      {categories.map(category => {
        const behaviors = behaviorsByCategory.get(category.id) ?? []
        if (behaviors.length === 0) return null

        return (
          <div key={category.id}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              {category.name}
            </h3>

            <div className="space-y-1.5">
              {behaviors.map(behavior => {
                const isApplicable = matchesRecurrence(
                  date,
                  behavior.frequency,
                  behavior.days_of_week ?? undefined,
                  behavior.monthly_pattern ?? undefined
                )
                const key = `${behavior.id}_${dateStr}`
                const entry = entries.get(key)
                const comment = comments.get(key)
                const value = entry?.value ?? null

                if (!isApplicable) {
                  return (
                    <div key={behavior.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg opacity-40">
                      <div className="w-12 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        —
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 truncate">{behavior.name}</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={behavior.id} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-gray-100">
                    {/* Y/N toggle */}
                    <button
                      onClick={() => onCellTap(behavior.id, dateStr, value)}
                      className={`w-12 h-10 rounded-lg text-sm font-bold shrink-0 transition ${
                        value === 'y' ? 'bg-green-500 text-white' :
                        value === 'n' ? 'bg-red-500 text-white' :
                        'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {value === 'y' ? 'Y' : value === 'n' ? 'N' : '—'}
                    </button>

                    {/* Behavior name + comment preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {behavior.is_new && (
                          <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-medium px-1 rounded">
                            NEW
                          </span>
                        )}
                        <p className="text-sm text-gray-800 truncate">{behavior.name}</p>
                      </div>
                      {comment && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{comment.comment}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => onCellLongPress(behavior.id, dateStr)}
                      className={`p-1.5 shrink-0 ${comment ? 'text-blue-500' : 'text-gray-300'} hover:text-blue-600`}
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() => onEditBehavior(behavior.id)}
                      className="p-1.5 text-gray-300 hover:text-gray-500 shrink-0"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
