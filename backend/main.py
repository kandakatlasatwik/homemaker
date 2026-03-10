from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import fabric
from routes import image_generation
from routes import seller
from routes import cart
from routes import pending
from cleanup_task import start_cleanup_task

app = FastAPI(title="Fabric Visualizer API")

# Enable CORS for frontend connection
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
# Ensure the deployed frontend URL is allowed as well
allowed_origins = [FRONTEND_URL]
prod_frontend = "https://homemakers.onrender.com"
if prod_frontend not in allowed_origins:
    allowed_origins.append(prod_frontend)
# Always allow localhost for development
if "http://localhost:5173" not in allowed_origins:
    allowed_origins.append("http://localhost:5173")

print(f"Allowed CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(fabric.router)
app.include_router(image_generation.router)
app.include_router(seller.router)
app.include_router(cart.router)
app.include_router(pending.router)

# 🔹 Startup event to start background cleanup task
@app.on_event("startup")
async def startup_event():
    start_cleanup_task()

@app.get("/")
def root():
    return {"message": "Backend running successfully"}


@app.get("/health")
def health():
    return {"status": "ok"}