'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'new' | null

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<UserStatus>(null)
  const [statusLoading, setStatusLoading] = useState(true)
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
      setUserStatus(null)
      setStatusLoading(false)
      checkedUserId.current = null
      return
    }

    if (checkedUserId.current === uid) return

    setAdminLoading(true)
    setStatusLoading(true)

    // Check admin status
    supabase
      .from('steward_admins')
      .select('user_id')
      .eq('user_id', uid)
      .then(({ data, error }) => {
        const result = !error && (data ?? []).length > 0
        setIsAdmin(result)
        setAdminLoading(false)
        // Admins are always approved
        if (result) {
          setUserStatus('approved')
          setStatusLoading(false)
          checkedUserId.current = uid
        }
      })

    // Check user profile status
    supabase
      .from('steward_user_profiles')
      .select('status')
      .eq('id', uid)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setUserStatus(data.status as UserStatus)
        } else {
          setUserStatus('new') // no profile yet — needs to pick a calling
        }
        setStatusLoading(false)
        checkedUserId.current = uid
      })
  }, [user?.id])

  const signOut = async () => {
    checkedUserId.current = null
    await supabase.auth.signOut()
  }

  const refreshStatus = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('steward_user_profiles')
      .select('status')
      .eq('id', user.id)
      .maybeSingle()
    if (data) setUserStatus(data.status as UserStatus)
  }

  return { user, loading, isAdmin, adminLoading, userStatus, statusLoading, signOut, refreshStatus }
}
