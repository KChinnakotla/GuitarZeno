'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowDown, ArrowUp } from 'lucide-react'

interface StrumSequencePracticeProps {
  sequence: ('up' | 'down')[]
  onComplete: (score: number) => void
  minCorrect: number
}

export default function StrumSequencePractice({
  sequence,
  onComplete,
  minCorrect,
}: StrumSequencePracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [completed, setCompleted] = useState(false)

  const handleStrum = (direction: 'up' | 'down') => {
    if (completed) return

    const expected = sequence[currentIndex]
    const isCorrect = direction === expected

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
      setFeedback('correct')
      if (currentIndex < sequence.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
          setFeedback(null)
        }, 500)
      } else {
        setTimeout(() => {
          setCompleted(true)
          onComplete(correctCount + 1)
        }, 500)
      }
    } else {
      setFeedback('incorrect')
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  const reset = () => {
    setCurrentIndex(0)
    setCorrectCount(0)
    setFeedback(null)
    setCompleted(false)
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Strum Sequence Practice</h3>
          <div className="text-sm text-gray-400">
            {currentIndex + 1}/{sequence.length}
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / sequence.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Instruction */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-4">
          {sequence[currentIndex] === 'down' ? (
            <ArrowDown className="w-16 h-16 mx-auto text-red-500" />
          ) : (
            <ArrowUp className="w-16 h-16 mx-auto text-blue-500" />
          )}
        </div>
        <p className="text-xl text-gray-300 capitalize">
          Strum {sequence[currentIndex]}
        </p>
      </div>

      {/* Sequence Preview */}
      <div className="flex justify-center space-x-2 mb-8 flex-wrap">
        {sequence.map((dir, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
              index < currentIndex
                ? 'bg-green-500/20 border-green-500'
                : index === currentIndex
                ? 'bg-blue-500/20 border-blue-500 glow scale-110'
                : 'bg-gray-700 border-gray-600'
            }`}
          >
            {dir === 'down' ? (
              <ArrowDown className="w-6 h-6" />
            ) : (
              <ArrowUp className="w-6 h-6" />
            )}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-6"
          >
            {feedback === 'correct' ? (
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-lg font-semibold">Correct!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-red-400">
                <XCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Try again</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleStrum('down')}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <ArrowDown className="w-5 h-5" />
          <span>Down</span>
        </button>
        <button
          onClick={() => handleStrum('up')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <ArrowUp className="w-5 h-5" />
          <span>Up</span>
        </button>
      </div>

      {/* Completion */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div
            className={`p-6 rounded-xl ${
              correctCount >= minCorrect
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-yellow-500/20 border border-yellow-500'
            }`}
          >
            <h4 className="text-xl font-bold mb-2">Practice Complete!</h4>
            <p className="text-lg mb-4">
              Score: {correctCount}/{sequence.length}
            </p>
            {correctCount >= minCorrect ? (
              <p className="text-green-400 font-semibold">
                ✓ Goal achieved! You can move on.
              </p>
            ) : (
              <p className="text-yellow-400 font-semibold">
                Goal: {minCorrect}/{sequence.length} correct. Try again!
              </p>
            )}
            <button
              onClick={reset}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

