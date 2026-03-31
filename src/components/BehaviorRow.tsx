'use client'

import { useMemo } from 'react'
import DayCell from './DayCell'
import FrequencyDisplay from './FrequencyDisplay'
import { Pencil, ChevronUp, ChevronDown } from 'lucide-react'
import type { Behavior, Entry, CellComment, EntryValue } from '@/lib/types'
import { formatDate, isToday as checkIsToday, getNextOccurrences, formatOccurrenceHeader } from '@/lib/dates'

interface BehaviorRowProps {
  behavior: Behavior
  entries: Map<string, Entry>
  comments: Map<string, CellComment>
  compliancePercent: number | null
  onCellTap: (behaviorId: string, date: string, currentValue: EntryValue | null) => void
  onCellLongPress: (behaviorId: string, date: string) => void
  onEditBehavior: (behaviorId: string) => void
  reorderMode: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

function cycleValue(current: EntryValue | null): EntryValue | null {
  if (!current) return 'y'
  if (current === 'y') return 'n'
  return null
}

export default function BehaviorRow({
  behavior, entries, comments, compliancePercent,
  onCellTap, onCellLongPress, onEditBehavior,
  reorderMode, onMoveUp, onMoveDown, isFirst, isLast,
}: BehaviorRowProps) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const occurrences = useMemo(() =>
    getNextOccurrences(
      today, 4,
      behavior.repeat_unit ?? 'day', behavior.repeat_interval ?? 1,
      behavior.days_of_week, behavior.monthly_pattern
    ),
    [today, behavior]
  )

  const pct = compliancePercent != null ? Math.round(compliancePercent) : null
  const pctColor = pct == null ? 'text-gray-300' : pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="flex items-stretch border-b border-gray-100">
      {/* Col 1: Edit or Reorder */}
      <div className="sticky left-0 z-10 bg-white flex flex-col items-center justify-center w-9 min-w-[2.25rem] border-r border-gray-100 py-1">
        {reorderMode ? (
          <>
            <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-20">
              <ChevronUp size={14} />
            </button>
            <button onClick={onMoveDown} disabled={isLast} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-20">
              <ChevronDown size={14} />
            </button>
          </>
        ) : (
          <button onClick={() => onEditBehavior(behavior.id)} className="p-0.5 text-gray-300 hover:text-blue-500">
            <Pencil size={12} />
          </button>
        )}
      </div>

      {/* Col 2: Task description (wrapping) */}
      <div className="sticky left-9 z-10 bg-white flex items-center min-w-[100px] max-w-[100px] px-2 py-1.5 border-r border-gray-100">
        <div className="min-w-0">
          <p className="text-xs leading-tight text-gray-800 break-words">
            {behavior.is_new && (
              <span className="inline-block bg-blue-100 text-blue-700 text-[8px] font-medium px-0.5 rounded mr-0.5">NEW</span>
            )}
            {behavior.name}
          </p>
        </div>
      </div>

      {/* Col 3: Frequency */}
      <div className="sticky left-[136px] z-10 bg-white flex items-center w-24 min-w-[6rem] px-1.5 py-1 border-r border-gray-100">
        <FrequencyDisplay
          repeatInterval={behavior.repeat_interval ?? 1}
          repeatUnit={behavior.repeat_unit ?? 'day'}
          daysOfWeek={behavior.days_of_week}
          monthlyPattern={behavior.monthly_pattern}
        />
      </div>

      {/* Col 4: 4-week compliance % */}
      <div className="sticky left-[232px] z-10 bg-white flex items-center justify-center w-10 min-w-[2.5rem] border-r border-gray-100">
        <span className={`text-[10px] font-bold ${pctColor}`}>
          {pct != null ? `${pct}%` : '—'}
        </span>
      </div>

      {/* Col 5: Next 4 occurrence cells with individual headers */}
      <div className="flex items-stretch">
        {occurrences.map(date => {
          const dateStr = formatDate(date)
          const key = `${behavior.id}_${dateStr}`
          const entry = entries.get(key)
          const comment = comments.get(key)
          const { dayLetter, dateLabel } = formatOccurrenceHeader(date)

          return (
            <div key={dateStr} className="flex flex-col items-center px-0.5 py-1">
              <span className={`text-[8px] font-bold leading-none ${checkIsToday(date) ? 'text-blue-600' : 'text-gray-400'}`}>
                {dayLetter}
              </span>
              <span className={`text-[7px] leading-none mb-0.5 ${checkIsToday(date) ? 'text-blue-600' : 'text-gray-400'}`}>
                {dateLabel}
              </span>
              <DayCell
                value={entry?.value ?? null}
                hasComment={!!comment}
                isToday={checkIsToday(date)}
                isApplicable={true}
                onTap={() => onCellTap(behavior.id, dateStr, entry?.value ?? null)}
                onLongPress={() => onCellLongPress(behavior.id, dateStr)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { cycleValue }
