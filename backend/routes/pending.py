from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from database import pending_fabrics_collection, fabric_collection
from bson import ObjectId
from auth import get_current_seller, get_current_owner
from datetime import datetime
import cloudinary
import cloudinary.uploader

router = APIRouter(prefix="/pending", tags=["Pending Fabrics"])


# 🔹 ASSISTANT: Upload fabric for approval
@router.post("/")
async def submit_fabric_for_approval(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    color: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_seller)
):
    if current_user.get("role") != "assistant":
        raise HTTPException(status_code=403, detail="Only assistants use this endpoint")

    try:
        upload_result = cloudinary.uploader.upload(image.file)
        image_url = upload_result["secure_url"]

        pending_data = {
            "name": name,
            "category": category,
            "price": price,
            "color": color,
            "stock": stock,
            "image": image_url,
            "assistant_id": str(current_user["_id"]),
            "assistant_name": current_user.get("name", ""),
            "status": "pending",
            "submitted_at": datetime.utcnow()
        }

        result = pending_fabrics_collection.insert_one(pending_data)

        return {
            "message": "Fabric submitted for approval",
            "id": str(result.inserted_id),
            "image_url": image_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 OWNER: Get all pending fabric requests
@router.get("/")
def get_pending_fabrics(current_owner: dict = Depends(get_current_owner)):
    pending = pending_fabrics_collection.find({"status": "pending"}).sort("submitted_at", -1)

    return [
        {
            "id": str(p["_id"]),
            "name": p.get("name"),
            "category": p.get("category"),
            "price": p.get("price"),
            "color": p.get("color"),
            "stock": p.get("stock"),
            "image": p.get("image"),
            "assistant_name": p.get("assistant_name"),
            "submitted_at": p["submitted_at"].isoformat() if p.get("submitted_at") else None,
        }
        for p in pending
    ]


# 🔹 OWNER: Approve a pending fabric
@router.post("/{pending_id}/approve")
def approve_fabric(pending_id: str, current_owner: dict = Depends(get_current_owner)):
    pending = pending_fabrics_collection.find_one({"_id": ObjectId(pending_id), "status": "pending"})

    if not pending:
        raise HTTPException(status_code=404, detail="Pending fabric not found")

    # Move to live fabrics collection
    fabric_data = {
        "name": pending["name"],
        "category": pending["category"],
        "price": pending["price"],
        "color": pending["color"],
        "stock": pending["stock"],
        "image": pending["image"],
        "seller_id": str(current_owner["_id"]),
    }

    result = fabric_collection.insert_one(fabric_data)

    # Mark as approved and link to the live fabric
    pending_fabrics_collection.update_one(
        {"_id": ObjectId(pending_id)},
        {"$set": {
            "status": "approved",
            "approved_by": str(current_owner["_id"]),
            "fabric_id": str(result.inserted_id)
        }}
    )

    return {"message": "Fabric approved and published"}


# 🔹 OWNER: Reject a pending fabric
@router.post("/{pending_id}/reject")
def reject_fabric(pending_id: str, current_owner: dict = Depends(get_current_owner)):
    pending = pending_fabrics_collection.find_one({"_id": ObjectId(pending_id), "status": "pending"})

    if not pending:
        raise HTTPException(status_code=404, detail="Pending fabric not found")

    # Remove from pending after rejection
    pending_fabrics_collection.delete_one({"_id": ObjectId(pending_id)})

    return {"message": "Fabric request rejected"}


# 🔹 ASSISTANT: Get my submitted fabrics
@router.get("/my-submissions")
def get_my_submissions(current_user: dict = Depends(get_current_seller)):
    if current_user.get("role") != "assistant":
        raise HTTPException(status_code=403, detail="Only assistants can view submissions")

    submissions = pending_fabrics_collection.find(
        {"assistant_id": str(current_user["_id"]), "status": {"$in": ["pending", "approved"]}}
    ).sort("submitted_at", -1)

    return [
        {
            "id": str(s["_id"]),
            "name": s.get("name"),
            "category": s.get("category"),
            "price": s.get("price"),
            "color": s.get("color"),
            "stock": s.get("stock"),
            "image": s.get("image"),
            "status": s.get("status"),
            "submitted_at": s["submitted_at"].isoformat() if s.get("submitted_at") else None,
        }
        for s in submissions
    ]
