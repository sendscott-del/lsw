'use client'

import { useNotes } from '@/lib/hooks/useNotes'

interface NotesTabProps {
  userId: string
}

export default function NotesTab({ userId }: NotesTabProps) {
  const { note, loading, saving, updateContent } = useNotes(userId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Loading notes...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Notes</h2>
        <span className="text-xs text-gray-400">
          {saving ? 'Saving...' : 'Saved'}
        </span>
      </div>
      <textarea
        value={note?.content ?? ''}
        onChange={e => updateContent(e.target.value)}
        className="flex-1 w-full min-h-[60vh] p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Strategy, agenda, reflections, action items..."
      />
    </div>
  )
}
