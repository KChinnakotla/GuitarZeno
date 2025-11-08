'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Target,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import ProgressBar from '@/components/ProgressBar'
import ChordDisplay from '@/components/ChordDisplay'
import FeedbackIndicator from '@/components/FeedbackIndicator'

export default function LessonPlanPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChordIndex, setCurrentChordIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'warning' | null>(null)
  const [mastery, setMastery] = useState({
    chords: 65,
    tempo: 72,
    strumming: 58,
  })

  // Mock data
  const currentSong = {
    title: 'Wonderwall',
    artist: 'Oasis',
    difficulty: 'Intermediate',
    progress: 45,
    chords: ['Am', 'C', 'G', 'D'],
    tempo: 120,
    strummingPattern: 'Down Down Up Up Down Up',
  }

  const nextExercises = [
    { title: 'Chord Transitions: Am to C', difficulty: 'Easy', mastery: 80 },
    { title: 'Strumming Pattern Practice', difficulty: 'Medium', mastery: 60 },
    { title: 'Tempo Control Exercise', difficulty: 'Medium', mastery: 70 },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextChord = () => {
    if (currentChordIndex < currentSong.chords.length - 1) {
      setCurrentChordIndex(currentChordIndex + 1)
      // Simulate feedback
      const randomFeedback = Math.random()
      if (randomFeedback > 0.7) {
        setFeedback('correct')
        setTimeout(() => setFeedback(null), 2000)
      } else if (randomFeedback > 0.4) {
        setFeedback('warning')
        setTimeout(() => setFeedback(null), 2000)
      } else {
        setFeedback('incorrect')
        setTimeout(() => setFeedback(null), 2000)
      }
    }
  }

  return (
    <div className="min-h-screen gradient-bg text-white pb-24">
      <FeedbackIndicator type={feedback} />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lesson Plan</h1>
            <p className="text-gray-400">Adaptive Long-Term Curriculum</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Skill Level</div>
              <div className="text-2xl font-bold">Intermediate</div>
            </div>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center glow">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Mastery Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
            Mastery Progress
          </h2>
          <div className="space-y-4">
            <ProgressBar label="Chords" value={mastery.chords} color="red" />
            <ProgressBar label="Tempo Control" value={mastery.tempo} color="blue" />
            <ProgressBar label="Strumming Patterns" value={mastery.strumming} color="green" />
          </div>
        </motion.div>

        {/* Current Exercise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{currentSong.title}</h2>
              <p className="text-gray-400">{currentSong.artist}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Difficulty</div>
              <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                {currentSong.difficulty}
              </div>
            </div>
          </div>

          <ProgressBar
            label="Song Progress"
            value={currentSong.progress}
            color="red"
          />

          {/* Chord Sequence */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Chord Sequence</h3>
            <div className="grid grid-cols-4 gap-3">
              {currentSong.chords.map((chord, index) => (
                <ChordDisplay
                  key={index}
                  chord={chord}
                  isCurrent={index === currentChordIndex}
                  isCorrect={
                    index < currentChordIndex
                      ? Math.random() > 0.3
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors glow"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleNextChord}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Song Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center text-gray-400 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Tempo
              </div>
              <div className="text-2xl font-bold">{currentSong.tempo} BPM</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-gray-400 mb-2">Strumming Pattern</div>
              <div className="text-lg font-semibold">
                {currentSong.strummingPattern}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Recommended Next Exercises
          </h2>
          <div className="space-y-3">
            {nextExercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{exercise.title}</div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {exercise.difficulty}
                      </span>
                      <ProgressBar
                        label=""
                        value={exercise.mastery}
                        max={100}
                        showPercentage={false}
                        color="blue"
                      />
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Navigation />
    </div>
  )
}

