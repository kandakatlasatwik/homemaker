from pydantic import BaseModel

class GenerateRequest(BaseModel):
    object_type: str
    base_image_url: str
    fabric_image_url: str