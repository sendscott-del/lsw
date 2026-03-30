import { startOfWeek, addDays, addWeeks, format, isSameDay } from 'date-fns'

// Get the Sunday that starts the current period (4-week block)
// Periods are anchored to the first Sunday of the current month
function getMonthFirstSunday(date: Date): Date {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  return startOfWeek(firstOfMonth, { weekStartsOn: 0 })
}

export function getPeriodStart(referenceDate: Date, periodOffset: number): Date {
  const anchor = getMonthFirstSunday(referenceDate)
  return addWeeks(anchor, periodOffset * 4)
}

export function getWeekDates(periodStart: Date, weekIndex: number): Date[] {
  const weekStart = addWeeks(periodStart, weekIndex)
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export function getCurrentPosition(today: Date): { periodStart: Date; weekIndex: number } {
  const periodStart = getMonthFirstSunday(today)
  const diffMs = today.getTime() - periodStart.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weekIndex = Math.min(Math.floor(diffDays / 7), 3)
  return { periodStart, weekIndex }
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatDayHeader(date: Date): { letter: string; number: string } {
  const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  return {
    letter: letters[date.getDay()],
    number: format(date, 'd'),
  }
}

export function formatWeekRange(dates: Date[]): string {
  if (dates.length === 0) return ''
  const start = format(dates[0], 'MMM d')
  const end = format(dates[dates.length - 1], 'MMM d')
  return `${start} - ${end}`
}

export function formatPeriodLabel(periodStart: Date): string {
  return format(periodStart, 'MMMM yyyy')
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}
