'use client'

import { useRef, useEffect } from 'react'
import { Calendar, Download } from 'lucide-react'
import { googleCalendarUrl, outlookCalendarUrl, downloadIcs } from '@/lib/calendar'
import type { Frequency } from '@/lib/types'

interface CalendarMenuProps {
  title: string
  date: Date
  frequency: Frequency
  onClose: () => void
}

export default function CalendarMenu({ title, date, frequency, onClose }: CalendarMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const event = { title, date, frequency }

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]">
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Google Calendar
      </a>
      <a
        href={outlookCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Outlook
      </a>
      <button
        onClick={() => { downloadIcs(event); onClose() }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Download size={16} />
        Download .ics
      </button>
    </div>
  )
}
