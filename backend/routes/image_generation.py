from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId
from database import fabric_collection
from services.gemini_service import generate_image
from prompts.object_prompts import PROMPT_MAP
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


# 🔹 Request Schema
class GenerateRequest(BaseModel):
    object_type: str
    base_image_url: str
    fabric_id: str


@router.post("/")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    # 🔹 Validate object type
    if object_type not in PROMPT_MAP:
        raise HTTPException(status_code=400, detail="Invalid object type")

    # 🔹 Validate Fabric ID
    try:
        obj_id = ObjectId(data.fabric_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Fabric ID")

    # 🔹 Fetch fabric from DB
    fabric = fabric_collection.find_one({"_id": obj_id})

    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")

    fabric_image_url = fabric.get("image")

    if not fabric_image_url:
        raise HTTPException(status_code=400, detail="Fabric image not found")

    prompt = PROMPT_MAP[object_type]

    # 🔹 Call Gemini Service
    try:
        image_bytes = await generate_image(
            data.base_image_url,
            fabric_image_url,
            prompt
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")

    if not image_bytes:
        raise HTTPException(status_code=500, detail="Image generation failed")

    encoded = base64.b64encode(image_bytes).decode("utf-8")

    return {
        "status": "success",
        "fabric_id": data.fabric_id,
        "object_type": object_type,
        "generated_image_base64": encoded
    }