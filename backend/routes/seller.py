from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError
from database import users_collection
from schemas import SellerRegister
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_seller
)
from bson import ObjectId

router = APIRouter(prefix="/seller", tags=["Seller"])


# 🔹 REGISTER SELLER
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_seller(seller: SellerRegister):

    try:
        hashed_pwd = hash_password(seller.password)

        users_collection.insert_one({
            "name": seller.name,
            "email": seller.email,
            "password": hashed_pwd,
            "role": "seller"
        })

        return {"message": "Seller registered successfully"}

    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


# 🔹 LOGIN SELLER
@router.post("/login")
def login_seller(form_data: OAuth2PasswordRequestForm = Depends()):

    db_seller = users_collection.find_one({"email": form_data.username})

    if not db_seller:
        raise HTTPException(
            status_code=404,
            detail="Seller not found"
        )

    if db_seller.get("role") != "seller":
        raise HTTPException(
            status_code=403,
            detail="User is not a seller"
        )

    if not verify_password(form_data.password, db_seller["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token({
        "seller_id": str(db_seller["_id"]),
        "role": db_seller["role"]
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# 🔹 GET CURRENT SELLER PROFILE
@router.get("/me")
def get_seller_me(current_seller: dict = Depends(get_current_seller)):

    # Safety role check
    if current_seller.get("role") != "seller":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return {
        "seller_id": str(current_seller["_id"]),
        "name": current_seller.get("name"),
        "email": current_seller.get("email"),
        "role": current_seller.get("role")
    }