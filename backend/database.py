from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL not found in environment variables")

try:
    client = MongoClient(
        MONGO_URL,
        serverSelectionTimeoutMS=5000,
        retryWrites=True
    )

    # Test connection
    client.admin.command("ping")

    db = client["fabricDB"]

    fabric_collection = db["fabrics"]
    users_collection = db["users"]

    # 🔹 Create unique index for seller email
    users_collection.create_index("email", unique=True)

    print("✅ Connected to MongoDB successfully")

except ServerSelectionTimeoutError as e:
    print("❌ MongoDB connection failed:", e)
    raise RuntimeError("Database connection failed. Check Mongo URL and network.")