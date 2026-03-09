from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_image, generate_views
from prompts.object_prompts import PROMPT_MAP, ORTHOGRAPHIC_VIEWS_PROMPT
from database import imagegen_collection
from datetime import datetime
import base64

router = APIRouter(prefix="/generate", tags=["Image Generation"])


# 🔹 Request Schema
class GenerateRequest(BaseModel):
    object_type: str
    texture: str
    texture_secondary: str | None = None
    base_image_base64: str


# 🔹 Generate Image
@router.post("/")
async def generate(data: GenerateRequest):

    object_type = data.object_type.lower()

    # Validate object type
    prompt = PROMPT_MAP.get(object_type)
    if not prompt:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported object type: {object_type}"
        )

    # Validate base image
    if not data.base_image_base64.strip():
        raise HTTPException(
            status_code=400,
            detail="Base image base64 is required"
        )

    # Curtain requires two textures
    if object_type == "curtain":

        if not data.texture or not data.texture_secondary:
            raise HTTPException(
                status_code=400,
                detail="Curtains require both main and sheer textures"
            )

    else:

        if not data.texture:
            raise HTTPException(
                status_code=400,
                detail="Texture URL is required"
            )

    # 🔹 Call Gemini
    try:

        image_bytes = await generate_image(
            data.base_image_base64,
            data.texture,
            prompt,
            data.texture_secondary
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Gemini error: {str(e)}"
        )

    if not image_bytes:
        raise HTTPException(
            status_code=500,
            detail="Image generation failed"
        )

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    image_doc = {
        "object_type": object_type,
        "texture_url": data.texture,
        "texture_secondary": data.texture_secondary if object_type == "curtain" else "",
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


# 🔹 Request Schema for Views
class ViewsRequest(BaseModel):
    image_base64: str


# 🔹 Generate Orthographic Views
@router.post("/views")
async def generate_orthographic_views(data: ViewsRequest):

    if not data.image_base64.strip():
        raise HTTPException(
            status_code=400,
            detail="Image base64 is required"
        )

    try:

        image_bytes = await generate_views(
            data.image_base64,
            ORTHOGRAPHIC_VIEWS_PROMPT
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Gemini error: {str(e)}"
        )

    if not image_bytes:
        raise HTTPException(
            status_code=500,
            detail="Views generation failed"
        )

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    views_doc = {
        "object_type": "orthographic_views",
        "texture_url": "",
        "generated_image_base64": encoded_image,
        "created_at": datetime.utcnow()
    }

    result = imagegen_collection.insert_one(views_doc)

    return {
        "status": "success",
        "image_id": str(result.inserted_id),
        "views_image_base64": encoded_image
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
            "texture_url": img.get("texture_url", ""),
            "texture_secondary": img.get("texture_secondary", ""),
            "generated_image_base64": img["generated_image_base64"],
            "created_at": img["created_at"].isoformat()
        })

    return {
        "status": "success",
        "count": len(formatted_images),
        "images": formatted_images
    }