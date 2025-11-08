# chordDetection.py
import serial
import threading

class ChordDetector:
    def __init__(self, port='/dev/cu.usbserial-0001', baud_rate=115200):
        # initialize serial connection to Arduino
        self.port = port
        self.baud_rate = baud_rate
        self.current_chord = None
        self.running = True
        self.thread = threading.Thread(target=self._read_serial, daemon=True)
        self.thread.start()

    def _read_serial(self):
        # continuously read from serial port
        try:
            with serial.Serial(self.port, self.baud_rate, timeout=1) as ser:
                print(f"[ChordDetector] Connected to {self.port} at {self.baud_rate} baud.")
                while self.running:
                    if ser.in_waiting > 0:
                        line = ser.readline().decode('utf-8', errors='ignore').strip()
                        if line:
                            # Store the latest valid chord
                            self.current_chord = line
                            print(f"[ChordDetector] Current chord: {line}")
        except serial.SerialException as e:
            print(f"[ChordDetector] Serial error: {e}")

    def get_current_chord(self):
        # return the latest detected chord
        return self.current_chord 

    def stop(self):
        # stop the serial reading thread
        self.running = False
        print("[ChordDetector] Stopped reading serial input.")
