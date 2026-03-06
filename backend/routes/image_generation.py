from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_image
from prompts.object_prompts import PROMPT_MAP
from database import imagegen_collection
from datetime import datetime
from bson import ObjectId
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


# 🔹 Request Schema
class GenerateRequest(BaseModel):
    guest_id: str
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
    
    # 🔹 Validate guest_id
    if not data.guest_id:
        raise HTTPException(status_code=400, detail="Guest ID is required")

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
    
    # 🔹 Save to database
    image_doc = {
        "guest_id": data.guest_id,
        "object_type": object_type,
        "texture_url": data.texture,
        "generated_image_base64": encoded,
        "created_at": datetime.utcnow()
    }
    
    result = imagegen_collection.insert_one(image_doc)

    return {
        "status": "success",
        "image_id": str(result.inserted_id),
        "object_type": object_type,
        "object_type": object_type,
        "generated_image_base64": encoded
    }


# 🔹 Get all images for a guest
@router.get("/images/{guest_id}")
async def get_guest_images(guest_id: str):
    """Get all generated images for a guest"""
    
    images = list(imagegen_collection.find({"guest_id": guest_id}))
    
    # Convert ObjectId to string and datetime to ISO format
    for image in images:
        image["_id"] = str(image["_id"])
        image["created_at"] = image["created_at"].isoformat()
    
    return {
        "status": "success",
        "count": len(images),
        "images": images
    }
