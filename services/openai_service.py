import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the new free-tier Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def transcribe_audio(file_path: str) -> str:
    """Uses Gemini 1.5 Flash to transcribe audio."""
    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return "Error: API Key Missing."
        
    try:
        audio_file = genai.upload_file(path=file_path)
        
        while audio_file.state.name == "PROCESSING":
            time.sleep(1)
            audio_file = genai.get_file(audio_file.name)
            
        if audio_file.state.name == "FAILED":
            audio_file.delete()
            return "API Error: Audio file processing failed in Gemini backend."
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content([
            "Please provide a highly accurate text transcription of this audio. Return ONLY the transcribed text without quotes or markdown.", 
            audio_file
        ])
        audio_file.delete()
        if hasattr(response, 'text') and response.text:
            return response.text.replace('```', '').strip()
        else:
            return "No voice heard. Please speak clearly."
    except Exception as e:
        print(f"Gemini API Transcription Error: {e}")
        return f"API Error: {str(e)}"

async def get_ai_json_response(system_prompt: str, user_prompt: str) -> str:
    """Uses Gemini 1.5 Flash to get a structured JSON response."""
    def get_simulated_json():
        if "Archetype" in system_prompt:
            return '{"archetype": "The Spark", "quote": "main character energy only today ✨ no cap, you got this!"}'
        if "Restore" in system_prompt:
            return '{"friction_type": "Time", "new_intention": "Tomorrow, I will make time right after breakfast."}'
        return '{"is_valid": true, "story_card": "User completed their habit."}'

    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return get_simulated_json()

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        full_prompt = f"SYSTEM INSTRUCTION: {system_prompt}\n\nUSER PROMPT: {user_prompt}"
        
        response = model.generate_content(
            full_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}. Falling back to simulated response.")
        return get_simulated_json()

