from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from database import fabric_collection
from bson import ObjectId
from auth import get_current_seller
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(prefix="/fabrics", tags=["Fabrics"])


# 🔹 Helper function to safely convert MongoDB document to JSON
def serialize_fabric(fabric):
    return {
        "id": str(fabric.get("_id")),
        "name": fabric.get("name"),
        "category": fabric.get("category"),
        "price": fabric.get("price"),
        "color": fabric.get("color"),
        "texture": fabric.get("texture"),
        "stock": fabric.get("stock"),
        "image": fabric.get("image"),
        "seller_id": fabric.get("seller_id")
    }


# 🔹 CREATE Fabric (Protected - Seller Only) WITH IMAGE UPLOAD
@router.post("/")
async def create_fabric(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    color: str = Form(...),
    texture: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    current_seller: dict = Depends(get_current_seller)
):
    try:
        # Upload image to Cloudinary
        upload_result = cloudinary.uploader.upload(image.file)
        image_url = upload_result["secure_url"]

        fabric_data = {
            "name": name,
            "category": category,
            "price": price,
            "color": color,
            "texture": texture,
            "stock": stock,
            "image": image_url,
            "seller_id": str(current_seller["_id"])
        }

        result = fabric_collection.insert_one(fabric_data)

        return {
            "message": "Fabric uploaded successfully",
            "id": str(result.inserted_id),
            "image_url": image_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 GET All Fabrics (Public)
@router.get("/")
def get_fabrics(category: str):
    fabrics = fabric_collection.find(
        {"category": category},
        {
            "name": 1,
            "category": 1,
            "color": 1,
            "texture": 1,
            "image": 1
        }
    )

    return [
        {
            "id": str(f["_id"]),
            "name": f.get("name"),
            "category": f.get("category"),
            "color": f.get("color"),
            "texture": f.get("texture"),
            "image": f.get("image"),
        }
        for f in fabrics
    ]

# 🔹 GET Fabric by ID
@router.get("/{fabric_id}")
def get_fabric_by_id(fabric_id: str):
    try:
        fabric = fabric_collection.find_one(
            {"_id": ObjectId(fabric_id)},
            {
                "name": 1,
                "category": 1,
                "price": 1,
                "color": 1,
                "texture": 1,
                "image": 1
            }
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid Fabric ID")

    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")

    return {
        "id": str(fabric["_id"]),
        "name": fabric.get("name"),
        "category": fabric.get("category"),
        "price": fabric.get("price"),
        "color": fabric.get("color"),
        "texture": fabric.get("texture"),
        "image": fabric.get("image"),
    }


# 🔹 UPDATE Stock
@router.put("/{fabric_id}/stock")
def update_stock(
    fabric_id: str,
    stock: int,
    current_seller: dict = Depends(get_current_seller)
):
    result = fabric_collection.update_one(
        {
            "_id": ObjectId(fabric_id),
            "seller_id": str(current_seller["_id"])
        },
        {"$set": {"stock": stock}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Fabric not found or not authorized")

    return {"message": "Stock updated successfully"}


# 🔹 DELETE Fabric
@router.delete("/{fabric_id}")
def delete_fabric(
    fabric_id: str,
    current_seller: dict = Depends(get_current_seller)
):
    fabric = fabric_collection.find_one({"_id": ObjectId(fabric_id)})

    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")

    if fabric["seller_id"] != str(current_seller["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    fabric_collection.delete_one({"_id": ObjectId(fabric_id)})

    return {"message": "Fabric deleted successfully"}