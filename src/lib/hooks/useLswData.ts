'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, getNextOccurrences, prevWeek, getWeekStart, getWeekDates, matchesRecurrence } from '@/lib/dates'
import type { Category, Behavior, Entry, CellComment, EntryValue } from '@/lib/types'

interface LswData {
  categories: Category[]
  behaviors: Behavior[]
  archivedBehaviors: Behavior[]
  entries: Map<string, Entry>
  comments: Map<string, CellComment>
  complianceMap: Map<string, number | null>
  loading: boolean
  refresh: () => Promise<void>
  upsertEntry: (behaviorId: string, date: string, value: EntryValue | null) => Promise<void>
  upsertComment: (behaviorId: string, date: string, comment: string) => Promise<void>
}

function entryKey(behaviorId: string, date: string): string {
  return `${behaviorId}_${date}`
}

export function useLswData(userId: string | undefined): LswData {
  const [categories, setCategories] = useState<Category[]>([])
  const [behaviors, setBehaviors] = useState<Behavior[]>([])
  const [archivedBehaviors, setArchivedBehaviors] = useState<Behavior[]>([])
  const [entries, setEntries] = useState<Map<string, Entry>>(new Map())
  const [comments, setComments] = useState<Map<string, CellComment>>(new Map())
  const [complianceMap, setComplianceMap] = useState<Map<string, number | null>>(new Map())
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    // Fetch categories and behaviors first
    const [catRes, activeBehRes, archivedBehRes] = await Promise.all([
      supabase.from('lsw_categories').select('*').eq('user_id', userId).order('sort_order'),
      supabase.from('lsw_behaviors').select('*').eq('user_id', userId).eq('is_archived', false).order('sort_order'),
      supabase.from('lsw_behaviors').select('*').eq('user_id', userId).eq('is_archived', true).order('sort_order'),
    ])

    const cats = (catRes.data ?? []) as Category[]
    const activeBehaviors = (activeBehRes.data ?? []) as Behavior[]
    const archived = (archivedBehRes.data ?? []) as Behavior[]

    setCategories(cats)
    setBehaviors(activeBehaviors)
    setArchivedBehaviors(archived)

    // Collect all dates we need: next 4 occurrences per behavior + 4 weeks back for compliance
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const allDatesSet = new Set<string>()

    // Next 4 occurrences per behavior
    for (const beh of activeBehaviors) {
      const occ = getNextOccurrences(
        today, 4,
        beh.repeat_unit ?? 'day', beh.repeat_interval ?? 1,
        beh.days_of_week, beh.monthly_pattern
      )
      for (const d of occ) allDatesSet.add(formatDate(d))
    }

    // 4 weeks back for compliance
    let ws = getWeekStart(today)
    for (let i = 0; i < 4; i++) {
      const weekDates = getWeekDates(ws)
      for (const d of weekDates) allDatesSet.add(formatDate(d))
      ws = prevWeek(ws)
    }

    const allDateStrings = [...allDatesSet]

    // Fetch entries and comments for all needed dates
    const [entRes, comRes] = await Promise.all([
      allDateStrings.length > 0
        ? supabase.from('lsw_entries').select('*').eq('user_id', userId).in('entry_date', allDateStrings)
        : Promise.resolve({ data: [] }),
      allDateStrings.length > 0
        ? supabase.from('lsw_cell_comments').select('*').eq('user_id', userId).in('entry_date', allDateStrings)
        : Promise.resolve({ data: [] }),
    ])

    const entryMap = new Map<string, Entry>()
    for (const e of (entRes.data ?? []) as Entry[]) entryMap.set(entryKey(e.behavior_id, e.entry_date), e)
    setEntries(entryMap)

    const commentMap = new Map<string, CellComment>()
    for (const c of (comRes.data ?? []) as CellComment[]) commentMap.set(entryKey(c.behavior_id, c.entry_date), c)
    setComments(commentMap)

    // Calculate 4-week compliance per behavior
    const compMap = new Map<string, number | null>()
    ws = getWeekStart(today)
    const fourWeekDates: Date[] = []
    for (let i = 0; i < 4; i++) {
      fourWeekDates.push(...getWeekDates(ws))
      ws = prevWeek(ws)
    }

    for (const beh of activeBehaviors) {
      const applicable = fourWeekDates.filter(d =>
        matchesRecurrence(d, beh.repeat_unit ?? 'day', beh.repeat_interval ?? 1, beh.days_of_week ?? undefined, beh.monthly_pattern ?? undefined)
      )
      if (applicable.length === 0) { compMap.set(beh.id, null); continue }
      let completed = 0
      for (const d of applicable) {
        if (entryMap.get(entryKey(beh.id, formatDate(d)))?.value === 'y') completed++
      }
      compMap.set(beh.id, (completed / applicable.length) * 100)
    }
    setComplianceMap(compMap)

    setLoading(false)
  }, [userId])

  useEffect(() => { fetchData() }, [fetchData])

  const upsertEntry = useCallback(async (behaviorId: string, date: string, value: EntryValue | null) => {
    if (!userId) return
    const key = entryKey(behaviorId, date)
    if (value === null) {
      setEntries(prev => { const next = new Map(prev); next.delete(key); return next })
      await supabase.from('lsw_entries').delete().eq('behavior_id', behaviorId).eq('entry_date', date).eq('user_id', userId)
    } else {
      setEntries(prev => new Map(prev).set(key, { id: key, behavior_id: behaviorId, entry_date: date, value }))
      await supabase.from('lsw_entries').upsert(
        { user_id: userId, behavior_id: behaviorId, entry_date: date, value, updated_at: new Date().toISOString() },
        { onConflict: 'behavior_id,entry_date' }
      )
    }
  }, [userId])

  const upsertComment = useCallback(async (behaviorId: string, date: string, comment: string) => {
    if (!userId) return
    const key = entryKey(behaviorId, date)
    if (comment.trim() === '') {
      setComments(prev => { const next = new Map(prev); next.delete(key); return next })
      await supabase.from('lsw_cell_comments').delete().eq('behavior_id', behaviorId).eq('entry_date', date).eq('user_id', userId)
    } else {
      setComments(prev => new Map(prev).set(key, { id: key, behavior_id: behaviorId, entry_date: date, comment }))
      await supabase.from('lsw_cell_comments').upsert(
        { user_id: userId, behavior_id: behaviorId, entry_date: date, comment, updated_at: new Date().toISOString() },
        { onConflict: 'behavior_id,entry_date' }
      )
    }
  }, [userId])

  return { categories, behaviors, archivedBehaviors, entries, comments, complianceMap, loading, refresh: fetchData, upsertEntry, upsertComment }
}
