SOFA_PROMPT = """
TASK: High-precision material replacement.

Replace only the upholstery material of the sofa in the base image using the uploaded texture reference image.

STRICT REQUIREMENTS:

• Modify ONLY the sofa surface material.
• Do NOT modify background, environment, lighting, objects, shadows, camera angle, framing, or composition.
• Preserve original sofa:
  - Shape
  - Dimensions
  - Curvature
  - Seams
  - Stitching
  - Cushion structure
  - Proportions

TEXTURE APPLICATION RULES:

• Use the uploaded texture image as the exact material source.
• Map the texture naturally along sofa contours.
• Maintain realistic scale — no oversized or undersized pattern.
• Avoid visible tiling or repetition artifacts.
• Maintain fabric tension across curved areas.
• Preserve depth and natural surface variation.
• Align texture direction logically with sofa geometry.

LIGHTING & REALISM:

• Keep original lighting direction.
• Maintain existing shadows and reflections.
• Adapt texture to scene lighting naturally.
• No artificial color grading.
• Photorealistic result only.
• No stylization.

PROHIBITED:

• No background edits.
• No object repositioning.
• No perspective changes.
• No artistic reinterpretation.
• No redesign.
• No shape transformation.
• No color change outside sofa material.

FINAL OUTPUT:

A hyper-realistic image where the sofa upholstery is replaced with the uploaded texture, while everything else remains pixel-identical to the original image.

If any ambiguity exists, prioritize preserving the original image except for the sofa material.
Do not introduce new elements under any circumstances.
"""

BED_PROMPT = """
TASK: High-precision material replacement.

Replace ONLY the bedsheet fabric on the bed in the base image using the uploaded bedsheet reference image.

STRICT INSTRUCTIONS:

1. Modify ONLY the bedsheet fabric.
2. Do NOT alter:
   - Bed frame
   - Mattress structure
   - Pillows
   - Headboard
   - Wall
   - Curtains
   - Lamps
   - Furniture
   - Floor
   - Decorations
   - Lighting
   - Shadows
   - Camera angle
   - Composition
   - Depth of field

3. Preserve the exact bed geometry:
   - Mattress thickness
   - Natural folds
   - Creases
   - Fabric draping
   - Edges tucked under mattress
   - Pillow placement

TEXTURE APPLICATION RULES:

4. Use the uploaded bedsheet image as the exact fabric source.
5. Map the texture naturally across the existing folds and drapes.
6. Maintain realistic fabric stretching over curves and edges.
7. Ensure correct scale of pattern (no oversized or tiny repetition).
8. Avoid visible tiling or repetition artifacts.
9. Preserve natural wrinkle direction and gravity flow.
10. Align pattern direction logically with fabric orientation.

LIGHTING & REALISM:

11. Preserve original lighting direction.
12. Maintain existing shadows and highlights.
13. Adapt fabric material response to scene lighting naturally.
14. No color grading changes.
15. No stylization.
16. Photorealistic result only.

PROHIBITED:

- No redesign of bed.
- No repositioning objects.
- No new elements.
- No background modifications.
- No perspective changes.
- No artificial enhancements.

FINAL RESULT:

A hyper-realistic image where only the bedsheet fabric is replaced with the uploaded reference image, while the entire room, bed structure, lighting, and composition remain pixel-identical to the original.

If any ambiguity occurs, prioritize preserving the original image unchanged except for the bedsheet fabric.
Under no circumstance modify the background or bed structure.
"""

