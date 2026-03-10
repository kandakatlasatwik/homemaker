from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from typing import Optional


# 🔹 Category Enum
class Category(str, Enum):
    bedsheets = "bedsheets"
    curtains = "curtains"
    sofa_covers = "sofa_covers"
    chair_covers = "chair_covers"


# 🔹 Fabric Schema
class Fabric(BaseModel):
    name: str
    category: Category
    price: float
    color: str
    stock: int
    image: str
    seller_id: str


# 🔹 Seller Authentication Schemas
class SellerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class SellerLogin(BaseModel):
    email: EmailStr
    password: str


# 🔹 ImageGen Schema
class ImageGen(BaseModel):
    guest_id: str
    object_type: str
    texture_url: str
    texture_secondary: Optional[str] = None
    base_image_url: Optional[str] = None
    generated_image_base64: str
    created_at: datetime


# 🔹 Cart Schema
class CartItem(BaseModel):
    guest_id: str
    image_id: str
    object_type: str
    texture_url: str
    texture_secondary: Optional[str] = None
    generated_image_base64: str
    added_at: datetime


# 🔹 Cart Request Schema
class AddToCartRequest(BaseModel):
    guest_id: str
    image_id: str