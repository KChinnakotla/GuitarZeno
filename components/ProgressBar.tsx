'use client'

interface ProgressBarProps {
  label: string
  value: number
  max?: number
  color?: 'red' | 'blue' | 'green' | 'purple'
  showPercentage?: boolean
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  color = 'red',
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

