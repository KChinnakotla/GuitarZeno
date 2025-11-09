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
        self._fade_out_requested = False
        self._lock = threading.Lock()

    def play_segment(self, start_progress):
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
        self.stop()  # Ensure previous playback is stopped
        self.stop_event.clear()
<<<<<<< Updated upstream
        try:
            self.play_obj = self.play_segment(0.0)
            self.play_thread = threading.Thread(target=self._monitor, daemon=True)
            self.play_thread.start()
        except Exception as e:
            logger.warning(f"Error starting playback: {e}")
=======
        self._fade_out_requested = False
        self.play_obj = self.play_segment(0.0)
        self.play_thread = threading.Thread(target=self._monitor)
        self.play_thread.start()
>>>>>>> Stashed changes

    def _monitor(self):
        while not self.stop_event.is_set():
            time.sleep(0.01)
        # Fade out if requested
        if self._fade_out_requested:
            faded = self.sound.fade_out(1000)
            fade_play = sa.play_buffer(
                faded.raw_data,
                num_channels=faded.channels,
                bytes_per_sample=faded.sample_width,
                sample_rate=faded.frame_rate
            )
            time.sleep(1)
            fade_play.stop()
        if self.play_obj:
            self.play_obj.stop()

    def update_progress(self, progress):
        if progress < self.current_progress or progress >= 1.0:
            self.stop()
            return
        self.current_progress = progress

    def stop(self, fade_out_ms=1000):
        with self._lock:
            if self.play_thread and self.play_thread.is_alive():
                self._fade_out_requested = True
                self.stop_event.set()
                self.play_thread.join()
            elif self.play_obj:
                self.play_obj.stop()
        self.play_obj = None
        self.play_thread = None
        self.stop_event.clear()
        self._fade_out_requested = False
