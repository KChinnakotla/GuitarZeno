# GuitarZeno

A modern, AI-powered guitar learning application with adaptive curriculum, real-time feedback, and multiple learning modes.

## Features

### Lesson Plan Mode
- Structured curriculum with 6 lessons and 17 sublessons
- Progressive unlocking system
- Interactive practice components
- Real-time feedback and goal tracking

### Teach Me This Song Mode
- Learn any song with step-by-step guidance
- AI song suggestions based on preferences
- Real-time chord accuracy feedback
- Section looping for difficult parts
- Tempo and strumming pattern analysis

### Freeplay Mode
- Real-time video feed from camera
- Live chord detection from Arduino
- Strumming detection via Mediapipe
- Audio playback based on detected chords
- No scoring or feedback - pure exploration

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **API**: FastAPI
- **Video Streaming**: OpenCV + MJPEG
- **Hand Tracking**: Mediapipe
- **Serial Communication**: PySerial (Arduino)
- **Audio**: Pydub + SimpleAudio

### Hardware
- **Arduino**: Chord detection via touch sensors
- **Camera**: USB webcam for hand tracking
- **Audio**: System audio output

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- Arduino IDE (for uploading sketch)
- USB camera
- Arduino with touch sensors

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

2. Upload Arduino sketch:
   - Open `chord_detection_arduino.ino` in Arduino IDE
   - Upload to your Arduino board
   - Note the serial port (e.g., `COM3` on Windows, `/dev/cu.usbserial-0001` on Mac)

3. Update backend configuration (if needed):
   - Edit `backend/main.py` to change serial port or camera index

4. Start the backend server:
```bash
# Windows
python backend/main.py

# Or use the batch file
backend/start.bat

# Mac/Linux
python backend/main.py

# Or use the shell script
chmod +x backend/start.sh
./backend/start.sh
```

The backend will start on `http://localhost:8000`

### Using Freeplay Mode

1. Make sure backend is running
2. Connect Arduino and camera
3. Navigate to Freeplay mode in the app
4. Click "Start Stream"
5. Play your guitar and see real-time video feed with chord detection!

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with mode selection
│   ├── globals.css         # Global styles
│   ├── lesson-plan/        # Lesson Plan mode page
│   ├── teach-song/         # Teach Me This Song mode page
│   └── freeplay/           # Freeplay mode page
├── components/
│   ├── Navigation.tsx      # Bottom navigation bar
│   ├── ProgressBar.tsx     # Progress indicator component
│   ├── ChordDisplay.tsx    # Chord visualization component
│   ├── FeedbackIndicator.tsx # Real-time feedback component
│   ├── LessonCard.tsx      # Lesson card component
│   ├── StrummingDemo.tsx   # Strumming demonstration
│   ├── StrumSequencePractice.tsx # Sequence practice
│   └── SensorDiagram.tsx   # Sensor visualization
├── data/
│   └── lessons.ts          # Lesson curriculum data
├── backend/
│   ├── main.py             # FastAPI backend server
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
└── Hardware/
    └── PseudoGuitar/
        ├── strumming.py    # Original strumming detection
        ├── chordDetection.py # Chord detection from Arduino
        ├── soundPlayback.py # Audio playback
        └── chord_sounds/   # Chord audio files
```

## Hardware Integration

### Arduino Setup
- Connect touch sensors to pins: Index (5), Middle (21), Ring (19), Pinky (18), Thumb (23)
- Upload `chord_detection_arduino.ino` sketch
- Serial output: Chord names (e.g., "C_major", "G_minor", "None")

### Camera Setup
- Connect USB camera
- Default camera index: 1 (change in `backend/main.py` if needed)
- Mediapipe will detect hand landmarks for strumming

### Audio Setup
- Chord sound files in `Hardware/PseudoGuitar/chord_sounds/`
- Format: `{chord}_{direction}.wav` (e.g., `C_major_down.wav`)
- Audio plays automatically when chord + strum detected

## API Endpoints

### Backend (`http://localhost:8000`)

- `GET /` - Health check
- `GET /video_feed` - MJPEG video stream
- `WebSocket /ws` - Real-time detection data
- `POST /start` - Start detection
- `POST /stop` - Stop detection

## Troubleshooting

### Backend Issues
- **Camera not opening**: Try changing camera index (0, 1, or 2) in `backend/main.py`
- **Serial port error**: Check port name in Device Manager (Windows) or `/dev/` (Mac/Linux)
- **Sound files not found**: Verify chord sound files are in `Hardware/PseudoGuitar/chord_sounds/`
- **Mediapipe errors**: Make sure all dependencies are installed: `pip install -r backend/requirements.txt`

### Frontend Issues
- **Video not loading**: Make sure backend is running on port 8000
- **WebSocket errors**: Check browser console and backend logs
- **CORS errors**: Backend CORS is configured for `localhost:3000`

### Hardware Issues
- **Arduino not detected**: Check USB connection and serial port
- **No chord detection**: Verify touch sensors are connected correctly
- **No strumming detection**: Make sure camera can see your hand clearly

## Development

### Build for Production

```bash
# Frontend
npm run build
npm start

# Backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## License

MIT

