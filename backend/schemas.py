from pydantic import BaseModel, EmailStr
from enum import Enum


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
    texture: str
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