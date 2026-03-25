from pydantic import BaseModel, Field
from typing import List

class ArchetypeQuestionnaire(BaseModel):
    answers: List[str] = Field(..., description="Array of 5 answers from the user quiz (e.g., ['A', 'C', 'B', 'A', 'D'])")

class ArchetypeResponse(BaseModel):
    archetype: str
    quote: str

class VoiceCheckInResponse(BaseModel):
    transcription: str
    is_valid: bool
    story_card: str

class RestoreFlowRequest(BaseModel):
    user_explanation: str

class RestoreFlowResponse(BaseModel):
    friction_type: str
    new_intention: str

class FrictionReportRequest(BaseModel):
    missed_habits: List[str] = Field(..., description="Array of specific habits the user missed this week (e.g., ['Missed Gym on Tuesday']).")

class FrictionReportResponse(BaseModel):
    friction_pattern: str
    growth_advice: str
