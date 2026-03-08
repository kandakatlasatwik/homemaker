from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_image
from prompts.object_prompts import PROMPT_MAP
from database import imagegen_collection
from datetime import datetime
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


# 🔹 Request Schema
class GenerateRequest(BaseModel):
    object_type: str
    texture: str                 # Fabric image URL
    base_image_base64: str       # Room image in base64


# 🔹 Generate Image
@router.post("/")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    # 🔹 Validate object type
    prompt = PROMPT_MAP.get(object_type)
    if not prompt:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported object type: {object_type}"
        )

    # 🔹 Validate texture URL
    if not data.texture.strip():
        raise HTTPException(status_code=400, detail="Texture URL is required")

    # 🔹 Validate base image
    if not data.base_image_base64.strip():
        raise HTTPException(status_code=400, detail="Base image base64 is required")

    # 🔹 Call Gemini Service
    try:
        image_bytes = await generate_image(
            data.base_image_base64,
            data.texture,
            prompt
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini error: {str(e)}"
        )

    if not image_bytes:
        raise HTTPException(status_code=500, detail="Image generation failed")

    # 🔹 Convert to base64
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    # 🔹 Save generated image
    image_doc = {
        "object_type": object_type,
        "texture_url": data.texture,
        "generated_image_base64": encoded_image,
        "created_at": datetime.utcnow()
    }

    result = imagegen_collection.insert_one(image_doc)

    return {
        "status": "success",
        "image_id": str(result.inserted_id),
        "object_type": object_type,
        "generated_image_base64": encoded_image
    }


# 🔹 Get all generated images
@router.get("/images")
async def get_all_images():

    images = list(imagegen_collection.find())

    formatted_images = []

    for img in images:
        formatted_images.append({
            "image_id": str(img["_id"]),
            "object_type": img["object_type"],
            "texture_url": img["texture_url"],
            "generated_image_base64": img["generated_image_base64"],
            "created_at": img["created_at"].isoformat()
        })

    return {
        "status": "success",
        "count": len(formatted_images),
        "images": formatted_images
    }