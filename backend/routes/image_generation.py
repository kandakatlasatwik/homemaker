from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_image
from prompts.object_prompts import PROMPT_MAP
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


# 🔹 Request Schema
class GenerateRequest(BaseModel):
    object_type: str
    texture: str  # Fabric image URL
    base_image_base64: str  # Room image as base64


@router.post("/")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    # 🔹 Validate object type
    if object_type not in PROMPT_MAP:
        raise HTTPException(status_code=400, detail="Invalid object type")

    # 🔹 Validate texture URL
    if not data.texture:
        raise HTTPException(status_code=400, detail="Texture URL is required")

    # 🔹 Validate base image
    if not data.base_image_base64:
        raise HTTPException(status_code=400, detail="Base image base64 is required")

    prompt = PROMPT_MAP[object_type]

    # 🔹 Call Gemini Service
    try:
        image_bytes = await generate_image(
            data.base_image_base64,
            data.texture,
            prompt
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")

    if not image_bytes:
        raise HTTPException(status_code=500, detail="Image generation failed")

    encoded = base64.b64encode(image_bytes).decode("utf-8")

    return {
        "status": "success",
        "object_type": object_type,
        "object_type": object_type,
        "generated_image_base64": encoded
    }