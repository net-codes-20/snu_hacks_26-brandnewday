import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the new free-tier Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def transcribe_audio(file_path: str) -> str:
    """Uses Gemini 1.5 Flash to transcribe audio (Perfect free replacement for Whisper)."""
    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return "Simulated Transcription: I read a book for 20 minutes today."
        
    try:
        audio_file = genai.upload_file(path=file_path)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([
            "Please provide a highly accurate text transcription of this audio. Return ONLY the transcribed text.", 
            audio_file
        ])
        audio_file.delete()
        return response.text
    except Exception as e:
        print(f"Gemini API Transcription Error: {e}. Falling back to simulated response.")
        return "Simulated Transcription: I read a book for 20 minutes today."

async def get_ai_json_response(system_prompt: str, user_prompt: str) -> str:
    """Uses Gemini 1.5 Flash to get a structured JSON response."""
    def get_simulated_json():
        if "Archetype" in system_prompt:
            return '{"archetype": "Warrior", "quote": "Victory is reserved for those willing to pay its price."}'
        if "Restore" in system_prompt:
            return '{"friction_type": "Time", "new_intention": "Tomorrow, I will make time right after breakfast."}'
        return '{"is_valid": true, "story_card": "User completed their habit."}'

    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return get_simulated_json()

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        full_prompt = f"SYSTEM INSTRUCTION: {system_prompt}\n\nUSER PROMPT: {user_prompt}"
        
        response = model.generate_content(
            full_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}. Falling back to simulated response.")
        return get_simulated_json()

