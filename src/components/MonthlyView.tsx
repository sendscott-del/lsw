'use client'

import { Pencil } from 'lucide-react'
import type { Category, Behavior, Entry, CellComment, EntryValue } from '@/lib/types'
import { formatDate, matchesRecurrence, isToday as checkIsToday } from '@/lib/dates'

interface MonthlyViewProps {
  monthDates: Date[]
  categories: Category[]
  behaviorsByCategory: Map<string, Behavior[]>
  entries: Map<string, Entry>
  comments: Map<string, CellComment>
  onCellTap: (behaviorId: string, date: string, currentValue: EntryValue | null) => void
  onCellLongPress: (behaviorId: string, date: string) => void
  onEditBehavior: (behaviorId: string) => void
}

export default function MonthlyView({
  monthDates,
  categories,
  behaviorsByCategory,
  entries,
  comments,
  onCellTap,
  onCellLongPress,
  onEditBehavior,
}: MonthlyViewProps) {
  return (
    <div className="space-y-3">
      {categories.map(category => {
        const behaviors = behaviorsByCategory.get(category.id) ?? []
        if (behaviors.length === 0) return null

        return (
          <div key={category.id}>
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
              <span className="text-sm font-semibold text-gray-700">{category.name}</span>
            </div>

            <div className="overflow-x-auto">
              {/* Day number headers */}
              <div className="flex items-stretch">
                <div className="sticky left-0 z-10 bg-white min-w-[120px] max-w-[120px] border-r border-gray-100" />
                <div className="flex items-center gap-px px-0.5 py-1">
                  {monthDates.map(date => {
                    const today = checkIsToday(date)
                    const dayNum = date.getDate()
                    const dayOfWeek = date.getDay()
                    const isSunday = dayOfWeek === 0
                    return (
                      <div
                        key={date.toISOString()}
                        className={`flex flex-col items-center justify-center w-6 min-w-[1.5rem] text-[8px] ${
                          today ? 'text-blue-600 font-bold' : isSunday ? 'text-red-400' : 'text-gray-400'
                        }`}
                      >
                        <span>{['S','M','T','W','T','F','S'][dayOfWeek]}</span>
                        <span>{dayNum}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Behavior rows */}
              {behaviors.map(behavior => (
                <div key={behavior.id} className="flex items-stretch border-b border-gray-50">
                  {/* Sticky behavior name */}
                  <div className="sticky left-0 z-10 bg-white flex items-center min-w-[120px] max-w-[120px] px-2 py-1 border-r border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 truncate" title={behavior.name}>{behavior.name}</p>
                    </div>
                    <button
                      onClick={() => onEditBehavior(behavior.id)}
                      className="p-0.5 text-gray-300 hover:text-gray-500 shrink-0"
                    >
                      <Pencil size={10} />
                    </button>
                  </div>

                  {/* Mini cells */}
                  <div className="flex items-center gap-px px-0.5 py-0.5">
                    {monthDates.map(date => {
                      const dateStr = formatDate(date)
                      const key = `${behavior.id}_${dateStr}`
                      const entry = entries.get(key)
                      const comment = comments.get(key)
                      const value = entry?.value ?? null
                      const isApplicable = matchesRecurrence(
                        date,
                        behavior.frequency,
                        behavior.days_of_week ?? undefined,
                        behavior.monthly_pattern ?? undefined
                      )

                      if (!isApplicable) {
                        return (
                          <div key={dateStr} className="w-6 h-6 min-w-[1.5rem] rounded-sm bg-gray-50/50" />
                        )
                      }

                      const bgColor = value === 'y' ? 'bg-green-500' :
                                      value === 'n' ? 'bg-red-500' :
                                      checkIsToday(date) ? 'bg-blue-100' : 'bg-gray-100'

                      return (
                        <button
                          key={dateStr}
                          onClick={() => {
                            const next = value === null ? 'y' : value === 'y' ? 'n' : null
                            onCellTap(behavior.id, dateStr, value)
                          }}
                          onContextMenu={e => { e.preventDefault(); onCellLongPress(behavior.id, dateStr) }}
                          className={`cell-tap relative w-6 h-6 min-w-[1.5rem] rounded-sm ${bgColor} ${
                            value ? 'opacity-90' : ''
                          }`}
                          title={`${behavior.name} - ${dateStr}${comment ? ': ' + comment.comment : ''}`}
                        >
                          {comment && (
                            <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-blue-500" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
