# test_chord_detection.py
from chordDetection import ChordDetector
import time

detector = ChordDetector(port='/dev/cu.usbserial-0001', baud_rate=115200)

try:
    while True:
        print("Current Chord:", detector.get_current_chord())
        time.sleep(0.5)
except KeyboardInterrupt:
    detector.stop()
