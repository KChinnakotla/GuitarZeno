# GuitarZeno Backend

FastAPI backend server for hardware integration with Arduino chord detection and Mediapipe strumming detection.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure your Arduino is connected and upload the `chord_detection_arduino.ino` sketch.

3. Update the serial port in `backend/main.py` if needed (default: `/dev/cu.usbserial-0001` for Mac, `COM3`/`COM4` for Windows).

4. Update the camera index in `backend/main.py` if needed (default: `1`).

## Running the Server

```bash
python backend/main.py
```

Or with uvicorn directly:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start on `http://localhost:8000`

## Endpoints

- `GET /` - Health check
- `GET /video_feed` - MJPEG video stream
- `WebSocket /ws` - Real-time detection data (chord, strumming, etc.)
- `POST /start` - Start detection
- `POST /stop` - Stop detection

## Hardware Requirements

- Arduino with touch sensors connected
- USB camera (index 1 by default)
- Audio output device (for chord sound playback)

## Troubleshooting

- If camera doesn't open, try changing the camera index (0, 1, or 2)
- If serial port fails, check the port name in Device Manager (Windows) or `/dev/` (Mac/Linux)
- Make sure chord sound files are in `Hardware/PseudoGuitar/chord_sounds/`

