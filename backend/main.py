from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import fabric
from routes import seller  # ✅ Added seller router

app = FastAPI(title="Fabric Visualizer API")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(fabric.router)
app.include_router(seller.router)  # ✅ Added this line

@app.get("/")
def root():
    return {"message": "Backend running successfully"}