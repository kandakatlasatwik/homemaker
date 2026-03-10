import os
import time
import requests
import mimetypes
import base64
from io import BytesIO
from PIL import Image
from google import genai
from google.genai import types


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MAX_RETRIES = 3
RETRY_DELAYS = [30, 60, 90]


def _call_gemini_with_retry(model, contents):
    for attempt in range(MAX_RETRIES):
        try:
            return client.models.generate_content(model=model, contents=contents)
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAYS[attempt])
                    continue
            raise
    raise Exception("Max retries exceeded for Gemini API")


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


def url_or_base64_to_bytes(data: str):

    if is_base64(data):
        return base64.b64decode(data)

    response = requests.get(data)

    if response.status_code != 200:
        raise Exception(f"Failed to download image: {data}")

    return response.content


def get_mime_type(data: str):

    if is_base64(data):
        return "image/jpeg"

    mime, _ = mimetypes.guess_type(data)

    if mime:
        return mime

    return "image/jpeg"


def resize_image(image_bytes):

    try:

        img = Image.open(BytesIO(image_bytes))
        img.thumbnail((1024, 1024))

        buffer = BytesIO()
        img.save(buffer, format="JPEG")

        return buffer.getvalue()

    except Exception:

        return image_bytes


async def generate_image(base_image_data, fabric_image_data, prompt, fabric_secondary_data=None):

    try:

        base_img_bytes = resize_image(url_or_base64_to_bytes(base_image_data))
        fabric_img_bytes = resize_image(url_or_base64_to_bytes(fabric_image_data))

        base_mime = get_mime_type(base_image_data)
        fabric_mime = get_mime_type(fabric_image_data)

        contents = [
            prompt,
            "Image 1 - BASE ROOM IMAGE:",
            types.Part.from_bytes(data=base_img_bytes, mime_type=base_mime),
            "Image 2 - FABRIC TEXTURE:",
            types.Part.from_bytes(data=fabric_img_bytes, mime_type=fabric_mime),
        ]

        # 🔹 Add second texture if exists (for curtains)
        if fabric_secondary_data:

            secondary_bytes = resize_image(
                url_or_base64_to_bytes(fabric_secondary_data)
            )

            secondary_mime = get_mime_type(fabric_secondary_data)

            contents.extend([
                "Image 3 - SHEER CURTAIN FABRIC TEXTURE:",
                types.Part.from_bytes(
                    data=secondary_bytes,
                    mime_type=secondary_mime
                )
            ])

        response = _call_gemini_with_retry(
            model="gemini-2.5-flash-image",
            contents=contents
        )

        for part in response.candidates[0].content.parts:

            if part.inline_data:
                return part.inline_data.data

        return None

    except Exception as e:

        raise Exception(f"Gemini error: {str(e)}")


async def generate_views(image_data: str, prompt: str):

    try:

        img_bytes = resize_image(url_or_base64_to_bytes(image_data))
        img_mime = get_mime_type(image_data)

        response = _call_gemini_with_retry(
            model="gemini-2.5-flash-image",
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=img_bytes,
                    mime_type=img_mime
                )
            ]
        )

        for part in response.candidates[0].content.parts:

            if part.inline_data:
                return part.inline_data.data

        return None

    except Exception as e:

        raise Exception(f"Gemini error: {str(e)}")