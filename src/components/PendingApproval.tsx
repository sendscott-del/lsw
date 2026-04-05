'use client'

import { Clock } from 'lucide-react'

interface PendingApprovalProps {
  onRefresh: () => void
  onSignOut: () => void
}

export default function PendingApproval({ onRefresh, onSignOut }: PendingApprovalProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={28} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Awaiting Approval</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your account is pending approval from an administrator. You&apos;ll be able to use the app once you&apos;re approved.
        </p>
        <div className="space-y-2">
          <button
            onClick={onRefresh}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Check Status
          </button>
          <button
            onClick={onSignOut}
            className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
