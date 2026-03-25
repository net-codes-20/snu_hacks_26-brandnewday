from fastapi import APIRouter, File, UploadFile, Form
from schemas.habit_schemas import VoiceCheckInResponse
from services.openai_service import transcribe_audio, get_ai_json_response
import shutil
import os
import json

router = APIRouter(prefix="/ai", tags=["Voice Verification"])

@router.post("/whisper-checkin", response_model=VoiceCheckInResponse)
async def whisper_checkin(
    habit_name: str = Form(...),
    audio_file: UploadFile = File(...)
):
    """
    Takes an audio file, transcribes it via Whisper, and checks if it matches the habit.
    """
    temp_file_path = f"temp_{audio_file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)
        
    try:
        # Transcribe Audio
        transcription_text = await transcribe_audio(temp_file_path)
        
        # Validate Semantics
        system_prompt = (
            "You are an AI habit validator for the 'HabiTribe' app. "
            "You will receive a transcription of a user's voice log, and the habit they are supposed to perform. "
            "Your job is to determine if the transcription provides proof that they did the habit. "
            "Respond strictly in JSON format with two keys: 'is_valid' (boolean) and 'story_card' (a short, exciting 1-sentence summary of what they did, to be posted to the social feed)."
        )
        user_prompt = f"Habit: '{habit_name}'\nVoice Transcription: '{transcription_text}'"
        
        ai_response_str = await get_ai_json_response(system_prompt, user_prompt)
        ai_data = json.loads(ai_response_str)
        
        return VoiceCheckInResponse(
            transcription=transcription_text, # Assuming transcription returns an object or a string depending on mock
            is_valid=ai_data.get("is_valid", False),
            story_card=ai_data.get("story_card", "User logged their habit via voice.")
        )
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@router.post("/transcribe")
async def extract_transcript(audio_file: UploadFile = File(...)):
    """Generic Whisper transcription endpoint for Voice Journaling and Restore flows."""
    temp_file_path = f"temp_{audio_file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)
    try:
        text = await transcribe_audio(temp_file_path)
        return {"text": text}
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
