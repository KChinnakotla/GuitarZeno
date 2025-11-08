"""
FastAPI backend for GuitarZeno hardware integration
Handles video streaming, chord detection, and strumming detection
"""
import asyncio
import base64
import cv2
import json
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import mediapipe as mp
import serial
import threading
import time
from collections import deque
from typing import Optional
import sys
import os

# Add Hardware directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'Hardware', 'PseudoGuitar'))

try:
    from chordDetection import ChordDetector
    from soundPlayback import RealTimeStrumPlayer
except ImportError:
    print("Warning: Could not import hardware modules. Running in mock mode.")
    ChordDetector = None
    RealTimeStrumPlayer = None

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
video_capture: Optional[cv2.VideoCapture] = None
hands_detector = None
mp_hands = None
mp_drawing = None
chord_detector: Optional[ChordDetector] = None
active_connections = set()
is_running = False

# Strumming detection variables
hand_positions = deque(maxlen=10)
velocities = deque(maxlen=10)
thumb_distances = deque(maxlen=10)
prev_hand_center = None
gesture_window = deque(maxlen=5)
last_strum_time = 0
strum_start_time = None
expected_direction_down = True
last_successful_strum_direction = None
strum_in_progress = False
strum_total_distance = 0.3
current_player = None
strum_start_y = None

# Settings
manual_velocity_threshold = 0.02
manual_thumb_noise_threshold = 0.05
manual_strum_distance = 0.3
INIT_FRAMES = 10
STRUM_FRAMES = 5
COOLDOWN = 0.2
MAX_STRUM_DURATION = 4.0
velocity_threshold = manual_velocity_threshold
thumb_noise_threshold = manual_thumb_noise_threshold
strum_distance = manual_strum_distance

def initialize_hardware():
    """Initialize Mediapipe and camera"""
    global hands_detector, mp_hands, mp_drawing, video_capture, chord_detector
    
    # Initialize Mediapipe
    try:
        mp_hands = mp.solutions.hands
        hands_detector = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        mp_drawing = mp.solutions.drawing_utils
        print("Mediapipe initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize Mediapipe: {e}")
        hands_detector = None
        mp_hands = None
        mp_drawing = None
    
    # Initialize camera (try different indices)
    for cam_idx in [1, 0, 2]:
        cap = cv2.VideoCapture(cam_idx)
        if cap.isOpened():
            video_capture = cap
            print(f"Camera opened at index {cam_idx}")
            break
    
    if video_capture is None:
        print("Warning: Could not open camera. Running in mock mode.")
        return False
    
    # Initialize chord detector (try different ports)
    if ChordDetector:
        try:
            # Try common serial ports
            ports = ['/dev/cu.usbserial-0001', '/dev/ttyUSB0', 'COM3', 'COM4']
            for port in ports:
                try:
                    chord_detector = ChordDetector(port=port, baud_rate=115200)
                    print(f"Chord detector initialized on {port}")
                    break
                except:
                    continue
            if chord_detector is None:
                print("Warning: Could not initialize chord detector. Running without it.")
        except Exception as e:
            print(f"Warning: Chord detector error: {e}")
    
    return True

