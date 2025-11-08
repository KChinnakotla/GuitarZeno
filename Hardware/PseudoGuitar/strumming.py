import cv2
import mediapipe as mp
import time
import numpy as np
from collections import deque
from soundPlayback import RealTimeStrumPlayer
from chordDetection import ChordDetector


# mode settings
AUTO_INIT = False  # True = use INIT_FRAMES to calculate thresholds, False = use manual values

# Manual threshold values (used when AUTO_INIT=False)
manual_velocity_threshold = 0.02
manual_thumb_noise_threshold = 0.05 #good threshold
manual_strum_distance = 0.3 #need to play with this-->audio is getting cut off. also look into residual noise


# hyperparameters
INIT_FRAMES = 10     # Frames used for initialization (thresholds)
STRUM_FRAMES = 5     # Frames used for gesture stability detection (~5 strums/sec)
COOLDOWN = 0.2       # Seconds between strums
MAX_STRUM_DURATION = 4.0  # Timeout for incomplete strum


# initialize mediapipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

# initialzie variables
hand_positions = deque(maxlen=INIT_FRAMES)
velocities = deque(maxlen=INIT_FRAMES)
thumb_distances = deque(maxlen=INIT_FRAMES)

initialized = False
velocity_threshold = manual_velocity_threshold
thumb_noise_threshold = manual_thumb_noise_threshold
strum_distance = manual_strum_distance

prev_hand_center = None
initial_thumb_extended = None
gesture_window = deque(maxlen=STRUM_FRAMES)
last_strum_time = 0
strum_start_time = None
expected_direction_down = True
last_successful_strum_direction = None

strum_in_progress = False
strum_total_distance = strum_distance 
current_player = None
strum_start_y = None

# video capture
cap = cv2.VideoCapture(1) #Always keep as 1


