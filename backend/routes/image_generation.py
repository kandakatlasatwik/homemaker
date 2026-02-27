from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_image
from prompts.object_prompts import PROMPT_MAP
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


class GenerateRequest(BaseModel):
    object_type: str
    base_image_url: str
    fabric_image_url: str


@router.post("/")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    if object_type not in PROMPT_MAP:
        raise HTTPException(status_code=400, detail="Invalid object type")

    prompt = PROMPT_MAP[object_type]

    try:
        image_bytes = await generate_image(
            data.base_image_url,
            data.fabric_image_url,
            prompt
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if image_bytes is None:
        raise HTTPException(status_code=500, detail="Image generation failed")

    encoded = base64.b64encode(image_bytes).decode("utf-8")

    return {
        "status": "success",
        "image_base64": encoded
    }