def process_frame(frame):
    """Process a single frame for hand detection and strumming"""
    global prev_hand_center, gesture_window, last_strum_time, strum_start_time
    global expected_direction_down, last_successful_strum_direction
    global strum_in_progress, current_player, strum_start_y, strum_total_distance
    
    if hands_detector is None:
        # Return frame with no processing if Mediapipe not initialized
        return frame, {
            "chord": "None",
            "strum_direction": None,
            "strum_detected": False,
            "velocity": 0.0,
            "thumb_extended": False
        }
    
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(rgb_frame)
    
    detected_chord = "None"
    strum_direction = None
    strum_detected = False
    velocity = 0.0
    thumb_extended = False
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            if mp_drawing and mp_hands:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Get bounding box height
            x_vals = [lm.x for lm in hand_landmarks.landmark]
            y_vals = [lm.y for lm in hand_landmarks.landmark]
            hand_height = max(y_vals) - min(y_vals)
            ref_hand_height = 0.25
            adjusted_strum_distance = manual_strum_distance * (ref_hand_height / hand_height)
            strum_distance = np.clip(adjusted_strum_distance, 0.1, 0.6)
            strum_total_distance = strum_distance
            
            # Hand center
            lm9 = hand_landmarks.landmark[9]
            lm13 = hand_landmarks.landmark[13]
            center_x = (lm9.x + lm13.x) / 2
            center_y = (lm9.y + lm13.y) / 2
            hand_center = np.array([center_x, center_y])
            
            # Thumb distance
            lm4 = hand_landmarks.landmark[4]
            lm5 = hand_landmarks.landmark[5]
            thumb_distance = abs(lm4.y - lm5.y)
            thumb_extended = thumb_distance > thumb_noise_threshold
            
            # Calculate velocity
            if prev_hand_center is not None:
                vel_y = hand_center[1] - prev_hand_center[1]
                velocities.append(vel_y)
                smoothed_velocity = np.mean(list(velocities)) if velocities else 0
                velocity = smoothed_velocity
                current_direction_down = smoothed_velocity > 0
            else:
                prev_hand_center = hand_center
                current_direction_down = True
            
            # Update strum playback
            if strum_in_progress and current_player:
                if current_direction_down:
                    distance_covered = hand_center[1] - strum_start_y
                else:
                    distance_covered = strum_start_y - hand_center[1]
                progress = np.clip(distance_covered / strum_total_distance, 0, 1)
                current_player.update_progress(progress)
                if progress >= 1.0:
                    current_player.stop()
                    strum_in_progress = False
            
            # Stabilize gesture
            gesture_window.append(current_direction_down)
            stable_motion = len(gesture_window) == STRUM_FRAMES and all(x == current_direction_down for x in gesture_window)
            
            # Thumb direction logic
            thumb_direction_down = not thumb_extended
            valid_thumb_motion = thumb_direction_down == current_direction_down
            
            # Check strum conditions
            distance_moved = abs(hand_center[1] - prev_hand_center[1]) if prev_hand_center is not None else 0
            current_time = time.time()
            
            # Timeout
            if strum_start_time and current_time - strum_start_time > MAX_STRUM_DURATION:
                prev_hand_center = hand_center
                gesture_window.clear()
                strum_start_time = None
            
            consecutive_same_direction = last_successful_strum_direction == current_direction_down
            
            # Detect strum
            if stable_motion and abs(velocity) > velocity_threshold and current_time - last_strum_time > COOLDOWN and not consecutive_same_direction:
                strum_start_time = current_time
                last_strum_time = current_time
                
                if valid_thumb_motion and current_direction_down == expected_direction_down:
                    # Successful strum
                    strum_detected = True
                    strum_direction = "down" if current_direction_down else "up"
                    
                    # Get chord
                    if chord_detector:
                        detected_chord = chord_detector.get_current_chord() or "None"
                    else:
                        detected_chord = "None"
                    
                    if detected_chord != "None" and detected_chord != "":
                        # Play sound
                        if current_player:
                            current_player.stop()
                        
                        # Get the base directory (parent of backend)
                        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                        file_path = os.path.join(base_dir, "Hardware", "PseudoGuitar", "chord_sounds", f"{detected_chord}_{strum_direction}.wav")
                        
                        if os.path.exists(file_path) and RealTimeStrumPlayer:
                            try:
                                current_player = RealTimeStrumPlayer(file_path)
                                current_player.start()
                                strum_start_y = hand_center[1]
                                strum_in_progress = True
                            except Exception as e:
                                print(f"Error playing sound: {e}")
                        else:
                            print(f"Sound file not found: {file_path}")
                    
                    hand_positions.append(hand_center)
                    expected_direction_down = not expected_direction_down
                    last_successful_strum_direction = current_direction_down
                    gesture_window.clear()
                else:
                    # Reset
                    if current_player:
                        current_player.stop()
                        strum_in_progress = False
                        current_player = None
                    hand_positions.append(hand_center)
                    expected_direction_down = not expected_direction_down
                    gesture_window.clear()
                    last_successful_strum_direction = None
            
            prev_hand_center = hand_center
            
            # Draw visualization
            h, w, _ = frame.shape
            cx, cy = int(center_x * w), int(center_y * h)
            cv2.circle(frame, (cx, cy), 8, (0, 255, 0), -1)
            cv2.putText(frame, f"Vel: {velocity:.3f}", (30, 50),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            cv2.putText(frame, f"Dir: {'Down' if current_direction_down else 'Up'}", (30, 80),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            cv2.putText(frame, f"Thumb: {'Extended' if thumb_extended else 'Retracted'}", (30, 110),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    
    # Get current chord even if no hand detected
    if chord_detector:
        detected_chord = chord_detector.get_current_chord() or "None"
    
    return frame, {
        "chord": detected_chord,
        "strum_direction": strum_direction,
        "strum_detected": strum_detected,
        "velocity": float(velocity),
        "thumb_extended": thumb_extended
    }

def generate_frames():
    """Generator for video frames"""
    global video_capture, is_running
    
    if video_capture is None:
        # Return a black frame if no camera
        while is_running:
            black_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(black_frame, "Camera not available", (150, 240),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            _, buffer = cv2.imencode('.jpg', black_frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.033)  # ~30 FPS
        return
    
    while is_running:
        ret, frame = video_capture.read()
        if not ret:
            # Try to reinitialize camera
            time.sleep(0.1)
            continue
        
        try:
            processed_frame, detection_data = process_frame(frame)
            
            # Encode frame
            _, buffer = cv2.imencode('.jpg', processed_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except Exception as e:
            print(f"Error processing frame: {e}")
            time.sleep(0.1)
            continue

@app.on_event("startup")
async def startup_event():
    """Initialize hardware on startup"""
    global is_running
    is_running = True
    initialize_hardware()

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global is_running, video_capture, chord_detector, current_player
    is_running = False
    
    if current_player:
        current_player.stop()
    
    if video_capture:
        video_capture.release()
    
    if chord_detector:
        chord_detector.stop()
    
    cv2.destroyAllWindows()

@app.get("/")
async def root():
    return {"status": "GuitarZeno Backend", "hardware_initialized": video_capture is not None}

@app.get("/video_feed")
async def video_feed():
    """MJPEG video stream endpoint"""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data"""
    await websocket.accept()
    active_connections.add(websocket)
    
    last_frame_time = 0
    frame_interval = 1.0 / 10  # 10 Hz
    
    try:
        while is_running:
            current_time = time.time()
            if current_time - last_frame_time >= frame_interval:
                # Send detection data periodically
                if video_capture:
                    ret, frame = video_capture.read()
                    if ret:
                        try:
                            _, detection_data = process_frame(frame)
                            await websocket.send_json(detection_data)
                            last_frame_time = current_time
                        except Exception as e:
                            print(f"Error processing frame for WebSocket: {e}")
                
                # Also send current chord if available
                if chord_detector:
                    chord = chord_detector.get_current_chord() or "None"
                    if chord != "None":
                        await websocket.send_json({
                            "chord": chord,
                            "strum_direction": None,
                            "strum_detected": False,
                            "velocity": 0.0,
                            "thumb_extended": False
                        })
            
            await asyncio.sleep(0.05)  # Check every 50ms
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        active_connections.remove(websocket)

@app.post("/start")
async def start_detection():
    """Start detection"""
    global is_running
    is_running = True
    return {"status": "started"}

@app.post("/stop")
async def stop_detection():
    """Stop detection"""
    global is_running
    is_running = False
    return {"status": "stopped"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