CURTAIN_DUAL_PROMPT = """
TASK:
Perform a dual-fabric curtain visualization using the provided textures.

CURTAIN STRUCTURE:
The curtain system consists of two distinct curtain types:

1. MAIN CURTAINS
   - Located on the far LEFT and RIGHT sides of the window.
   - Thick decorative curtains that frame the window.
   - These curtains are typically heavier fabric.

2. SHEER CURTAIN
   - Located in the CENTER directly in front of the window glass.
   - Lightweight semi-transparent curtain.
   - Covers the full window width behind the side curtains.

INPUT TEXTURES:
- Texture Image 1 → MUST be applied to the MAIN SIDE CURTAINS (left and right panels).
- Texture Image 2 → MUST be applied to the CENTER SHEER CURTAIN.

STRICT RULES:
- Do NOT swap the textures.
- Side curtains must ONLY use Texture 1.
- Center curtain must ONLY use Texture 2.
- Preserve the exact curtain layout from the original image.
- Maintain the curtain folds, drapes, rod placement, and proportions.
- Do not modify the window, wall, furniture, or environment.

FABRIC APPLICATION:
- Apply the main curtain texture naturally along the folds of the side panels.
- The sheer curtain must appear semi-transparent and lightweight.
- Maintain realistic transparency so outside light passes through the sheer curtain.
- Keep correct scale and orientation of both fabrics.

REALISM REQUIREMENTS:
- Preserve original lighting and shadows.
- Maintain natural curtain folds and gravity.
- Ensure textures follow the vertical draping pattern.

Interpret the second texture as the sheer curtain and apply it only to the transparent center curtain behind the side curtains.

OUTPUT:
Produce a photorealistic interior image where:
- Left and right curtains use the main curtain texture.
- The center curtain uses the sheer texture.
- The overall curtain structure remains identical to the original image.
"""

CARPET_PROMPT = """
TASK: High-precision carpet / rug material replacement.

Replace ONLY the carpet (rug) surface material in the base image using the uploaded carpet reference image.

STRICT REQUIREMENTS:

1. Modify ONLY the carpet / rug surface.
2. Preserve the exact:
   - Rug size
   - Rug shape
   - Rug position
   - Orientation
   - Edge boundaries
   - Thickness
   - Fringe details (if present)
   - Border lines (if present)

3. Do NOT modify:
   - Floor
   - Walls
   - Furniture
   - Sofa / bed / table legs
   - Decorations
   - Lighting
   - Shadows
   - Camera angle
   - Perspective
   - Composition

4. Keep furniture placement identical.
5. Maintain rug alignment relative to furniture.

TEXTURE APPLICATION RULES:

6. Use the uploaded carpet reference image as the exact material source.
7. Map the texture naturally across the rug surface.
8. Maintain correct perspective distortion according to camera angle.
9. Ensure correct pattern scale (no oversized or miniature repetition).
10. Avoid visible tiling artifacts.
11. Preserve natural surface depth and pile texture.
12. Maintain realistic fabric compression under furniture legs.

LIGHTING & REALISM:

13. Preserve original lighting direction.
14. Maintain natural shadow interaction between rug and floor.
15. Keep accurate shading along edges.
16. No artificial color grading.
17. No stylization.
18. Photorealistic result only.

PROHIBITED:

- No resizing of rug.
- No repositioning.
- No perspective correction.
- No adding or removing furniture.
- No background edits.
- No scene redesign.

FINAL RESULT:

A hyper-realistic image where only the carpet / rug material is replaced with the uploaded reference image, while the rest of the room remains pixel-identical to the original.

If any ambiguity occurs, preserve the original image unchanged except for the carpet material.
Under no circumstance modify the floor, furniture placement, or room structure.
"""

