import os
import requests
import mimetypes
import base64
from io import BytesIO
from PIL import Image
from google import genai
from google.genai import types


# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Check if string is base64 encoded
def is_base64(s: str) -> bool:
    try:
        if isinstance(s, str):
            s_bytes = bytes(s, 'utf-8')
        elif isinstance(s, bytes):
            s_bytes = s
        else:
            return False
        return base64.b64encode(base64.b64decode(s_bytes)) == s_bytes
    except Exception:
        return False

# Download image from URL or decode base64
def url_or_base64_to_bytes(data: str):
    # Check if it's base64 encoded
    if is_base64(data):
        try:
            return base64.b64decode(data)
        except Exception as e:
            raise Exception(f"Failed to decode base64 image: {str(e)}")
    
    # Otherwise treat as URL
    try:
        response = requests.get(data)
        if response.status_code != 200:
            raise Exception(f"Failed to download image: {data}")
        return response.content
    except Exception as e:
        raise Exception(f"Failed to download image from URL: {str(e)}")

# Detect MIME type from URL or return default for base64
def get_mime_type(data: str):
    # If it's base64, return default
    if is_base64(data):
        return "image/jpeg"
    
    # Otherwise try to guess from URL
    mime, _ = mimetypes.guess_type(data)
    if mime:
        return mime

    return "image/jpeg"


# Resize image (important for Gemini)
def resize_image(image_bytes):

    try:
        img = Image.open(BytesIO(image_bytes))

        # limit image size
        img.thumbnail((1024, 1024))

        buffer = BytesIO()
        img.save(buffer, format="JPEG")

        return buffer.getvalue()

    except Exception:
        return image_bytes


# Main Image Generation Function
async def generate_image(base_image_data, fabric_image_data, prompt):

    try:

        # Download/decode images (handles both URLs and base64)
        base_img_bytes = url_or_base64_to_bytes(base_image_data)
        fabric_img_bytes = url_or_base64_to_bytes(fabric_image_data)

        # Resize images
        base_img_bytes = resize_image(base_img_bytes)
        fabric_img_bytes = resize_image(fabric_img_bytes)

        # Detect mime types
        base_mime = get_mime_type(base_image_data)
        fabric_mime = get_mime_type(fabric_image_data)

        # Gemini Request
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[
                prompt,

                types.Part.from_bytes(
                    data=base_img_bytes,
                    mime_type=base_mime
                ),

                types.Part.from_bytes(
                    data=fabric_img_bytes,
                    mime_type=fabric_mime
                ),
            ]
        )

        # Extract generated image
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                return part.inline_data.data

        return None

    except Exception as e:
        raise Exception(f"Gemini error: {str(e)}")