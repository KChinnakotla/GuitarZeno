# chordDetection.py
import serial
import threading
import logging

logger = logging.getLogger("chordDetection")


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
                logger.info(f"Connected to {self.port} at {self.baud_rate} baud.")
                while self.running:
                    if ser.in_waiting > 0:
                        line = ser.readline().decode('utf-8', errors='ignore').strip()
                        if line:
                            # Store the latest valid chord and only log when it changes
                            if line != self.current_chord:
                                self.current_chord = line
                                logger.info(f"Current chord: {line}")
        except serial.SerialException as e:
            logger.warning(f"Serial error: {e}")

    def get_current_chord(self):
        # return the latest detected chord
        return self.current_chord

    def stop(self):
        # stop the serial reading thread
        self.running = False
        logger.info("Stopped reading serial input.")
