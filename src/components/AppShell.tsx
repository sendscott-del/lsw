'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { ClipboardList, StickyNote } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  activeTab: 'work' | 'notes'
  onTabChange: (tab: 'work' | 'notes') => void
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Leader Standard Work</h1>
        <button
          onClick={signOut}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign Out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex">
        <button
          onClick={() => onTabChange('work')}
          className={`flex-1 flex flex-col items-center py-2 text-xs ${
            activeTab === 'work' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <ClipboardList size={20} />
          <span className="mt-0.5">Work</span>
        </button>
        <button
          onClick={() => onTabChange('notes')}
          className={`flex-1 flex flex-col items-center py-2 text-xs ${
            activeTab === 'notes' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <StickyNote size={20} />
          <span className="mt-0.5">Notes</span>
        </button>
      </nav>
    </div>
  )
}
