from pydub import AudioSegment
import simpleaudio as sa
import threading
import time
import logging

logger = logging.getLogger("soundPlayback")

class RealTimeStrumPlayer:
    def __init__(self, file_path):
        self.sound = AudioSegment.from_file(file_path)
        self.duration_ms = len(self.sound)
        self.play_obj = None
        self.play_thread = None
        self.stop_event = threading.Event()
        self.current_progress = 0.0  # 0–1

    def play_segment(self, start_progress):
        # play a portion of the file from given progress
        start_ms = int(start_progress * self.duration_ms)
        segment = self.sound[start_ms:]
        try:
            play_obj = sa.play_buffer(
                segment.raw_data,
                num_channels=segment.channels,
                bytes_per_sample=segment.sample_width,
                sample_rate=segment.frame_rate
            )
            return play_obj
        except Exception as e:
            logger.warning(f"Failed to play audio segment: {e}")
            return None

    def start(self):
        # begin playback from start (non-blocking)
        self.stop_event.clear()
        try:
            self.play_obj = self.play_segment(0.0)
            self.play_thread = threading.Thread(target=self._monitor, daemon=True)
            self.play_thread.start()
        except Exception as e:
            logger.warning(f"Error starting playback: {e}")

    def _monitor(self):
        # keep playback running until stopped
        while not self.stop_event.is_set():
            time.sleep(0.01)
        if self.play_obj:
            self.play_obj.stop()

    def update_progress(self, progress):
        # update playback based on hand motion 
        # if progress jumps backward or exceeds 1, stop
        if progress < self.current_progress or progress >= 1.0:
            self.stop()
            return
        self.current_progress = progress

    def stop(self):
        self.stop_event.set()
