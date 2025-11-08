'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, BookOpen, Music, Zap } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Lesson Plan', path: '/lesson-plan' },
    { icon: Music, label: 'Teach Song', path: '/teach-song' },
    { icon: Zap, label: 'Freeplay', path: '/freeplay' },
  ]

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-full px-4 py-2 border border-gray-800 shadow-2xl">
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-red-600 text-white glow'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

