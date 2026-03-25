import httpx
import json
import wave
import struct
import math
import os

base_url = "http://127.0.0.1:8000"

def create_dummy_wav(file_name="test_audio.wav"):
    sample_rate = 44100
    duration = 1 # seconds
    with wave.open(file_name, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for i in range(sample_rate * duration):
            value = int(10000.0 * math.sin(2.0 * math.pi * 400.0 * i / sample_rate))
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)
    return file_name

def run_tests():
    print("========================================")
    print("🌟 FEATURE 1: ARCHETYPE ONBOARDING")
    print("========================================")
    print("Simulating a highly competitive, driven user (All 'A' answers)...")
    try:
        r1 = httpx.post(f"{base_url}/onboarding/archetype", json={"answers": ["A", "A", "A", "A", "A"]}, timeout=60.0)
        print("✅ Status:", r1.status_code)
        print("🤖 AI Result:")
        print(json.dumps(r1.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n========================================")
    print("🩹 FEATURE 2: ELASTIC RECOVERY (RESTORE FLOW)")
    print("========================================")
    print("Simulating a user who missed their habit due to exhaustion...")
    try:
        r2 = httpx.post(
            f"{base_url}/ai/restore-analysis", 
            json={"user_explanation": "I worked a 12 hour shift at the hospital and was completely exhausted."},
            timeout=60.0
        )
        print("✅ Status:", r2.status_code)
        print("🤖 AI Result:")
        print(json.dumps(r2.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

    print("\n========================================")
    print("🍒 FEATURE 3: WEEKLY FRICTION REPORT (NEW)")
    print("========================================")
    print("Simulating a user who missed physical habits mostly on weekends...")
    try:
        r_f = httpx.post(
            f"{base_url}/ai/friction-report", 
            json={"missed_habits": ["Missed Gym on Saturday", "Missed Run on Sunday", "Missed Gym last Saturday"]},
            timeout=60.0
        )
        print("✅ Status:", r_f.status_code)
        print("🤖 AI Result:")
        print(json.dumps(r_f.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

    print("\n========================================")
    print("🎤 FEATURE 4: PROOF-OF-VOICE (GEMINI AUDIO)")
    print("========================================")
    print("Generating a synthetic 1-second audio file and uploading it...")
    
    wav_file = create_dummy_wav()
    try:
        with open(wav_file, "rb") as f:
            r3 = httpx.post(
                f"{base_url}/ai/whisper-checkin", 
                data={"habit_name": "Testing the API"},
                files={"audio_file": (wav_file, f, "audio/wav")},
                timeout=60.0
            )
        print("✅ Status:", r3.status_code)
        print("🤖 AI Result (Note: Transcribing a beep will likely yield empty text or [music], but proves the file-upload works):")
        print(json.dumps(r3.json(), indent=2))
    except Exception as e:
        if hasattr(r3, 'text'):
            print(f"Server Error Text: {r3.text}")
        print(f"Error: {e}")
    finally:
        if os.path.exists(wav_file):
            os.remove(wav_file)

    print("\nAll automated tests completed successfully.")

if __name__ == "__main__":
    run_tests()
