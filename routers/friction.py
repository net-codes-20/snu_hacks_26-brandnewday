from fastapi import APIRouter
from schemas.habit_schemas import FrictionReportRequest, FrictionReportResponse
from services.openai_service import get_ai_json_response
import json

router = APIRouter(prefix="/ai", tags=["Friction Report"])

@router.post("/friction-report", response_model=FrictionReportResponse)
async def generate_friction_report(request: FrictionReportRequest):
    """
    Takes an array of missed habits over the week and generates a personalized growth advice snippet.
    """
    system_prompt = (
        "You are an expert habit coach AI for HabiTribe. "
        "The user will provide a list of habits they failed to complete this week. "
        "Your goal is to identify a pattern in their friction. "
        "Strictly return a JSON object with two keys: "
        "'friction_pattern': A 1-sentence observation about what they struggle with. "
        "'growth_advice': A constructive, actionable 1-sentence suggestion to fix it next week."
    )
    
    if not request.missed_habits:
        return FrictionReportResponse(
            friction_pattern="You completed all your habits this week!",
            growth_advice="Incredible consistency. You are a true master of your routine."
        )

    user_prompt = "Missed Habits this week: " + ", ".join(request.missed_habits)
    ai_response_str = await get_ai_json_response(system_prompt, user_prompt)
    
    try:
        ai_data = json.loads(ai_response_str)
    except json.JSONDecodeError:
        # Fallback if AI somehow fails to return valid JSON
        ai_data = {
            "friction_pattern": "I notice you've had a few hurdles this week.",
            "growth_advice": "Let's try scaling these habits down so they feel easier next week!"
        }
        
    return FrictionReportResponse(
        friction_pattern=ai_data.get("friction_pattern", "Pattern uncategorized."),
        growth_advice=ai_data.get("growth_advice", "Keep pushing forward!")
    )
