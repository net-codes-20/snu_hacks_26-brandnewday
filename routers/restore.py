from fastapi import APIRouter
from schemas.habit_schemas import RestoreFlowRequest, RestoreFlowResponse
from services.openai_service import get_ai_json_response
import json

router = APIRouter(prefix="/ai", tags=["Elastic Recovery"])

@router.post("/restore-analysis", response_model=RestoreFlowResponse)
async def restore_analysis(request: RestoreFlowRequest):
    """
    The Elastic Recovery flow: takes the user's excuse for missing a habit and provides a compassionate 'Implementation Intention'.
    """
    system_prompt = (
        "You are an empathetic behavioral psychology AI for HabiTribe. "
        "A user has missed their habit today. They will explain why. "
        "Do NOT punish them. "
        "Please categorize the friction into one of these types: 'Energy/Fatigue', 'Time', 'Environment', 'Emotional/Stress', or 'Other'. "
        "Then, generate a short, compassionate 'new_intention' for tomorrow in the format 'Tomorrow, I will...'. "
        "Return strictly JSON with keys 'friction_type' and 'new_intention'."
    )
    user_prompt = f"User Explanation: '{request.user_explanation}'"
    
    ai_response_str = await get_ai_json_response(system_prompt, user_prompt)
    ai_data = json.loads(ai_response_str)
    
    return RestoreFlowResponse(
        friction_type=ai_data.get("friction_type", "Other"),
        new_intention=ai_data.get("new_intention", "Tomorrow, I will try again with a renewed spirit.")
    )
