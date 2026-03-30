'use client'

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { formatWeekRange, formatPeriodLabel } from '@/lib/dates'

interface WeekNavigationProps {
  weekIndex: number
  periodStart: Date
  weekDates: Date[]
  onPrevWeek: () => void
  onNextWeek: () => void
  onPrevPeriod: () => void
  onNextPeriod: () => void
  onToday: () => void
}

export default function WeekNavigation({
  weekIndex,
  periodStart,
  weekDates,
  onPrevWeek,
  onNextWeek,
  onPrevPeriod,
  onNextPeriod,
  onToday,
}: WeekNavigationProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
      {/* Period row */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onPrevPeriod} className="p-1 text-gray-400 hover:text-gray-600">
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-medium text-gray-500">
          {formatPeriodLabel(periodStart)}
        </span>
        <button onClick={onNextPeriod} className="p-1 text-gray-400 hover:text-gray-600">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevWeek}
          disabled={weekIndex === 0}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center flex-1">
          <div className="text-sm font-semibold text-gray-800">
            Week {weekIndex + 1} of 4
          </div>
          <div className="text-xs text-gray-500">
            {formatWeekRange(weekDates)}
          </div>
        </div>

        <button
          onClick={onNextWeek}
          disabled={weekIndex === 3}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
        >
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
