'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type StewardDemoRole =
  | 'stake_president'
  | 'stake_clerk'
  | 'high_councilor'
  | 'bishop'
  | 'elders_quorum_president'
  | 'relief_society_president'
  | 'member'

export const DEMO_ROLE_LABELS: Record<StewardDemoRole, string> = {
  stake_president: 'Stake President',
  stake_clerk: 'Stake Clerk',
  high_councilor: 'High Councilor',
  bishop: 'Bishop',
  elders_quorum_president: 'Elders Quorum President',
  relief_society_president: 'Relief Society President',
  member: 'Member',
}

interface DemoMode {
  /** True when the app is rendering demo data instead of real production data. */
  demoMode: boolean
  /** When demoMode is true, the role the viewer is "logged in as". */
  demoRole: StewardDemoRole
  setDemoMode: (on: boolean) => void
  setDemoRole: (role: StewardDemoRole) => void
}

const Ctx = createContext<DemoMode | null>(null)

const KEY_MODE = 'steward.demoMode'
const KEY_ROLE = 'steward.demoRole'

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoModeState] = useState(false)
  const [demoRole, setDemoRoleState] = useState<StewardDemoRole>('stake_president')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setDemoModeState(window.localStorage.getItem(KEY_MODE) === 'on')
    const r = window.localStorage.getItem(KEY_ROLE) as StewardDemoRole | null
    if (r && r in DEMO_ROLE_LABELS) setDemoRoleState(r)
  }, [])

  const setDemoMode = useCallback((on: boolean) => {
    setDemoModeState(on)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY_MODE, on ? 'on' : 'off')
    }
  }, [])

  const setDemoRole = useCallback((role: StewardDemoRole) => {
    setDemoRoleState(role)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY_ROLE, role)
    }
  }, [])

  return (
    <Ctx.Provider value={{ demoMode, demoRole, setDemoMode, setDemoRole }}>{children}</Ctx.Provider>
  )
}

export function useDemoMode(): DemoMode {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemoMode must be used inside <DemoModeProvider>')
  return ctx
}
