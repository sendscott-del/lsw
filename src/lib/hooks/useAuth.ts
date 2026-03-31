'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const checkedUserId = useRef<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const uid = user?.id ?? null

    if (!uid) {
      setIsAdmin(false)
      setAdminLoading(false)
      checkedUserId.current = null
      return
    }

    // Don't re-check if we already checked this user
    if (checkedUserId.current === uid) return

    setAdminLoading(true)

    supabase
      .from('lsw_admins')
      .select('user_id')
      .eq('user_id', uid)
      .then(({ data, error }) => {
        const result = !error && (data ?? []).length > 0
        setIsAdmin(result)
        setAdminLoading(false)
        checkedUserId.current = uid
      })
  }, [user?.id])

  const signOut = async () => {
    checkedUserId.current = null
    await supabase.auth.signOut()
  }

  return { user, loading, isAdmin, adminLoading, signOut }
}
