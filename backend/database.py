from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client.get_database("fabricDB")

fabric_collection = db["fabrics"]
users_collection = db["users"]
print("Mongo URL:", MONGO_URL)