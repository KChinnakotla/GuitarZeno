'use client'

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeedbackIndicatorProps {
  type: 'correct' | 'incorrect' | 'warning' | null
  message?: string
}

export default function FeedbackIndicator({
  type,
  message,
}: FeedbackIndicatorProps) {
  if (!type) return null

  const config = {
    correct: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      defaultMessage: 'Correct!',
    },
    incorrect: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500',
      defaultMessage: 'Try again',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      defaultMessage: 'Almost there',
    },
  }

  const { icon: Icon, color, bg, border, defaultMessage } = config[type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${bg} ${border} border-2 rounded-xl px-6 py-4 shadow-2xl`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${color}`} />
          <span className="text-white font-semibold">
            {message || defaultMessage}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

