from fastapi import FastAPI
from app.routes.generate import router as generate_router

app = FastAPI(title="Image Generation Service")

app.include_router(generate_router)


@app.get("/")
def root():
    return {"status": "Service running"}