'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Play,
  Target,
  Info,
  Award,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import LessonCard from '@/components/LessonCard'
import StrummingDemo from '@/components/StrummingDemo'
import StrumSequencePractice from '@/components/StrumSequencePractice'
import SensorDiagram from '@/components/SensorDiagram'
import { lessons, Lesson, Sublesson } from '@/data/lessons'

type ViewMode = 'lessons' | 'sublesson'

export default function LessonPlanPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lessons')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedSublesson, setSelectedSublesson] = useState<Sublesson | null>(null)
  const [lessonProgress, setLessonProgress] = useState<Record<string, Lesson>>(() => {
    const initial: Record<string, Lesson> = {}
    lessons.forEach((lesson) => {
      initial[lesson.id] = { ...lesson }
    })
    return initial
  })

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress[lessonId] || lessons.find((l) => l.id === lessonId)!
  }

  const isLessonLocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return false
    const previousLesson = lessons[lessonIndex - 1]
    const progress = getLessonProgress(previousLesson.id)
    return !progress.completed
  }

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setViewMode('sublesson')
    // Select first incomplete sublesson, or first if all complete
    const progress = getLessonProgress(lesson.id)
    const firstIncomplete = progress.sublessons.find((s) => !s.completed)
    setSelectedSublesson(firstIncomplete || progress.sublessons[0])
  }

  const handleSublessonComplete = (score: number, required: number) => {
    if (!selectedLesson || !selectedSublesson) return

    const isPassing = score >= required
    if (isPassing) {
      const updatedProgress = { ...lessonProgress }
      const lesson = { ...updatedProgress[selectedLesson.id] }
      const sublessonIndex = lesson.sublessons.findIndex(
        (s) => s.id === selectedSublesson.id
      )
      
      if (sublessonIndex !== -1) {
        lesson.sublessons[sublessonIndex] = {
          ...lesson.sublessons[sublessonIndex],
          completed: true,
        }
        
        // Check if all sublessons are complete
        const allComplete = lesson.sublessons.every((s) => s.completed)
        lesson.completed = allComplete
        
        updatedProgress[selectedLesson.id] = lesson
        setLessonProgress(updatedProgress)
      }
    }
  }

  const handleNextSublesson = () => {
    if (!selectedLesson) return
    const progress = getLessonProgress(selectedLesson.id)
    const currentIndex = progress.sublessons.findIndex(
      (s) => s.id === selectedSublesson?.id
    )
    
    if (currentIndex < progress.sublessons.length - 1) {
      setSelectedSublesson(progress.sublessons[currentIndex + 1])
    }
  }

  const handlePrevSublesson = () => {
    if (!selectedLesson) return
    const progress = getLessonProgress(selectedLesson.id)
    const currentIndex = progress.sublessons.findIndex(
      (s) => s.id === selectedSublesson?.id
    )
    
    if (currentIndex > 0) {
      setSelectedSublesson(progress.sublessons[currentIndex - 1])
    }
  }

  const generateStrumSequence = (length: number): ('up' | 'down')[] => {
    const directions: ('up' | 'down')[] = []
    for (let i = 0; i < length; i++) {
      directions.push(i % 2 === 0 ? 'down' : 'up')
    }
    return directions
  }

  const renderSublessonContent = () => {
    if (!selectedSublesson) return null

    switch (selectedSublesson.type) {
      case 'demo':
        if (selectedSublesson.id === '1.1') {
          return (
            <StrummingDemo
              autoPlay={true}
              onStrumDetected={(direction) => {
                console.log('Strum detected:', direction)
              }}
            />
          )
        }
        break

      case 'practice':
        if (selectedSublesson.id === '1.2') {
          const sequence = generateStrumSequence(8)
          return (
            <StrumSequencePractice
              sequence={sequence}
              minCorrect={selectedSublesson.config?.minCorrect || 7}
              onComplete={(score) => {
                handleSublessonComplete(score, selectedSublesson.config?.minCorrect || 7)
              }}
            />
          )
        }
        if (selectedSublesson.id.startsWith('2.1')) {
          return (
            <SensorPractice
              sublesson={selectedSublesson}
              onComplete={(score) => {
                handleSublessonComplete(score, selectedSublesson.config?.minCorrect || 4)
              }}
            />
          )
        }
        break

      case 'quiz':
        if (selectedSublesson.id === '1.3') {
          return (
            <StrumQuiz
              sublesson={selectedSublesson}
              onComplete={(score) => {
                handleSublessonComplete(score, selectedSublesson.config?.minCorrect || 8)
              }}
            />
          )
        }
        break
    }

    // Default view for sublessons without specific components
    return (
      <div className="bg-gray-800/50 rounded-2xl p-8">
        <div className="text-center py-12">
          <Play className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400">
            Interactive component for this sublesson coming soon!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedSublesson.operation}
          </p>
        </div>
      </div>
    )
  }

  if (viewMode === 'sublesson' && selectedLesson && selectedSublesson) {
    const progress = getLessonProgress(selectedLesson.id)
    const currentIndex = progress.sublessons.findIndex(
      (s) => s.id === selectedSublesson.id
    )
    const canGoNext = currentIndex < progress.sublessons.length - 1
    const canGoPrev = currentIndex > 0

    return (
      <div className="min-h-screen gradient-bg text-white pb-24">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <button
            onClick={() => setViewMode('lessons')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Lessons</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{selectedLesson.title}</h1>
              <p className="text-gray-400">{selectedSublesson.title}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Sublesson</div>
              <div className="text-xl font-bold">
                {currentIndex + 1}/{progress.sublessons.length}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Sublesson Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
          >
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center text-blue-400 mb-2">
                  <Play className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Operation</span>
                </div>
                <p className="text-sm text-gray-300">{selectedSublesson.operation}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center text-green-400 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Feedback</span>
                </div>
                <p className="text-sm text-gray-300">{selectedSublesson.feedback}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center text-yellow-400 mb-2">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Goal</span>
                </div>
                <p className="text-sm text-gray-300">{selectedSublesson.goal}</p>
              </div>
            </div>

            {/* Completion Status */}
            {selectedSublesson.completed && (
              <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="font-semibold text-green-400">
                  Sublesson completed!
                </span>
              </div>
            )}
          </motion.div>

          {/* Interactive Content */}
          <motion.div
            key={selectedSublesson.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderSublessonContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevSublesson}
              disabled={!canGoPrev}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {progress.sublessons.map((sub, index) => (
                <div
                  key={sub.id}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex
                      ? 'bg-red-500'
                      : sub.completed
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSublesson}
              disabled={!canGoNext}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>

        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg text-white pb-24">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lesson Plan</h1>
            <p className="text-gray-400">Structured curriculum for guitar mastery</p>
          </div>
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center glow">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-red-400" />
            Overall Progress
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  {Object.values(lessonProgress).filter((l) => l.completed).length}/
                  {lessons.length} Lessons Completed
                </span>
                <span>
                  {Math.round(
                    (Object.values(lessonProgress).filter((l) => l.completed).length /
                      lessons.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (Object.values(lessonProgress).filter((l) => l.completed).length /
                        lessons.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const progress = getLessonProgress(lesson.id)
            const isLocked = isLessonLocked(index)
            const isActive = selectedLesson?.id === lesson.id

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LessonCard
                  lesson={progress}
                  isActive={isActive}
                  isCompleted={progress.completed}
                  isLocked={isLocked}
                  onClick={() => !isLocked && handleLessonClick(progress)}
                />
              </motion.div>
            )
          })}
        </div>
      </main>

      <Navigation />
    </div>
  )
}

// Additional components for specific sublessons
function SensorPractice({
  sublesson,
  onComplete,
}: {
  sublesson: Sublesson
  onComplete: (score: number) => void
}) {
  const [currentSensor, setCurrentSensor] = useState(1)
  const [pressedSensors, setPressedSensors] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)

  const sensors = [1, 2, 3, 4]

  const handleSensorPress = (sensor: number) => {
    if (completed) return

    if (sensor === currentSensor && !pressedSensors.includes(sensor)) {
      const newPressed = [...pressedSensors, sensor]
      setPressedSensors(newPressed)

      if (newPressed.length === sensors.length) {
        setCompleted(true)
        onComplete(newPressed.length)
      } else {
        // Move to next sensor
        const nextIndex = sensors.findIndex((s) => !newPressed.includes(s))
        if (nextIndex !== -1) {
          setCurrentSensor(sensors[nextIndex])
        }
      }
    }
  }

  return (
    <div>
      <SensorDiagram
        highlightedSensor={currentSensor}
        activeSensors={pressedSensors}
        onSensorPress={handleSensorPress}
      />
      <div className="mt-6 text-center">
        <p className="text-lg mb-4">
          Press Sensor {currentSensor}
        </p>
        <div className="text-sm text-gray-400">
          Progress: {pressedSensors.length}/{sensors.length}
        </div>
        {completed && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-xl">
            <p className="text-green-400 font-semibold">
              ✓ All sensors located successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StrumQuiz({
  sublesson,
  onComplete,
}: {
  sublesson: Sublesson
  onComplete: (score: number) => void
}) {
  const [trials, setTrials] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [currentPrompt, setCurrentPrompt] = useState<'up' | 'down'>('down')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [completed, setCompleted] = useState(false)

  const totalTrials = sublesson.config?.totalTrials || 10
  const minCorrect = sublesson.config?.minCorrect || 8

  useEffect(() => {
    generateNewPrompt()
  }, [])

  const generateNewPrompt = () => {
    setCurrentPrompt(Math.random() > 0.5 ? 'up' : 'down')
  }

  const handleAnswer = (answer: 'up' | 'down') => {
    if (completed) return

    const isCorrect = answer === currentPrompt
    if (isCorrect) {
      setCorrect((prev) => prev + 1)
      setFeedback('correct')
    } else {
      setFeedback('incorrect')
    }

    const newTrials = trials + 1
    setTrials(newTrials)

    if (newTrials >= totalTrials) {
      setTimeout(() => {
        setCompleted(true)
        onComplete(correct + (isCorrect ? 1 : 0))
      }, 1000)
    } else {
      setTimeout(() => {
        generateNewPrompt()
        setFeedback(null)
      }, 1000)
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Strum Quiz</h3>
        <p className="text-gray-400">
          Trial {trials + 1}/{totalTrials} | Score: {correct}/{trials}
        </p>
      </div>

      {!completed ? (
        <>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4 capitalize text-red-500">
              {currentPrompt === 'down' ? '↓' : '↑'}
            </div>
            <p className="text-xl">Strum {currentPrompt}</p>
          </div>

          {feedback && (
            <div
              className={`text-center mb-6 p-4 rounded-xl ${
                feedback === 'correct'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAnswer('down')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Down
            </button>
            <button
              onClick={() => handleAnswer('up')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Up
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div
            className={`p-8 rounded-xl ${
              correct >= minCorrect
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-yellow-500/20 border border-yellow-500'
            }`}
          >
            <h4 className="text-2xl font-bold mb-4">Quiz Complete!</h4>
            <p className="text-3xl font-bold mb-2">
              Score: {correct}/{totalTrials}
            </p>
            {correct >= minCorrect ? (
              <p className="text-green-400 font-semibold">
                ✓ Goal achieved! Great job!
              </p>
            ) : (
              <p className="text-yellow-400 font-semibold">
                Goal: {minCorrect}/{totalTrials} correct. Keep practicing!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
