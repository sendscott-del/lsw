'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Note } from '@/lib/types'

export function useNotes(userId: string | undefined) {
  const [note, setNote] = useState<Note | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!userId) return

    async function fetchNote() {
      const { data } = await supabase
        .from('lsw_notes')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (data) {
        setNote(data)
      } else {
        // Create initial note
        const { data: newNote } = await supabase
          .from('lsw_notes')
          .insert({ user_id: userId, content: '' })
          .select()
          .single()
        if (newNote) setNote(newNote)
      }
      setLoading(false)
    }

    fetchNote()
  }, [userId])

  const updateContent = useCallback((content: string) => {
    if (!note) return

    setNote(prev => prev ? { ...prev, content } : null)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      setSaving(true)
      await supabase
        .from('lsw_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', note.id)
      setSaving(false)
    }, 2000)
  }, [note])

  return { note, loading, saving, updateContent }
}
