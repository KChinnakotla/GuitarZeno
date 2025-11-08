'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Play } from 'lucide-react'
import { Lesson } from '@/data/lessons'

interface LessonCardProps {
  lesson: Lesson
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

export default function LessonCard({
  lesson,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: LessonCardProps) {
  const completedSublessons = lesson.sublessons.filter(
    (sub) => sub.completed === true
  ).length
  const totalSublessons = lesson.sublessons.length
  const progressPercentage =
    totalSublessons > 0 ? (completedSublessons / totalSublessons) * 100 : 0

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={`relative rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer ${
        isActive
          ? 'bg-red-600/20 border-red-500 glow scale-105'
          : isCompleted
          ? 'bg-green-500/10 border-green-500/50 hover:border-green-500'
          : isLocked
          ? 'bg-gray-800/30 border-gray-700 opacity-50 cursor-not-allowed'
          : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
      }`}
    >
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
      )}

      {isCompleted && !isLocked && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{lesson.title}</h3>
          <p className="text-sm text-gray-400">{lesson.description}</p>
        </div>
        {!isLocked && (
          <div className="ml-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-red-400" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            {completedSublessons}/{totalSublessons} Sublessons
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-green-500'
                : isActive
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

