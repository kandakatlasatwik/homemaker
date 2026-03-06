from fastapi import APIRouter, HTTPException
from database import imagegen_collection, cart_collection
from schemas import AddToCartRequest
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/cart", tags=["Cart"])


# 🔹 Add item to cart
@router.post("/add")
async def add_to_cart(data: AddToCartRequest):
    """Add a generated image to cart"""
    
    # Find the image in imagegen collection
    image = imagegen_collection.find_one({"_id": ObjectId(data.image_id)})
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Check if already in cart
    existing = cart_collection.find_one({
        "guest_id": data.guest_id,
        "image_id": data.image_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Item already in cart")
    
    # Add to cart
    cart_item = {
        "guest_id": data.guest_id,
        "image_id": data.image_id,
        "object_type": image["object_type"],
        "texture_url": image["texture_url"],
        "generated_image_base64": image["generated_image_base64"],
        "added_at": datetime.utcnow()
    }
    
    result = cart_collection.insert_one(cart_item)
    
    return {
        "status": "success",
        "message": "Item added to cart",
        "cart_item_id": str(result.inserted_id)
    }


# 🔹 Get cart items for a guest
@router.get("/{guest_id}")
async def get_cart(guest_id: str):
    """Get all cart items for a guest"""
    
    items = list(cart_collection.find({"guest_id": guest_id}))
    
    # Convert ObjectId to string
    for item in items:
        item["_id"] = str(item["_id"])
        item["added_at"] = item["added_at"].isoformat()
    
    return {
        "status": "success",
        "count": len(items),
        "items": items
    }


# 🔹 Delete item from cart
@router.delete("/{cart_item_id}")
async def delete_cart_item(cart_item_id: str):
    """Delete an item from cart"""
    
    result = cart_collection.delete_one({"_id": ObjectId(cart_item_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return {
        "status": "success",
        "message": "Item removed from cart"
    }


# 🔹 Clear entire cart for a guest
@router.delete("/clear/{guest_id}")
async def clear_cart(guest_id: str):
    """Clear all items from cart for a guest"""
    
    result = cart_collection.delete_many({"guest_id": guest_id})
    
    return {
        "status": "success",
        "message": f"Removed {result.deleted_count} items from cart"
    }
