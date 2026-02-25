from google import genai
from google.genai import types
import requests
import base64
from app.core.config import GEMINI_API_KEY, MODEL_NAME

client = genai.Client(api_key=GEMINI_API_KEY)


def image_url_to_base64(image_url: str):
    response = requests.get(image_url)
    response.raise_for_status()
    return base64.b64encode(response.content).decode("utf-8")


async def generate_image(base_image_url: str, fabric_image_url: str, prompt: str):

    base_img_b64 = image_url_to_base64(base_image_url)
    fabric_img_b64 = image_url_to_base64(fabric_image_url)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[
            prompt,
            types.Part.from_bytes(
                data=base64.b64decode(base_img_b64),
                mime_type="image/jpeg",
            ),
            types.Part.from_bytes(
                data=base64.b64decode(fabric_img_b64),
                mime_type="image/jpeg",
            ),
        ],
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            return part.inline_data.data

    return None                                                 