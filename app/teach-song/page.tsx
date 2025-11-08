'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Repeat,
  Volume2,
  Music,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import ChordDisplay from '@/components/ChordDisplay'
import FeedbackIndicator from '@/components/FeedbackIndicator'

export default function TeachSongPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChordIndex, setCurrentChordIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'warning' | null>(null)
  const [selectedSong, setSelectedSong] = useState<{
    title: string
    artist: string
    chords: string[]
    tempo: number
    strummingPattern: string
    difficulty: string
  } | null>(null)
  const [loopSection, setLoopSection] = useState(false)

  // Mock suggested songs
  const suggestedSongs = [
    { title: 'Wonderwall', artist: 'Oasis', difficulty: 'Intermediate' },
    { title: 'Hotel California', artist: 'Eagles', difficulty: 'Advanced' },
    { title: 'Hey There Delilah', artist: 'Plain White T\'s', difficulty: 'Beginner' },
    { title: 'Free Fallin\'', artist: 'Tom Petty', difficulty: 'Easy' },
    { title: 'House of the Rising Sun', artist: 'The Animals', difficulty: 'Intermediate' },
  ]

  // Mock song data
  const mockSongData = {
    title: 'Wonderwall',
    artist: 'Oasis',
    chords: ['Am', 'C', 'G', 'D', 'Am', 'C', 'G', 'D'],
    tempo: 120,
    strummingPattern: 'Down Down Up Up Down Up',
    difficulty: 'Intermediate',
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      // Simulate song selection
      setSelectedSong(mockSongData)
      setCurrentChordIndex(0)
    }
  }

  const handleSelectSong = (song: typeof suggestedSongs[0]) => {
    setSelectedSong({
      ...mockSongData,
      title: song.title,
      artist: song.artist,
      difficulty: song.difficulty,
    })
    setCurrentChordIndex(0)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextChord = () => {
    if (selectedSong && currentChordIndex < selectedSong.chords.length - 1) {
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
            <h1 className="text-3xl font-bold mb-2">Teach Me This Song</h1>
            <p className="text-gray-400">Learn any song with personalized guidance</p>
          </div>
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center glow-blue">
            <Music className="w-8 h-8" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!selectedSong ? (
          <>
            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-400" />
                Search for a Song
              </h2>
              <form onSubmit={handleSearch} className="flex space-x-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter song name or artist..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors glow-blue"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                AI Suggested Songs
              </h2>
              <div className="space-y-3">
                {suggestedSongs.map((song, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleSelectSong(song)}
                    className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600 flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-1">{song.title}</div>
                      <div className="text-gray-400 text-sm">{song.artist}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {song.difficulty}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        Learn
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Song Info Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{selectedSong.title}</h2>
                  <p className="text-gray-400 text-lg">{selectedSong.artist}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Difficulty</div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                    {selectedSong.difficulty}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Tempo
                  </div>
                  <div className="text-2xl font-bold">{selectedSong.tempo} BPM</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-gray-400 mb-2">Strumming Pattern</div>
                  <div className="text-lg font-semibold">
                    {selectedSong.strummingPattern}
                  </div>
                </div>
              </div>

              {/* Chord Progression */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Chord Progression
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {selectedSong.chords.map((chord, index) => (
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
                <button
                  onClick={() => setLoopSection(!loopSection)}
                  className={`p-3 rounded-full transition-colors ${
                    loopSection
                      ? 'bg-blue-600 text-white glow-blue'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentChordIndex(0)}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors glow-blue"
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
                <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {loopSection && (
                <div className="mt-4 bg-blue-500/20 border border-blue-500 rounded-xl p-4">
                  <div className="flex items-center text-blue-400">
                    <Repeat className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Looping Section: Chords {currentChordIndex + 1}-{Math.min(currentChordIndex + 4, selectedSong.chords.length)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedSong(null)
                  setCurrentChordIndex(0)
                  setIsPlaying(false)
                }}
                className="mt-4 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Choose Different Song
              </button>
            </motion.div>
          </>
        )}
      </main>

      <Navigation />
    </div>
  )
}

