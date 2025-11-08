'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Music,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Guitar,
  Mic,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import ChordDisplay from '@/components/ChordDisplay'

export default function FreeplayPage() {
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [currentChord, setCurrentChord] = useState<string | null>(null)
  const [recentChords, setRecentChords] = useState<string[]>([])

  // Mock chord detection - in real app this would come from Arduino
  const chords = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Dm', 'Em', 'Fm', 'Gm']

  const handleChordSelect = (chord: string) => {
    setCurrentChord(chord)
    setRecentChords((prev) => {
      const updated = [chord, ...prev].slice(0, 8)
      return updated
    })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
    setIsMuted(false)
  }

  return (
    <div className="min-h-screen gradient-bg text-white pb-24">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Freeplay</h1>
            <p className="text-gray-400">Play freely without any guidance</p>
          </div>
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center glow-green">
            <Zap className="w-8 h-8" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Main Play Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-800 text-center"
        >
          <div className="mb-8">
            <Guitar className="w-24 h-24 mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Play</h2>
            <p className="text-gray-400">
              Your device will respond naturally to your chords and strumming
            </p>
          </div>

          {/* Current Chord Display */}
          {currentChord ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <div className="text-sm text-gray-400 mb-2">Current Chord</div>
              <div className="inline-block">
                <ChordDisplay chord={currentChord} />
              </div>
            </motion.div>
          ) : (
            <div className="mb-8 py-12">
              <div className="text-gray-500 text-lg">
                Start playing to see detected chords
              </div>
            </div>
          )}

          {/* Volume Control */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Volume</span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>{isMuted ? 0 : volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* Chord Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2 text-purple-400" />
            Chord Palette
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {chords.map((chord) => (
              <button
                key={chord}
                onClick={() => handleChordSelect(chord)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  currentChord === chord
                    ? 'bg-purple-600/30 border-purple-500 glow-green scale-105'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <div className="text-xl font-bold">{chord}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Chords */}
        {recentChords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-green-400" />
              Recent Chords
            </h3>
            <div className="flex flex-wrap gap-3">
              {recentChords.map((chord, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChordDisplay chord={chord} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mt-6"
        >
          <div className="flex items-start space-x-3">
            <Mic className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">Freeplay Mode</h4>
              <p className="text-sm text-gray-400">
                This mode provides no scoring or feedback. Use it for exploration,
                improvisation, and casual practice. Your device will respond naturally
                to your playing without any guidance or evaluation.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Navigation />
    </div>
  )
}

