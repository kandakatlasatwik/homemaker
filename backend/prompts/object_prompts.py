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

CURTAIN_PROMPT = """
TASK: High-precision curtain fabric replacement.

Replace ONLY the curtain fabric in the base image using the uploaded curtain reference image.

STRICT REQUIREMENTS:

1. Modify ONLY the curtain material.
2. Curtains must remain positioned on both the left and right sides of the window.
3. Preserve the original curtain layout:
   - Length (floor-length, sill-length, or custom)
   - Pleats and folds
   - Drape direction
   - Curtain rod placement
   - Hanging structure
   - Fabric density
   - Tie-backs if present

4. Do NOT modify:
   - Window glass
   - Window frame
   - Wall
   - Ceiling
   - Furniture
   - Floor
   - Decor
   - Lighting
   - Shadows
   - Perspective
   - Camera angle
   - Composition

5. Preserve exact room geometry and spatial layout.

TEXTURE APPLICATION RULES:

6. Use the uploaded curtain reference image as the exact fabric source.
7. Map the fabric naturally across all folds and pleats.
8. Maintain realistic gravity flow and draping behavior.
9. Ensure correct pattern scale (no oversized or miniature repetition).
10. Avoid visible tiling artifacts.
11. Preserve natural fabric tension at rod and bottom hem.
12. Maintain symmetrical alignment between left and right curtains if originally symmetrical.

LIGHTING & REALISM:

13. Preserve original lighting direction.
14. Maintain natural shadow falloff on folds.
15. Keep accurate translucency if curtains are sheer.
16. No artificial color grading.
17. No stylization.
18. Photorealistic result only.

WINDOW SIZE CONDITION:

19. Adapt fabric mapping correctly whether the window is:
    - Tall
    - Short
    - Wide
    - Narrow

20. Curtains must visually fit the window dimensions naturally without distortion.

PROHIBITED:

- No background edits.
- No resizing of window.
- No redesign of curtain structure.
- No additional elements.
- No removal of existing room objects.

FINAL RESULT:

A hyper-realistic image where only the curtain fabric is replaced with the uploaded reference image, while the entire room, window structure, lighting, and composition remain pixel-identical to the original.

If any ambiguity occurs, preserve the original image unchanged except for the curtain fabric.
Under no circumstance modify the window, wall, or room structure.
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

PROMPT_MAP = {
    "sofa": SOFA_PROMPT,
    "bed": BED_PROMPT,
    "curtain": CURTAIN_PROMPT,
    "carpet": CARPET_PROMPT,
    "cushion": CUSHION_PROMPT
}