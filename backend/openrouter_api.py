import os
import requests

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")  # set key 


def get_chord_progression(song_name: str) -> str:
    prompt = f"You are a guitar teacher. Give the chord progression for the song '{song_name}' in a simple list, using standard guitar chord names."
    messages = [
        {"role": "system", "content": "You are a helpful guitar teacher."},
        {"role": "user", "content": prompt}
    ]
    return call_openrouter(messages)


def get_feedback(played_chord: str, expected_chord: str) -> str:
    prompt = f"The student played '{played_chord}', but the expected chord was '{expected_chord}'. Give short feedback (correct/incorrect, and a tip if wrong)."
    messages = [
        {"role": "system", "content": "You are a helpful guitar teacher."},
        {"role": "user", "content": prompt}
    ]
    return call_openrouter(messages)


def get_song_recommendation(query: str) -> str:
    prompt = f"Suggest a popular guitar song to learn based on: {query}. Give the song name and artist."
    messages = [
        {"role": "system", "content": "You are a helpful guitar teacher."},
        {"role": "user", "content": prompt}
    ]
    return call_openrouter(messages)


def call_openrouter(messages):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "openai/gpt-3.5-turbo",  
        "messages": messages,
        "max_tokens": 128
    }
    response = requests.post(OPENROUTER_API_URL, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        return result["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.text}"
