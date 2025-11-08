'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Music, Zap, TrendingUp, Target, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()

  const modes = [
    {
      id: 'lesson-plan',
      title: 'Lesson Plan',
      subtitle: 'Adaptive Long-Term Curriculum',
      description: 'Guided skill development with AI-powered adaptive learning',
      icon: BookOpen,
      gradient: 'from-red-600 to-red-800',
      features: [
        'Adaptive song/exercise selection',
        'Real-time feedback',
        'Progress tracking',
        'Mastery-based difficulty',
      ],
      route: '/lesson-plan',
    },
    {
      id: 'teach-song',
      title: 'Teach Me This Song',
      subtitle: 'Learn Specific Songs',
      description: 'Master any song with personalized guidance and practice loops',
      icon: Music,
      gradient: 'from-blue-600 to-blue-800',
      features: [
        'Song search & suggestions',
        'Real-time chord feedback',
        'Section looping',
        'Tempo & strumming analysis',
      ],
      route: '/teach-song',
    },
    {
      id: 'freeplay',
      title: 'Freeplay',
      subtitle: 'Play Freely',
      description: 'Explore and improvise without any guidance or scoring',
      icon: Zap,
      gradient: 'from-purple-600 to-purple-800',
      features: [
        'No scoring or feedback',
        'Natural device response',
        'Free exploration',
        'Casual practice',
      ],
      route: '/freeplay',
    },
  ]

  return (
    <div className="min-h-screen gradient-bg text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center glow">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                GuitarZeno
              </h1>
              <p className="text-sm text-gray-400">AI-Powered Guitar Learning</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your Learning Mode
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select a mode to start your guitar learning journey
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {modes.map((mode, index) => {
            const Icon = mode.icon
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(mode.route)}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 cursor-pointer border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:glow group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                <p className="text-sm text-gray-400 mb-1">{mode.subtitle}</p>
                <p className="text-gray-300 mb-4">{mode.description}</p>
                <ul className="space-y-2">
                  {mode.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                    Start Learning →
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
            <TrendingUp className="w-6 h-6 text-red-400 mb-2" />
            <div className="text-2xl font-bold">Adaptive</div>
            <div className="text-sm text-gray-400">Learning Path</div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
            <Target className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-2xl font-bold">Real-time</div>
            <div className="text-sm text-gray-400">Feedback</div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
            <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">Progress</div>
            <div className="text-sm text-gray-400">Tracking</div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
            <Music className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-sm text-gray-400">Songs</div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

