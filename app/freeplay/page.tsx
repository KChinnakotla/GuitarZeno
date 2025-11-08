'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Music,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Guitar,
  Mic,
  Play,
  Square,
  AlertCircle,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import ChordDisplay from '@/components/ChordDisplay'

interface DetectionData {
  chord: string
  strum_direction: string | null
  strum_detected: boolean
  velocity: number
  thumb_extended: boolean
}

export default function FreeplayPage() {
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [currentChord, setCurrentChord] = useState<string>('None')
  const [recentChords, setRecentChords] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLImageElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const imageUrlRef = useRef<string>('')

  // WebSocket connection for real-time data
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws')
        
        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setError(null)
        }
        
        ws.onmessage = (event) => {
          try {
            const data: DetectionData = JSON.parse(event.data)
            setDetectionData(data)
            
            // Update chord
            if (data.chord && data.chord !== 'None') {
              setCurrentChord(data.chord)
              setRecentChords((prev) => {
                const updated = [data.chord, ...prev.filter(c => c !== data.chord)].slice(0, 8)
                return updated
              })
            }
          } catch (e) {
            console.error('Error parsing WebSocket data:', e)
          }
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setError('Connection error. Make sure the backend server is running.')
          setIsConnected(false)
        }
        
        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          // Try to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000)
        }
        
        wsRef.current = ws
      } catch (e) {
        console.error('Error connecting WebSocket:', e)
        setError('Could not connect to backend server.')
      }
    }
    
    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Video stream - MJPEG stream will automatically update
  // No need for manual refresh as MJPEG streams are continuous

  const handleStartStream = async () => {
    try {
      const response = await fetch('http://localhost:8000/start', {
        method: 'POST',
      })
      if (response.ok) {
        setIsStreaming(true)
        setError(null)
      } else {
        setError('Failed to start stream')
      }
    } catch (e) {
      setError('Could not connect to backend server. Make sure it is running on port 8000.')
      console.error('Error starting stream:', e)
    }
  }

  const handleStopStream = async () => {
    try {
      const response = await fetch('http://localhost:8000/stop', {
        method: 'POST',
      })
      if (response.ok) {
        setIsStreaming(false)
      }
    } catch (e) {
      console.error('Error stopping stream:', e)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
    setIsMuted(false)
  }

  // Format chord name for display (e.g., "C_major" -> "C")
  const formatChordName = (chord: string) => {
    if (chord === 'None' || !chord) return null
    return chord.split('_')[0]
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
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500 glow-green' : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-semibold">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex space-x-2">
              {!isStreaming ? (
                <button
                  onClick={handleStartStream}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Stream</span>
                </button>
              ) : (
                <button
                  onClick={handleStopStream}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Stream</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">Error</p>
                <p className="text-sm text-red-300">{error}</p>
                <p className="text-xs text-red-400 mt-2">
                  Make sure the backend server is running: <code className="bg-red-900/50 px-2 py-1 rounded">python backend/main.py</code>
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Video Feed */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-purple-400" />
              Camera Feed
            </h3>
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              {isStreaming ? (
                <img
                  ref={videoRef}
                  src="http://localhost:8000/video_feed"
                  alt="Video feed"
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'auto' }}
                  onError={(e) => {
                    console.error('Video stream error')
                    setError('Could not load video stream. Make sure the backend is running.')
                  }}
                  onLoad={() => {
                    setError(null)
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">Video stream not started</div>
                    <div className="text-sm text-gray-500">
                      Click "Start Stream" to begin
                    </div>
                  </div>
                </div>
              )}
              {isStreaming && !isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
                  <div className="text-center">
                    <div className="text-yellow-400 mb-2">Connecting...</div>
                    <div className="text-sm text-gray-400">
                      Waiting for camera connection...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Detection Info */}
        {detectionData && isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4">Detection Info</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Velocity</div>
                <div className="text-2xl font-bold">
                  {detectionData.velocity.toFixed(3)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Direction</div>
                <div className="text-2xl font-bold">
                  {detectionData.strum_direction || 'None'}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Thumb</div>
                <div className="text-2xl font-bold">
                  {detectionData.thumb_extended ? 'Extended' : 'Retracted'}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Strum</div>
                <div
                  className={`text-2xl font-bold ${
                    detectionData.strum_detected ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {detectionData.strum_detected ? 'Detected' : 'Waiting'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Chord Display */}
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
          {currentChord && currentChord !== 'None' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={currentChord}
              className="mb-8"
            >
              <div className="text-sm text-gray-400 mb-2">Current Chord</div>
              <div className="inline-block">
                <ChordDisplay chord={formatChordName(currentChord) || currentChord} />
              </div>
              <div className="text-xs text-gray-500 mt-2">{currentChord}</div>
            </motion.div>
          ) : (
            <div className="mb-8 py-12">
              <div className="text-gray-500 text-lg">
                {isStreaming
                  ? 'Start playing to see detected chords'
                  : 'Start the stream to begin'}
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

        {/* Recent Chords */}
        {recentChords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-green-400" />
              Recent Chords
            </h3>
            <div className="flex flex-wrap gap-3">
              {recentChords.map((chord, index) => (
                <motion.div
                  key={`${chord}-${index}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChordDisplay chord={formatChordName(chord) || chord} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <Mic className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">Freeplay Mode</h4>
              <p className="text-sm text-gray-400">
                This mode provides no scoring or feedback. Use it for exploration,
                improvisation, and casual practice. Your device will respond naturally
                to your playing with real-time video feed, chord detection, and audio playback.
              </p>
              {!isStreaming && (
                <p className="text-xs text-purple-400 mt-3">
                  Click "Start Stream" to begin playing with live camera feed and detection.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Navigation />
    </div>
  )
}
