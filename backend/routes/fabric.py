from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from database import fabric_collection
from schemas import Fabric
from bson import ObjectId
from auth import get_current_seller
from pathlib import Path
import time
import os

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


# 🔹 CREATE Fabric (Protected - Seller Only)
@router.post("/")
def create_fabric(
    fabric: Fabric,
    current_seller: dict = Depends(get_current_seller)
):
    fabric_dict = fabric.dict()

    # Automatically attach seller ID
    fabric_dict["seller_id"] = str(current_seller["_id"])

    result = fabric_collection.insert_one(fabric_dict)

    return {
        "message": "Fabric uploaded successfully",
        "id": str(result.inserted_id)
    }


# Public endpoint to accept multipart form data (useful for owner UI without auth)
@router.post("/public")
async def create_fabric_public(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(0.0),
    color: str = Form(...),
    texture: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    owner_name: str = Form("anonymous")
):
    # ensure upload directory exists
    base_dir = Path(__file__).resolve().parents[1]
    uploads_dir = base_dir / "uploads"
    os.makedirs(uploads_dir, exist_ok=True)

    filename = f"{int(time.time())}_{image.filename}"
    out_path = uploads_dir / filename

    contents = await image.read()
    with open(out_path, "wb") as f:
        f.write(contents)

    fabric_doc = {
        "name": name,
        "category": category,
        "price": price,
        "color": color,
        "texture": texture,
        "stock": stock,
        "image": str(filename),
        "seller_name": owner_name
    }

    result = fabric_collection.insert_one(fabric_doc)

    return {"message": "Fabric uploaded (public)", "id": str(result.inserted_id)}


# 🔹 GET All Fabrics (Public - Customers can view)
@router.get("/")
def get_fabrics(category: str = None, color: str = None, texture: str = None):
    query = {}

    if category:
        query["category"] = category
    if color:
        query["color"] = color
    if texture:
        query["texture"] = texture

    fabrics = fabric_collection.find(query)

    return [serialize_fabric(f) for f in fabrics]


# 🔹 GET Fabric by ID
@router.get("/{fabric_id}")
def get_fabric_by_id(fabric_id: str):
    try:
        fabric = fabric_collection.find_one({"_id": ObjectId(fabric_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid Fabric ID")

    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")

    return serialize_fabric(fabric)


# 🔹 UPDATE Stock (Protected - Seller Only)
@router.put("/{fabric_id}/stock")
def update_stock(
    fabric_id: str,
    stock: int,
    current_seller: dict = Depends(get_current_seller)
):
    result = fabric_collection.update_one(
        {
            "_id": ObjectId(fabric_id),
            "seller_id": str(current_seller["_id"])  # Seller can update only their product
        },
        {"$set": {"stock": stock}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Fabric not found or not authorized")

    return {"message": "Stock updated successfully"}


# 🔹 DELETE Fabric (Protected - Seller Only)
@router.delete("/{fabric_id}")
def delete_fabric(
    fabric_id: str,
    current_seller: dict = Depends(get_current_seller)
):
    result = fabric_collection.delete_one(
        {
            "_id": ObjectId(fabric_id),
            "seller_id": str(current_seller["_id"])  # Seller can delete only their product
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fabric not found or not authorized")

    return {"message": "Fabric deleted successfully"}