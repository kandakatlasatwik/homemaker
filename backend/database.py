from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
import sys
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    print("❌ MONGO_URL not found in environment variables")
    sys.exit(1)

try:
    client = MongoClient(
        MONGO_URL,
        serverSelectionTimeoutMS=10000,
        retryWrites=True,
        retryReads=True,
        connectTimeoutMS=10000,
        socketTimeoutMS=20000,
    )

    # Test connection
    client.admin.command("ping")

    db = client["fabricDB"]

    fabric_collection = db["fabrics"]
    users_collection = db["users"]
    imagegen_collection = db["imagegen"]
    cart_collection = db["cart"]
    pending_fabrics_collection = db["pending_fabrics"]

    # 🔹 Create unique index for seller email
    users_collection.create_index("email", unique=True)
    
    # 🔹 Create index for pending fabrics
    pending_fabrics_collection.create_index("assistant_id")
    pending_fabrics_collection.create_index("status")
    
    # 🔹 Create index for imagegen (guest_id and created_at for auto-deletion)
    imagegen_collection.create_index("guest_id")
    imagegen_collection.create_index("created_at")
    
    # 🔹 Create index for cart (guest_id and added_at for auto-deletion)
    cart_collection.create_index("guest_id")
    cart_collection.create_index("added_at")

    print("✅ Connected to MongoDB successfully")

except ServerSelectionTimeoutError as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("Check: 1) MONGO_URL is correct  2) IP is whitelisted in Atlas  3) Network is reachable")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected database error: {e}")
    sys.exit(1)