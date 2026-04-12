'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/hooks/useAuth'

interface AppInfo {
  name: string
  label: string
  url: string
  logo: string
}

const APP_CATALOG: AppInfo[] = [
  { name: 'magnify', label: 'Magnify', url: 'https://magnify-sendscott-dels-projects.vercel.app', logo: '/magnify-icon.png' },
  { name: 'steward', label: 'Steward', url: 'https://stewards-indeed.vercel.app', logo: '/favicon.png' },
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

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-1.5"
        style={{ backgroundColor: '#1e1b4b' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Gathered</span>
          <div className="w-px h-3 bg-white/20" />
          <img src={currentApp.logo} alt={currentApp.label} className="w-[18px] h-[18px] rounded" />
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
          {otherApps.map(app => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExpanded(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
            >
              <img src={app.logo} alt={app.label} className="w-7 h-7 rounded" />
              <span className="flex-1 text-sm font-semibold text-gray-800">{app.label}</span>
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
