export interface Sublesson {
  id: string
  title: string
  operation: string
  feedback: string
  goal: string
  type: 'demo' | 'practice' | 'quiz' | 'challenge' | 'freeplay'
  completed?: boolean
  config?: {
    minCorrect?: number
    totalTrials?: number
    timeLimit?: number
    requiredAccuracy?: number
  }
}

export interface Lesson {
  id: string
  title: string
  description: string
  sublessons: Sublesson[]
  completed: boolean
  progress: number
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Strumming Basics',
    description: 'Learn the fundamentals of up and down strumming',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '1.1',
        title: 'Introduction to Strumming Directions',
        operation: 'Display an animation/demo: What is "up strum" and "down strum" with the thumb sensor? Show arrow graphics and hand movement. Ask user to try both motions without pressing any chord sensors.',
        feedback: 'Visual confirmation (arrow lights up the direction each time input is detected).',
        goal: 'Learner reliably triggers both up and down strum and recognizes each direction.',
        type: 'demo',
      },
      {
        id: '1.2',
        title: 'Strum Sequence Practice',
        operation: 'Present a list of strum instructions: "Up, Down, Up, Down..." (min. 8 steps). User performs each in sequence; app confirms correct direction before advancing.',
        feedback: '"Checkmark" appears for each correct input; error sound or prompt for wrong direction.',
        goal: 'Learner correct on 7 out of 8 strums in order (can repeat until passing).',
        type: 'practice',
        config: {
          minCorrect: 7,
          totalTrials: 8,
        },
      },
      {
        id: '1.3',
        title: 'Strum Quiz',
        operation: 'App displays random direction prompts, user must respond correctly to each (10 trials).',
        feedback: 'Show correct/incorrect immediately, and a final score at end.',
        goal: 'At least 8/10 correct.',
        type: 'quiz',
        config: {
          minCorrect: 8,
          totalTrials: 10,
        },
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Single Chord Practice',
    description: 'Master individual chord sensors and basic strumming combinations',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '2.1',
        title: 'Meet the Chord Sensors',
        operation: 'Show the breadbox diagram. Light up Sensor 1; prompt: "Press Sensor 1." Repeat for Sensors 2, 3, 4 (each mapped to a chord).',
        feedback: 'Visual highlight for correct sensor pressed; message for correct/incorrect touch.',
        goal: 'Learner locates and presses each sensor correctly at least once.',
        type: 'practice',
        config: {
          minCorrect: 4,
          totalTrials: 4,
        },
      },
      {
        id: '2.2',
        title: 'Strumming with One Chord',
        operation: 'For each sensor, prompt: "Press Sensor X, then strum down/up." User completes both steps per chord.',
        feedback: 'Confirm both correct press and correct strum. Play chord sound.',
        goal: 'Learner successfully pairs each chord sensor with down and up strum.',
        type: 'practice',
        config: {
          minCorrect: 8,
          totalTrials: 8,
        },
      },
      {
        id: '2.3',
        title: 'Chord Recall Game',
        operation: 'App randomly requests a chord sensor and strum direction; learner must respond within a time limit (e.g., 4 seconds). 12 rounds in total, covering all sensor/strum pairs.',
        feedback: 'Shows correct/incorrect per round and overall score.',
        goal: 'At least 10/12 correct.',
        type: 'quiz',
        config: {
          minCorrect: 10,
          totalTrials: 12,
          timeLimit: 4,
        },
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Two-Chord Switching',
    description: 'Learn to seamlessly switch between chords while strumming',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '3.1',
        title: 'Chord and Strum Switch Demo',
        operation: 'Show example sequence: "Sensor 1 + Down → Sensor 2 + Up." User watches the demo, then is prompted to repeat.',
        feedback: 'Visual timeline with checkmarks for each correct step.',
        goal: 'Learner understands the process of switching chords and strums.',
        type: 'demo',
      },
      {
        id: '3.2',
        title: 'Guided Chord Switch Practice',
        operation: 'Sequence prompts: "Sensor 1 + Down, then Sensor 2 + Up." Then repeat for all adjacent pairs (1↔2, 2↔3, 3↔4). Each switch must be completed within a time window.',
        feedback: 'Immediate check for correct chord and strum direction.',
        goal: 'At least two successful switches for each pair.',
        type: 'practice',
        config: {
          minCorrect: 6,
          totalTrials: 6,
        },
      },
      {
        id: '3.3',
        title: 'Fast Switch Challenge',
        operation: 'Give rapid-fire switch sequences (random pairs, strum directions). User performs in succession, with a 2-second window for each.',
        feedback: 'Animated progress bar; error sound for misses.',
        goal: '8/10 switches correct on first attempt.',
        type: 'challenge',
        config: {
          minCorrect: 8,
          totalTrials: 10,
          timeLimit: 2,
        },
      },
    ],
  },
  {
    id: 'lesson-4',
    title: 'Multi-Sensor Chord Practice',
    description: 'Master chords that require multiple sensor combinations',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '4.1',
        title: 'Playing Two-Button Chords',
        operation: 'Explain and show which chords require two sensors (e.g., Sensor 1+3 for a particular chord type). Prompt: "Press Sensors X and Y together, then strum down."',
        feedback: 'Highlight both sensors when correct; error if only one pressed or wrong combination.',
        goal: 'Learner can press correct sensor combinations and strum per prompt.',
        type: 'practice',
        config: {
          minCorrect: 4,
          totalTrials: 4,
        },
      },
      {
        id: '4.2',
        title: 'Multi-Sensor Chord Recall',
        operation: 'Present a sequence: "Press Sensors 2+4, strum up; Press Sensors 1+3, strum down," etc. Three steps per round.',
        feedback: 'Confirm correct presses, strum direction; visual feedback.',
        goal: 'Complete 3/4 rounds without error.',
        type: 'practice',
        config: {
          minCorrect: 3,
          totalTrials: 4,
        },
      },
      {
        id: '4.3',
        title: 'Advanced Chord Challenge',
        operation: 'Mix single and multi-sensor chords into random order. Prompt user with each chord/strum pair; time limit per step.',
        feedback: 'Full summary at end; badges for perfect recall.',
        goal: '5/6 rounds correct.',
        type: 'challenge',
        config: {
          minCorrect: 5,
          totalTrials: 6,
          timeLimit: 3,
        },
      },
    ],
  },
  {
    id: 'lesson-5',
    title: 'Song Pattern Performance',
    description: 'Apply your skills to play complete song patterns',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '5.1',
        title: 'Simple Song Walkthrough',
        operation: 'Show scrollable timeline (e.g., C major down, G major up, F major down, C major up). User follows along, pressing sensors and strumming as prompted.',
        feedback: 'Visual swipe or progress indicator; sounds play for correct input.',
        goal: 'Learner completes pattern in rhythm (e.g., 95% notes on time).',
        type: 'practice',
        config: {
          requiredAccuracy: 95,
        },
      },
      {
        id: '5.2',
        title: 'Speed Round',
        operation: 'Speed up tempo; prompt with song sequence. User must perform in quicker succession.',
        feedback: 'Visual score for speed/accuracy.',
        goal: 'Completion with few or no errors at faster pace.',
        type: 'challenge',
        config: {
          requiredAccuracy: 90,
        },
      },
      {
        id: '5.3',
        title: 'Performance Review & Replay',
        operation: 'Replay user\'s best attempt; highlight any mistakes. Offer option to retry specific segments.',
        feedback: 'Show final accuracy, error statistics, and improvement tips.',
        goal: 'Master at least 3 consecutive segments at high accuracy.',
        type: 'practice',
        config: {
          minCorrect: 3,
        },
      },
    ],
  },
  {
    id: 'lesson-6',
    title: 'Free Play and Mastery',
    description: 'Explore freely and challenge yourself with advanced exercises',
    completed: false,
    progress: 0,
    sublessons: [
      {
        id: '6.1',
        title: 'Free Jam',
        operation: 'Let user select any chord sensor, combination, and strum direction. App identifies played chord and logs strum direction/time.',
        feedback: 'Live display of played chords; saves or shares performance if desired.',
        goal: 'Exploration with visible feedback.',
        type: 'freeplay',
      },
      {
        id: '6.2',
        title: 'Challenge Mode',
        operation: 'Sequence of randomized chord/strum challenges at increasing speed. Optional leaderboard or badge rewards.',
        feedback: 'Scores comparative performance and tracks improvement.',
        goal: 'Achieve personal best or unlock badges.',
        type: 'challenge',
      },
    ],
  },
]

