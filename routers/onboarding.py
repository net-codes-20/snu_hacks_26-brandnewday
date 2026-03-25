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
        "You are an expert psychological profiler for the HabiTribe app. "
        "A user has submitted a 5-question onboarding quiz with these answers: " + ", ".join(quiz.answers) + ". "
        "Your goal is to categorize them into one of these Archetypes based on their answers leaning towards: "
        "- Warrior: Competitive\n"
        "- Guardian: Collaborative\n"
        "- Sage: Reflective\n"
        "- Spark: Energetic\n"
        "- Architect: Systems-thinker\n"
        "Return STRICT JSON with keys: 'archetype' (the assigned name) and 'quote' (a personalized one-sentence motivational quote)."
    )
    user_prompt = "Assign my Archetype based on the given answers."
    
    response_str = await get_ai_json_response(system_prompt, user_prompt)
    data = json.loads(response_str)
    
    return ArchetypeResponse(
        archetype=data.get("archetype", "Architect"),
        quote=data.get("quote", "We do not rise to the level of our goals. We fall to the level of our systems.")
    )
