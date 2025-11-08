from pydub import AudioSegment

sound = AudioSegment.from_file("Achord.wav")
clip = sound[:900]  # from 2.0s to 2.5s
clip.export("A_up.wav", format="wav")

