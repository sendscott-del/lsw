'use client'

import { X } from 'lucide-react'

interface InfoModalProps {
  title: string
  infoText: string
  onClose: () => void
}

export default function InfoModal({ title, infoText, onClose }: InfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{infoText}</p>
      </div>
    </div>
  )
}
