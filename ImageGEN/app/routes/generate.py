from fastapi import APIRouter, HTTPException
from app.models.request_models import GenerateRequest
from app.services.gemini_service import generate_image
from app.prompts.object_prompts import PROMPT_MAP
import base64

router = APIRouter()


@router.post("/generate")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    if object_type not in PROMPT_MAP:
        raise HTTPException(status_code=400, detail="Invalid object type")

    prompt = PROMPT_MAP[object_type]

    image_bytes = await generate_image(
        data.base_image_url,
        data.fabric_image_url,
        prompt
    )

    if image_bytes is None:
        raise HTTPException(status_code=500, detail="Image generation failed")

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    return {
        "status": "success",
        "object_type": object_type,
        "image_base64": encoded_image
    }