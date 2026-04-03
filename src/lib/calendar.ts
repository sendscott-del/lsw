import { format, addHours } from 'date-fns'

interface CalendarEvent {
  title: string
  date: Date // The period date (start of week, month, or quarter)
  frequency: 'weekly' | 'monthly' | 'quarterly'
}

function eventTimes(event: CalendarEvent): { start: Date; end: Date } {
  // Default to a 1-hour event at 9 AM on the given date
  const start = new Date(event.date)
  start.setHours(9, 0, 0, 0)
  const end = addHours(start, 1)
  return { start, end }
}

function toGoogleDatetime(d: Date): string {
  return format(d, "yyyyMMdd'T'HHmmss")
}

function toOutlookDatetime(d: Date): string {
  return format(d, "yyyy-MM-dd'T'HH:mm:ss")
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = eventTimes(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGoogleDatetime(start)}/${toGoogleDatetime(end)}`,
  })
  return `https://calendar.google.com/calendar/event?${params.toString()}`
}

export function outlookCalendarUrl(event: CalendarEvent): string {
  const { start, end } = eventTimes(event)
  const params = new URLSearchParams({
    subject: event.title,
    startdt: toOutlookDatetime(start),
    enddt: toOutlookDatetime(end),
    path: '/calendar/action/compose',
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
}

export function downloadIcs(event: CalendarEvent): void {
  const { start, end } = eventTimes(event)
  const uid = `${Date.now()}@steward`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Steward//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${toGoogleDatetime(start)}`,
    `DTEND:${toGoogleDatetime(end)}`,
    `SUMMARY:${event.title}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-zA-Z0-9 ]/g, '')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
