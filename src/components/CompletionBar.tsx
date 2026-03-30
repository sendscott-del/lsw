'use client'

interface CompletionBarProps {
  percentage: number
}

export default function CompletionBar({ percentage }: CompletionBarProps) {
  const rounded = Math.round(percentage)
  const color = rounded >= 80 ? 'bg-green-500' : rounded >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="px-4 py-2 flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${rounded}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-right">
        {rounded}%
      </span>
    </div>
  )
}
