'use client'

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import {
  formatWeekRange,
  formatDayFull,
  formatMonthLabel,
  getMonthForWeek,
  getWeekOfMonth,
} from '@/lib/dates'

export type ViewMode = 'daily' | 'weekly' | 'monthly'

interface ViewNavigationProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  // Daily props
  currentDate?: Date
  // Weekly props
  weekStart?: Date
  weekDates?: Date[]
  // Monthly props
  monthDate?: Date
  // Navigation
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export default function ViewNavigation({
  viewMode,
  onViewModeChange,
  currentDate,
  weekStart,
  weekDates,
  monthDate,
  onPrev,
  onNext,
  onToday,
}: ViewNavigationProps) {
  let label = ''
  let sublabel = ''

  if (viewMode === 'daily' && currentDate) {
    label = formatDayFull(currentDate)
  } else if (viewMode === 'weekly' && weekStart && weekDates) {
    const { month, year } = getMonthForWeek(weekStart)
    const { weekNum, totalWeeks } = getWeekOfMonth(weekStart)
    label = `Week ${weekNum} of ${totalWeeks}`
    sublabel = formatWeekRange(weekDates)
  } else if (viewMode === 'monthly' && monthDate) {
    label = formatMonthLabel(monthDate)
  }

  return (
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
      {/* View mode switcher */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            {mode === 'daily' ? 'Day' : mode === 'weekly' ? 'Week' : 'Month'}
          </button>
        ))}
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="p-1 text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
        </button>

        <div className="text-center flex-1">
          {viewMode === 'weekly' && weekStart && (
            <div className="text-xs text-gray-500 mb-0.5">
              {getMonthForWeek(weekStart).month} {getMonthForWeek(weekStart).year}
            </div>
          )}
          <div className="text-sm font-semibold text-gray-800">{label}</div>
          {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
        </div>

        <button onClick={onNext} className="p-1 text-gray-500 hover:text-gray-700">
          <ChevronRight size={20} />
        </button>

        <button
          onClick={onToday}
          className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          title="Go to today"
        >
          <CalendarDays size={18} />
        </button>
      </div>
    </div>
  )
}
