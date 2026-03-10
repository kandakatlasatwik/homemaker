from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError
from database import users_collection, pending_fabrics_collection
from schemas import SellerRegister
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_seller,
    get_current_owner
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
            detail="User not found"
        )

    if db_seller.get("role") not in ("seller", "assistant"):
        raise HTTPException(
            status_code=403,
            detail="User is not authorized"
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
        "token_type": "bearer",
        "role": db_seller["role"]
    }


# 🔹 GET CURRENT SELLER PROFILE
@router.get("/me")
def get_seller_me(current_seller: dict = Depends(get_current_seller)):

    if current_seller.get("role") not in ("seller", "assistant"):
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


# 🔹 REGISTER ASSISTANT (Only owner can create assistants)
@router.post("/register-assistant", status_code=status.HTTP_201_CREATED)
def register_assistant(
    assistant: SellerRegister,
    current_owner: dict = Depends(get_current_owner)
):
    try:
        hashed_pwd = hash_password(assistant.password)

        users_collection.insert_one({
            "name": assistant.name,
            "email": assistant.email,
            "password": hashed_pwd,
            "role": "assistant",
            "created_by": str(current_owner["_id"])
        })

        return {"message": "Assistant registered successfully"}

    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


# 🔹 SELF-REGISTER ASSISTANT (public)
@router.post("/register-assistant-self", status_code=status.HTTP_201_CREATED)
def register_assistant_self(assistant: SellerRegister):
    try:
        hashed_pwd = hash_password(assistant.password)

        users_collection.insert_one({
            "name": assistant.name,
            "email": assistant.email,
            "password": hashed_pwd,
            "role": "assistant",
        })

        return {"message": "Assistant registered successfully"}

    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


# 🔹 GET ALL ASSISTANTS (Owner only)
@router.get("/assistants")
def get_assistants(current_owner: dict = Depends(get_current_owner)):
    assistants = users_collection.find({"role": "assistant"})
    return [
        {
            "id": str(a["_id"]),
            "name": a.get("name"),
            "email": a.get("email"),
        }
        for a in assistants
    ]


# 🔹 DELETE ASSISTANT ACCOUNT (self-delete on logout)
@router.delete("/delete-account")
def delete_assistant_account(current_user: dict = Depends(get_current_seller)):
    if current_user.get("role") != "assistant":
        raise HTTPException(status_code=403, detail="Only assistants can delete their account")

    assistant_id = str(current_user["_id"])

    # Delete all pending submissions by this assistant
    pending_fabrics_collection.delete_many({"assistant_id": assistant_id})

    # Delete the assistant account
    users_collection.delete_one({"_id": current_user["_id"]})

    return {"message": "Account deleted successfully"}