CUSHION_PROMPT = """
TASK: High-precision cushion fabric replacement.

Replace ONLY the fabric material of the existing cushions in the base image using the uploaded cushion reference image.

STRICT REQUIREMENTS:

1. Modify ONLY the cushion fabric.
2. Preserve the exact number of cushions.
3. Preserve cushion:
   - Shape
   - Size
   - Thickness
   - Position
   - Orientation
   - Arrangement
   - Edges
   - Seams
   - Piping details
   - Buttons (if present)

4. Do NOT modify:
   - Sofa / bed / chair structure
   - Background
   - Wall
   - Floor
   - Furniture
   - Decor
   - Lighting
   - Shadows
   - Camera angle
   - Perspective
   - Composition

5. Keep cushions in the exact same positions as in the original image.

TEXTURE APPLICATION RULES:

6. Use the uploaded reference image as the exact fabric source.
7. Map the fabric naturally across cushion surfaces.
8. Follow natural curvature and puffiness.
9. Maintain realistic fabric stretching over edges.
10. Preserve existing folds and compression areas.
11. Ensure correct pattern scale (no oversized or miniature repetition).
12. Avoid visible tiling artifacts.
13. Align pattern direction logically across cushion surfaces.
14. If multiple cushions exist, apply fabric consistently unless otherwise specified.

LIGHTING & REALISM:

15. Preserve original lighting direction.
16. Maintain natural shadow falloff.
17. Adapt material response (matte, velvet, leather, cotton, etc.) to scene lighting.
18. No artificial color grading.
19. No stylization.
20. Photorealistic result only.

PROHIBITED:

- No adding or removing cushions.
- No reshaping cushions.
- No background modification.
- No object repositioning.
- No scene redesign.
- No perspective alteration.

FINAL RESULT:

A hyper-realistic image where only the cushion fabric is replaced with the uploaded reference image, while the rest of the scene remains pixel-identical to the original.

If any ambiguity occurs, preserve the original image unchanged except for the cushion fabric.
Under no circumstance modify the cushion structure or background.
"""

UPHOLSTERY_PROMPT = """
TASK:
Perform a high-precision upholstery fabric replacement on the furniture shown in the base image.

CONTEXT:
The first image contains upholstered furniture such as chairs, dining seats, armchairs, ottomans, benches, stools, or padded seating.
The second image contains the fabric texture that must be applied to the upholstery surfaces.

OBJECTIVE:
Replace the existing upholstery fabric in the base image with the provided fabric texture while preserving the exact furniture design.

STRICT RULES:
- Only modify the upholstered fabric areas of the furniture.
- Preserve the original furniture structure, geometry, proportions, and silhouette.
- Do not change the furniture design, frame, legs, armrests, or structural components.
- Do not modify wood, metal, plastic, or any non-fabric materials.
- Maintain the original environment, background, lighting, and shadows.

UPHOLSTERY APPLICATION REQUIREMENTS:
- Apply the new fabric texture naturally across all padded upholstery surfaces.
- Respect seams, cushions, tufting, piping, stitching, and upholstery contours.
- Ensure the fabric pattern follows the curvature and folds of the furniture realistically.
- Maintain consistent scale and orientation of the fabric pattern.
- Ensure the texture appears physically wrapped over cushions and padded areas.

REALISM REQUIREMENTS:
- Preserve realistic lighting and shadow interaction with the fabric.
- Maintain depth, folds, and cushion softness.
- Ensure the texture integrates naturally with the furniture geometry.

OUTPUT REQUIREMENTS:
- Photorealistic furniture rendering
- High-quality realistic upholstery material
- The furniture must remain identical to the base image except for the upholstery fabric replacement
- No background modifications
- No changes to furniture proportions
"""


ORTHOGRAPHIC_VIEWS_PROMPT = """
TASK:
Generate three orthographic views of the furniture shown in the input image.

VIEWS REQUIRED:
1. Top view
2. Front view
3. Left side view

INSTRUCTIONS:
- Maintain the exact same furniture design and fabric texture.
- The fabric pattern must remain identical in all views.
- Only change the viewing angle.
- Do not redesign or alter the furniture.

OUTPUT FORMAT:
- A clean layout showing three images side-by-side
- Each labeled: Top View, Front View, Side View
- Photorealistic rendering
"""

PROMPT_MAP = {
    "sofa": SOFA_PROMPT,
    "bed": BED_PROMPT,
    "curtain": CURTAIN_DUAL_PROMPT,
    "rugs": CARPET_PROMPT,
    "cushion": CUSHION_PROMPT,
    "upholstery": UPHOLSTERY_PROMPT
}