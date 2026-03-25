from fastapi import APIRouter
from schemas.habit_schemas import ArchetypeQuestionnaire, ArchetypeResponse
from services.openai_service import get_ai_json_response
import json

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

@router.post("/archetype", response_model=ArchetypeResponse)
async def submit_archetype_quiz(quiz: ArchetypeQuestionnaire):
    """
    Evaluates the 5-question psych quiz and assigns a Habit Archetype.
    """
    system_prompt = (
        "You are an expert psychological profiler for HabiTribe. "
        "Analyze the user's answers and assign them exactly ONE of these 12 Archetypes: "
        "'The Warrior', 'The Architect', 'The Spark', 'The Sage', 'The Guardian', 'The Explorer', "
        "'The Caregiver', 'The Alchemist', 'The Anchor', 'The Visionary', 'The Optimist', 'The Artisan'. "
        "Strictly return a JSON object with two keys: "
        "'archetype': The assigned archetype name. "
        "'quote': A highly motivating, fun, Gen-Z styled quote (slang is encouraged, e.g., 'main character energy', 'no cap', 'let him cook') that fits their archetype."
    )
    user_prompt = "Assign my Archetype based on the given answers."
    
    response_str = await get_ai_json_response(system_prompt, user_prompt)
    data = json.loads(response_str)
    
    return ArchetypeResponse(
        archetype=data.get("archetype", "Architect"),
        quote=data.get("quote", "We do not rise to the level of our goals. We fall to the level of our systems.")
    )
