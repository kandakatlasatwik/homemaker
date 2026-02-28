from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

# Create client lazily and avoid raising at import time if DNS/network fails.
# This lets the app start so we can surface a clear error and run diagnostics.
client = None
db = None
fabric_collection = None
users_collection = None

try:
	client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
	client.admin.command("ping")
	db = client.get_database("fabricDB")
	fabric_collection = db["fabrics"]
	users_collection = db["users"]
	print("Connected to MongoDB")
except Exception as e:
	print("Warning: could not connect to MongoDB at import:", e)
	print("Mongo URL:", MONGO_URL)