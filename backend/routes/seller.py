from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from database import users_collection
from schemas import SellerRegister
from auth import hash_password, verify_password, create_access_token, get_current_seller

router = APIRouter(prefix="/seller", tags=["Seller"])


@router.post("/register")
def register_seller(seller: SellerRegister):
    existing = users_collection.find_one({"email": seller.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(seller.password)

    users_collection.insert_one({
        "name": seller.name,
        "email": seller.email,
        "password": hashed_pwd,
        "role": "seller"
    })

    return {"message": "Seller registered successfully"}


@router.post("/login")
def login_seller(form_data: OAuth2PasswordRequestForm = Depends()):

    db_seller = users_collection.find_one({"email": form_data.username})

    if not db_seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    if not verify_password(form_data.password, db_seller["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token({
        "seller_id": str(db_seller["_id"]),
        "role": "seller"
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_seller_me(current_seller=Depends(get_current_seller)):
    return {
        "seller_id": str(current_seller["_id"]),
        "email": current_seller.get("email"),
        "name": current_seller.get("name"),
        "role": current_seller.get("role"),
    }