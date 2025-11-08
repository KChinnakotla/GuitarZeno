'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SensorDiagramProps {
  activeSensors?: number[]
  onSensorPress?: (sensor: number) => void
  highlightedSensor?: number
}

export default function SensorDiagram({
  activeSensors = [],
  onSensorPress,
  highlightedSensor,
}: SensorDiagramProps) {
  const sensors = [
    { id: 1, chord: 'C', x: 25, y: 25 },
    { id: 2, chord: 'G', x: 75, y: 25 },
    { id: 3, chord: 'Am', x: 25, y: 75 },
    { id: 4, chord: 'F', x: 75, y: 75 },
  ]

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-6 text-center">Chord Sensors</h3>
      <div className="relative w-full max-w-md mx-auto aspect-square">
        {/* Breadbox outline */}
        <div className="absolute inset-0 border-4 border-gray-700 rounded-2xl bg-gray-900/50" />
        
        {/* Sensors */}
        {sensors.map((sensor) => {
          const isActive = activeSensors.includes(sensor.id)
          const isHighlighted = highlightedSensor === sensor.id
          
          return (
            <motion.button
              key={sensor.id}
              onClick={() => onSensorPress?.(sensor.id)}
              className={`absolute w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all ${
                isHighlighted
                  ? 'bg-yellow-500 border-yellow-400 glow-green scale-110 z-10'
                  : isActive
                  ? 'bg-red-500 border-red-400 glow'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
              style={{
                left: `${sensor.x}%`,
                top: `${sensor.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isHighlighted
                  ? {
                      boxShadow: [
                        '0 0 20px rgba(34, 197, 94, 0.5)',
                        '0 0 40px rgba(34, 197, 94, 0.8)',
                        '0 0 20px rgba(34, 197, 94, 0.5)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: isHighlighted ? Infinity : 0 }}
            >
              <div className="text-center">
                <div className="text-xs text-gray-300">Sensor</div>
                <div className="text-xl font-bold">{sensor.id}</div>
                <div className="text-xs text-gray-400">{sensor.chord}</div>
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="text-center">
            <span className="text-gray-400">Sensor {sensor.id}:</span>
            <span className="ml-2 font-semibold">{sensor.chord}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

