# 🧵 Fabric Visualizer Backend

This is the unified backend system for the **Fabric Visualizer Project**.

The backend handles:

- 🧵 Fabric Management (MongoDB)
- 👤 Seller Authentication (JWT-based)
- 🖼 AI Image Generation using Gemini 2.5 Flash Image
- 🔐 Environment-based configuration
- 🚀 FastAPI REST APIs

---

# 🏗 Tech Stack

- ⚡ FastAPI
- 🍃 MongoDB (Local / Atlas)
- 🤖 Google Gemini API
- 🐍 Python 3.9+
- 🚀 Uvicorn
- 🔐 JWT Authentication

---

# 📂 Project Structure

```
backend/
│
├── prompts/
│   └── object_prompts.py
│
├── routes/
│   ├── __init__.py
│   ├── fabric.py
│   ├── seller.py
│   └── image_generation.py
│
├── services/
│   └── gemini_service.py
│
├── auth.py
├── database.py
├── main.py
├── models.py
├── schemas.py
├── requirements.txt
├── .env
└── venv/
```

---

# 🧠 File-by-File Explanation

## main.py
- Entry point of FastAPI application.
- Registers all API routes:
  - Fabric routes
  - Seller routes
  - Image generation routes
- Enables CORS for frontend communication.

Run command:
```
uvicorn main:app --reload
```

---

## database.py
- Loads environment variables using `dotenv`.
- Connects to MongoDB.
- Initializes collections:
  - `fabric_collection`
  - `users_collection`

Environment variable required:
```
MONGO_URL
```

If terminal prints:
```
Mongo URL: None
```
Then `.env` is not configured correctly.

---

## auth.py
- Handles seller authentication.
- Password hashing using `passlib`.
- JWT token creation using `python-jose`.

---

## models.py
- Contains database model definitions (if needed).
- Acts as structure layer between DB and API.

---

## schemas.py
- Pydantic models for request validation.
- Validates:
  - Fabric creation
  - Seller registration
  - Login
  - Image generation request

---

## routes/fabric.py
Handles:
- Create fabric
- Get all fabrics
- Get fabric by ID
- Delete fabric
- Update stock

Connected directly to MongoDB.

---

## routes/seller.py
Handles:
- Seller registration
- Seller login
- JWT authentication

---

## routes/image_generation.py
Handles:

```
POST /generate/
```

Workflow:
1. Receives:
   - object_type
   - base_image_url
   - fabric_image_url
2. Gets correct prompt from `object_prompts.py`
3. Calls `gemini_service.py`
4. Returns generated image (base64)

---

## services/gemini_service.py
Core AI processing logic.

Steps:
1. Downloads base object image
2. Downloads fabric image
3. Converts images to base64
4. Sends request to Gemini API
5. Returns generated image bytes

Environment variable required:
```
GEMINI_API_KEY
```

---

## prompts/object_prompts.py
Contains predefined prompts for:
- sofa
- bed
- curtain
- carpet
- cushion

Each prompt ensures:
- Only texture changes
- Background remains unchanged
- Object structure preserved

---

# 🔐 Environment Setup

## Step 1 — Create Virtual Environment

Inside backend folder:

### Windows
```
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux
```
python3 -m venv venv
source venv/bin/activate
```

You should see:
```
(venv)
```

---

## Step 2 — Install Dependencies

```
pip install -r requirements.txt
```

---

## Step 3 — Configure Environment Variables

Create `.env` inside backend folder:

### Local MongoDB
```
MONGO_URL=mongodb://localhost:27017
GEMINI_API_KEY=your_gemini_api_key
```

### MongoDB Atlas
```
MONGO_URL=your_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

⚠ Important:
- Never push `.env` to GitHub
- Ensure `.env` is listed in `.gitignore`

---

# 🚀 Running the Backend

From inside backend folder:

```
uvicorn main:app --reload
```

Open Swagger UI:
```
http://127.0.0.1:8000/docs
```

---

# 🖼 Image Generation Flow

User selects:
- Object (sofa / bed / curtain / etc.)
- Fabric (texture)

Frontend sends:

```
POST /generate/
```

Request body:
```json
{
  "object_type": "sofa",
  "base_image_url": "https://...",
  "fabric_image_url": "https://..."
}
```

Backend:
- Applies object-specific prompt
- Calls Gemini API
- Returns base64 image

Frontend displays using:
```
data:image/png;base64,<image_data>
```

---

# 🧪 Testing APIs

Swagger UI:
```
http://127.0.0.1:8000/docs
```

Available sections:
- Fabrics
- Seller
- Image Generation

---

# 🛠 Common Errors

## Mongo URL: None
- Check `.env`
- Restart server

## 429 Gemini Error
- Billing not enabled
- API quota exceeded

## Module Not Found
```
pip install -r requirements.txt
```

## Port Already In Use
```
uvicorn main:app --reload --port 8001
```

---

# 🔐 Security Notes

- Do NOT commit `.env`
- Do NOT commit `venv/`
- Never expose API keys
- Remove `verify=False` in production

---

# 👩‍💻 Contributors

- **Sharanya Kathroju**  
  https://github.com/SHARANYA-216  

- **Vishnu Joshi**  
  https://github.com/Vishnu18-tech  

- **Kandakatla Satwik**  
  https://github.com/kandakatlasatwik  

---

# 🚀 Project Status

✅ Unified backend completed  
✅ MongoDB integration completed  
✅ Gemini image generation integrated  
🔄 Frontend integration in progress  

---

# 📌 Developer Handover Summary

To run this project from scratch:

1. Clone repository
2. Navigate to backend folder
3. Create virtual environment
4. Install dependencies
5. Add `.env`
6. Run uvicorn
7. Open Swagger

Backend is modular, scalable, and ready for production integration.

---

Happy Coding 🚀