# initialzie chord detector
detector = ChordDetector(port='/dev/cu.usbserial-0001', baud_rate=115200)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    
    


    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)


            # get bounding box height to adjust strum distance dynamically
            x_vals = [lm.x for lm in hand_landmarks.landmark]
            y_vals = [lm.y for lm in hand_landmarks.landmark]
            hand_height = max(y_vals) - min(y_vals)
            ref_hand_height = 0.25  # adjust based on the average playing distance
            adjusted_strum_distance = manual_strum_distance * (ref_hand_height / hand_height)
            strum_distance = np.clip(adjusted_strum_distance, 0.1, 0.6)
            strum_total_distance = strum_distance

            # hand center (midpoint between landmarks 9 and 13)
            lm9 = hand_landmarks.landmark[9]
            lm13 = hand_landmarks.landmark[13]
            center_x = (lm9.x + lm13.x) / 2
            center_y = (lm9.y + lm13.y) / 2
            hand_center = np.array([center_x, center_y])

            # thumb distance (landmarks 4 and 5)
            lm4 = hand_landmarks.landmark[4]
            lm5 = hand_landmarks.landmark[5]
            thumb_distance = abs(lm4.y - lm5.y)

            # iniitialization phase
            #only intialzie strum distance and current thumb position. velocity and thumb threshold are good as manual values for now
            if AUTO_INIT and not initialized:
                hand_positions.append(hand_center)
                velocities.append(0)
                thumb_distances.append(thumb_distance)

                if len(hand_positions) == INIT_FRAMES:
                    # Compute thresholds automatically
                    #velocity_threshold = np.mean([abs(hand_positions[i][1] - hand_positions[i-1][1])
                    #                            for i in range(1, INIT_FRAMES)])
                    #thumb_noise_threshold = np.mean(thumb_distances)
                    lm17 = hand_landmarks.landmark[17]
                    strum_distance = 1.5 * abs(lm5.y - lm17.y)  # approximate hand length
                    initial_thumb_extended = thumb_distance > thumb_noise_threshold
                    prev_hand_center = hand_center
                    initialized = True

                continue  # skip detection until initialized

            # calculate y-direction velocity
            if prev_hand_center is None:
                prev_hand_center = hand_center
                continue
            vel_y = hand_center[1] - prev_hand_center[1]
            velocities.append(vel_y)
            smoothed_velocity = np.mean(list(velocities))
            current_direction_down = smoothed_velocity > 0  # True = down, False = up

            prev_hand_center = hand_center

            # Update strum playback while the strum is in progress
            if strum_in_progress and current_player:
                # Compute how far the hand has moved along the strum
                if current_direction_down:  # down strum
                    distance_covered = hand_center[1] - strum_start_y
                else:  # up strum
                    distance_covered = strum_start_y - hand_center[1]

                # Normalize progress 0 → 1
                progress = np.clip(distance_covered / strum_total_distance, 0, 1)

                # Update playback position
                current_player.update_progress(progress)

                # Stop playback if full distance reached
                if progress >= 1.0:
                    current_player.stop()
                    strum_in_progress = False

            # stabilize gesture
            gesture_window.append(current_direction_down)
            stable_motion = len(gesture_window) == STRUM_FRAMES and all(x == current_direction_down for x in gesture_window)

            # hand sign direction logic
            # Thumb extended = Upstroke, Thumb retracted = Downstroke
            thumb_extended = thumb_distance > thumb_noise_threshold
            thumb_direction_down = not thumb_extended
            valid_thumb_motion = thumb_direction_down == current_direction_down

            # check strum conditions
            if len(hand_positions) == 0:
                hand_positions.append(hand_center)
                continue
            distance_moved = abs(hand_center[1] - hand_positions[-1][1])
            current_time = time.time()

            # 4-second timeout
            if strum_start_time and current_time - strum_start_time > MAX_STRUM_DURATION:
                prev_hand_center = hand_positions[-1]
                gesture_window.clear()
                strum_start_time = None

            # Prevent consecutive strums in same direction without reset
            consecutive_same_direction = last_successful_strum_direction == current_direction_down

            # Only start strum if stable, velocity threshold exceeded, cooldown passed, and not consecutive same direction
            if stable_motion and abs(smoothed_velocity) > velocity_threshold and current_time - last_strum_time > COOLDOWN and not consecutive_same_direction:
                strum_start_time = current_time
                last_strum_time = current_time

                if valid_thumb_motion and current_direction_down == expected_direction_down:
                    # Successful strum
                    print(f"Successful strum! Direction: {'Down' if current_direction_down else 'Up'} Time: {strum_start_time}")
                    # TODO: play sound here based on smoothed_velocity
                    # detect chord to play
                    chord = detector.get_current_chord()

                    if chord == "None" or chord == "":
                            # No valid chord detected, skip playing sound
                            current_player = None
                            strum_in_progress = False
                            print("No chord detected. Skipping sound.")

                    else:
                        ## if its down strum add _down else _up
                        if current_direction_down:
                            file_path = chord + "_down.wav"
                        else:
                            file_path = chord + "_up.wav"
                        file_path = "chord_sounds/" + file_path

                        current_player = RealTimeStrumPlayer(file_path)
                        current_player.start()
                        strum_start_y = hand_center[1]
                        strum_in_progress = True
                    
                    hand_positions.append(hand_center)
                    expected_direction_down = not expected_direction_down  # toggle expected direction
                    last_successful_strum_direction = current_direction_down
                    gesture_window.clear()
                else:
                    # Mismatched thumb: Successful reset
                    #print(f"Successful reset. Direction attempted: {'Down' if current_direction_down else 'Up'}")
                    if current_player:
                        current_player.stop()
                        strum_in_progress = False
                        current_player = None
                    hand_positions.append(hand_center)
                    expected_direction_down = not expected_direction_down
                    gesture_window.clear()
                    # reset last strum direction so next strum in either direction is allowed
                    last_successful_strum_direction = None

            # visualize on opencv window
            h, w, _ = frame.shape
            cx, cy = int(center_x * w), int(center_y * h)
            cv2.circle(frame, (cx, cy), 8, (0, 255, 0), -1)
            cv2.putText(frame, f"Vel: {smoothed_velocity:.3f}", (30, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            cv2.putText(frame, f"Dir: {'Down' if current_direction_down else 'Up'}", (30, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            cv2.putText(frame, f"Thumb extended: {thumb_extended}", (30, 110),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    cv2.imshow('PseudoGuitar Hand Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    #cv2.putText(frame, f"Hand size: {hand_height:.3f}", (30, 140),
            #cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    #cv2.putText(frame, f"Adj Dist: {strum_distance:.3f}", (30, 170),
            #cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)


cap.release()
cv2.destroyAllWindows()