'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/dates'
import type { Category, Behavior, Entry, CellComment, EntryValue } from '@/lib/types'

interface LswData {
  categories: Category[]
  behaviors: Behavior[]
  entries: Map<string, Entry> // key: `${behaviorId}_${date}`
  comments: Map<string, CellComment> // key: `${behaviorId}_${date}`
  loading: boolean
  refresh: () => Promise<void>
  upsertEntry: (behaviorId: string, date: string, value: EntryValue | null) => Promise<void>
  upsertComment: (behaviorId: string, date: string, comment: string) => Promise<void>
}

function entryKey(behaviorId: string, date: string): string {
  return `${behaviorId}_${date}`
}

export function useLswData(userId: string | undefined, weekDates: Date[]): LswData {
  const [categories, setCategories] = useState<Category[]>([])
  const [behaviors, setBehaviors] = useState<Behavior[]>([])
  const [entries, setEntries] = useState<Map<string, Entry>>(new Map())
  const [comments, setComments] = useState<Map<string, CellComment>>(new Map())
  const [loading, setLoading] = useState(true)

  const dateStrings = weekDates.map(formatDate)
  const dateKey = dateStrings.join(',')

  const fetchData = useCallback(async () => {
    if (!userId || weekDates.length === 0) return
    setLoading(true)

    const [catRes, behRes, entRes, comRes] = await Promise.all([
      supabase
        .from('lsw_categories')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order'),
      supabase
        .from('lsw_behaviors')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('sort_order'),
      supabase
        .from('lsw_entries')
        .select('*')
        .eq('user_id', userId)
        .in('entry_date', dateStrings),
      supabase
        .from('lsw_cell_comments')
        .select('*')
        .eq('user_id', userId)
        .in('entry_date', dateStrings),
    ])

    setCategories(catRes.data ?? [])
    setBehaviors(behRes.data ?? [])

    const entryMap = new Map<string, Entry>()
    for (const e of entRes.data ?? []) {
      entryMap.set(entryKey(e.behavior_id, e.entry_date), e)
    }
    setEntries(entryMap)

    const commentMap = new Map<string, CellComment>()
    for (const c of comRes.data ?? []) {
      commentMap.set(entryKey(c.behavior_id, c.entry_date), c)
    }
    setComments(commentMap)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, dateKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const upsertEntry = useCallback(async (behaviorId: string, date: string, value: EntryValue | null) => {
    if (!userId) return
    const key = entryKey(behaviorId, date)

    if (value === null) {
      // Delete entry
      setEntries(prev => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
      await supabase
        .from('lsw_entries')
        .delete()
        .eq('behavior_id', behaviorId)
        .eq('entry_date', date)
        .eq('user_id', userId)
    } else {
      // Upsert entry
      const optimistic: Entry = { id: key, behavior_id: behaviorId, entry_date: date, value }
      setEntries(prev => new Map(prev).set(key, optimistic))
      await supabase
        .from('lsw_entries')
        .upsert(
          { user_id: userId, behavior_id: behaviorId, entry_date: date, value, updated_at: new Date().toISOString() },
          { onConflict: 'behavior_id,entry_date' }
        )
    }
  }, [userId])

  const upsertComment = useCallback(async (behaviorId: string, date: string, comment: string) => {
    if (!userId) return
    const key = entryKey(behaviorId, date)

    if (comment.trim() === '') {
      setComments(prev => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
      await supabase
        .from('lsw_cell_comments')
        .delete()
        .eq('behavior_id', behaviorId)
        .eq('entry_date', date)
        .eq('user_id', userId)
    } else {
      const optimistic: CellComment = { id: key, behavior_id: behaviorId, entry_date: date, comment }
      setComments(prev => new Map(prev).set(key, optimistic))
      await supabase
        .from('lsw_cell_comments')
        .upsert(
          { user_id: userId, behavior_id: behaviorId, entry_date: date, comment, updated_at: new Date().toISOString() },
          { onConflict: 'behavior_id,entry_date' }
        )
    }
  }, [userId])

  return { categories, behaviors, entries, comments, loading, refresh: fetchData, upsertEntry, upsertComment }
}
