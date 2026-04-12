'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Search, Shield, CheckSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/hooks/useAuth'

interface AppInfo {
  name: string
  label: string
  url: string
  icon: typeof Search
  color: string
}

const APP_CATALOG: AppInfo[] = [
  { name: 'magnify', label: 'Magnify', url: 'https://magnify-sendscott-dels-projects.vercel.app', icon: Search, color: '#4f46e5' },
  { name: 'steward', label: 'Steward', url: 'https://stewards-indeed.vercel.app', icon: Shield, color: '#059669' },
  { name: 'duty', label: 'Duty', url: 'https://duty-app-sand.vercel.app', icon: CheckSquare, color: '#d97706' },
]

const CURRENT_APP = 'steward'

export default function AppSwitcher() {
  const { user } = useAuth()
  const [otherApps, setOtherApps] = useState<AppInfo[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_apps')
      .select('app_name')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return
        const appNames = data.map((r: { app_name: string }) => r.app_name)
        const others = APP_CATALOG.filter(a => a.name !== CURRENT_APP && appNames.includes(a.name))
        setOtherApps(others)
      })
  }, [user])

  if (otherApps.length === 0) return null

  const currentApp = APP_CATALOG.find(a => a.name === CURRENT_APP)!
  const CurrentIcon = currentApp.icon

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-1.5"
        style={{ backgroundColor: '#1e1b4b' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Left Field Labs</span>
          <div className="w-px h-3 bg-white/20" />
          <CurrentIcon size={14} className="text-white" />
          <span className="text-sm font-bold text-white">{currentApp.label}</span>
        </div>
        {expanded
          ? <ChevronUp size={14} className="text-white/70" />
          : <ChevronDown size={14} className="text-white/70" />
        }
      </button>

      {expanded && (
        <div className="bg-white border-b border-gray-200 py-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1">Switch to</p>
          {otherApps.map(app => {
            const Icon = app.icon
            return (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setExpanded(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center"
                  style={{ backgroundColor: app.color }}
                >
                  <Icon size={16} className="text-white" />
                </div>
                <span className="flex-1 text-sm font-semibold text-gray-800">{app.label}</span>
                <ExternalLink size={14} className="text-gray-400" />
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
