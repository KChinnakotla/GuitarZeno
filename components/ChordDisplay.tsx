'use client'

import { CheckCircle2, XCircle } from 'lucide-react'

interface ChordDisplayProps {
  chord: string
  isCorrect?: boolean
  isCurrent?: boolean
}

export default function ChordDisplay({
  chord,
  isCorrect,
  isCurrent,
}: ChordDisplayProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isCurrent
          ? 'bg-red-600/20 border-red-500 glow scale-105'
          : isCorrect === true
          ? 'bg-green-500/20 border-green-500'
          : isCorrect === false
          ? 'bg-red-500/20 border-red-500'
          : 'bg-gray-800/50 border-gray-700'
      }`}
    >
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">{chord}</div>
        {isCorrect !== undefined && (
          <div className="absolute top-2 right-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
        {isCurrent && (
          <div className="text-xs text-red-400 mt-2 font-semibold">CURRENT</div>
        )}
      </div>
    </div>
  )
}

