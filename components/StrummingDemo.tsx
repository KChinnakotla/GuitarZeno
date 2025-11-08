'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowUp, Hand } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StrummingDemoProps {
  onStrumDetected?: (direction: 'up' | 'down') => void
  autoPlay?: boolean
}

export default function StrummingDemo({
  onStrumDetected,
  autoPlay = false,
}: StrummingDemoProps) {
  const [currentDirection, setCurrentDirection] = useState<'up' | 'down' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        const directions: ('up' | 'down')[] = ['down', 'up']
        const direction = directions[Math.floor(Math.random() * directions.length)]
        setCurrentDirection(direction)
        setIsAnimating(true)
        onStrumDetected?.(direction)
        setTimeout(() => {
          setIsAnimating(false)
          setCurrentDirection(null)
        }, 1000)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [autoPlay, onStrumDetected])

  const handleStrum = (direction: 'up' | 'down') => {
    setCurrentDirection(direction)
    setIsAnimating(true)
    onStrumDetected?.(direction)
    setTimeout(() => {
      setIsAnimating(false)
      setCurrentDirection(null)
    }, 500)
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Hand Animation */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-gray-700 rounded-full" />
          <motion.div
            animate={{
              y: currentDirection === 'down' ? 40 : currentDirection === 'up' ? -40 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <Hand className="w-16 h-16 text-red-400" />
          </motion.div>

          {/* Arrow Indicators */}
          <AnimatePresence>
            {currentDirection === 'down' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2"
              >
                <ArrowDown className="w-12 h-12 text-red-500 glow" />
              </motion.div>
            )}
            {currentDirection === 'up' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              >
                <ArrowUp className="w-12 h-12 text-blue-500 glow-blue" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Strumming Directions</h3>
          <p className="text-gray-400 mb-4">
            Try strumming up and down with your thumb sensor
          </p>
        </div>

        {/* Manual Controls */}
        {!autoPlay && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleStrum('down')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center space-x-2 glow"
            >
              <ArrowDown className="w-5 h-5" />
              <span>Down Strum</span>
            </button>
            <button
              onClick={() => handleStrum('up')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center space-x-2 glow-blue"
            >
              <ArrowUp className="w-5 h-5" />
              <span>Up Strum</span>
            </button>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {isAnimating && currentDirection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-6 py-3 rounded-lg ${
                currentDirection === 'down'
                  ? 'bg-red-500/20 border border-red-500'
                  : 'bg-blue-500/20 border border-blue-500'
              }`}
            >
              <span className="font-semibold">
                {currentDirection === 'down' ? 'Down' : 'Up'} strum detected!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

