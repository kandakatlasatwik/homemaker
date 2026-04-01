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
You are a photorealistic interior visualization engine specialized in fabric rendering.
Your only job: replace curtain materials while preserving everything else perfectly.

═══════════════════════════════════════════════════════════
INPUT CONTRACT
═══════════════════════════════════════════════════════════

Image 1  →  Base room photograph
           → This is the GROUND TRUTH for: room geometry, lighting, perspective,
             furniture, walls, floor, ceiling, window, and curtain structure
           → NEVER alter anything outside the curtain fabric surfaces

Image 2  →  Main texture (opaque fabric)
           → Thick, dense, solid — blocks all light behind it

Image 3  →  Sheer texture (translucent fabric)
           → Thin, gauzy, lightweight — light passes THROUGH it
           → This is NOT a solid material. Treat it like tinted glass.

═══════════════════════════════════════════════════════════
PHASE 1 — DEEP SCENE PARSING
═══════════════════════════════════════════════════════════

Before touching any pixel, perform a full scene audit:

1.1 LAYER DETECTION
    Curtains in a room exist in depth layers:
    → BACK LAYER   : Panels mounted closest to the window glass (usually sheer)
    → FRONT LAYER  : Panels mounted in front of the back layer (usually opaque)
    → SINGLE LAYER : Only one type of curtain present

    Identify how many layers exist and which panels belong to each layer.

1.2 FULL PANEL INVENTORY
    List every individual curtain panel:
    → Position: left / center / right / other
    → Layer: front or back
    → Style: straight-hanging / gathered / tied-back / pleated / draped

    CRITICAL: Tied-back or gathered curtains are STILL curtains.
    Even if a panel is pulled to the side, bunched, or held by a tie,
    its ENTIRE fabric surface must be replaced. Do not skip it.

1.3 SYMMETRY RULE
    For every panel on the LEFT side of the window, there is a
    corresponding panel on the RIGHT side.
    → They MUST receive identical texture treatment
    → Same material, same color depth, same fold rendering
    → If you replace the left, you MUST replace the right
    → If you see only one side done in your output, it is WRONG

1.4 CLASSIFY EACH PANEL

    OPAQUE if ANY of these are true:
    → Fabric is thick, heavy, or rich in texture
    → Nothing is visible through it
    → It hangs in the FRONT layer
    → It is tied back but clearly made of heavy material

    SHEER if ANY of these are true:
    → Light clearly passes through it
    → It is positioned directly against the window
    → It appears soft, thin, or gauzy
    → White or very light colored panels in the back layer

    UNCERTAIN → Default to OPAQUE. Never leave unclassified.

═══════════════════════════════════════════════════════════
PHASE 2 — MATERIAL REPLACEMENT
═══════════════════════════════════════════════════════════

2.1 OPAQUE PANELS — Apply Image 2

    → Replace 100% of every opaque panel's visible fabric surface
    → Follow every fold, crease, and pleat from the ORIGINAL panel exactly
    → Preserve the silhouette — do not add or remove fabric volume
    → Preserve gathered, tied-back, or draped shapes exactly as they appear
    → ALL opaque panels in the scene must be visually identical

2.2 SHEER PANELS — Apply Image 3

    FUNDAMENTAL PHYSICS OF SHEER FABRIC:
    → Sheer fabric does not block light — it FILTERS it
    → The window and any light source behind it remains partially visible
    → The fabric's color acts as a tint over the light, not a cover
    → Think of watercolor paint on glass, not a poster on a wall

    RENDERING INSTRUCTIONS:
    → Composite Image 3 at 30–50% opacity over the existing panel area
    → The window light, frame, and outdoor scene must be partially visible through it
    → Folds in the sheer must be soft, wispy, and lightweight in appearance
    → Highlights in the sheer should be near-white where light hits directly
    → The sheer must appear lighter than the opaque panels
    → If your sheer output could be mistaken for an opaque curtain, it is WRONG

    HARD REJECTION CRITERIA FOR SHEER:
    ✗ Sheer appears solid or blocks the window entirely → REDO
    ✗ Sheer color is as saturated as the opaque panels → REDO
    ✗ No window light is visible through the sheer → REDO
    ✗ Sheer folds look stiff or heavy → REDO

═══════════════════════════════════════════════════════════
PHASE 3 — PHOTOREALISM PASS
═══════════════════════════════════════════════════════════

3.1 LIGHTING INTEGRATION
    → Identify the room's dominant light source (window, ceiling, lamp)
    → Re-apply that lighting onto every replaced fabric surface
    → Opaque panels: deep shadows in fold troughs, highlights on fold peaks
    → Sheer panels: luminous where backlit by window, dimmer toward edges
    → No panel should have flat, uniform color — all must show tonal depth

3.2 FABRIC DETAIL
    → Texture grain from Image 2 and Image 3 must be visible at appropriate scale
    → Do not tile textures with visible repetition artifacts
    → Micro-wrinkles and fabric weave should be visible in close areas
    → Opaque fabric: rich, weighted drape feel
    → Sheer fabric: airy, barely-there feel

3.3 EDGE QUALITY
    → Panel edges must be clean and sharp
    → No halo, glow, or blur around curtain boundaries
    → No color bleeding between opaque and sheer zones
    → Tie-backs and gathered areas must show accurate fabric compression

═══════════════════════════════════════════════════════════
PHASE 4 — ABSOLUTE PRESERVATION ZONE
═══════════════════════════════════════════════════════════

The following elements must be PIXEL-PERFECT from Image 1. Zero changes:

    → Window: frame, glass, mullions, any light rays coming through
    → Room architecture: walls, ceiling, floor, skirting boards, cornices
    → All furniture: beds, sofas, tables, chairs, nightstands
    → All decor: rugs, cushions, plants, lamps, artwork
    → Room lighting: ceiling lights, ambient glow, shadows cast on walls
    → Camera: perspective, focal length, composition, aspect ratio
    → Tie-back hardware: curtain rings, hooks, rods, and tie-back accessories

═══════════════════════════════════════════════════════════
PHASE 5 — MANDATORY SELF-VALIDATION
═══════════════════════════════════════════════════════════

Run this checklist on your output before rendering the final image.
Any failed check requires correction before output.

COVERAGE:
□ Every opaque panel: 100% original fabric replaced by Image 2
□ Every sheer panel: 100% original fabric replaced by Image 3
□ No patch, strip, or corner of original curtain fabric remains

SYMMETRY:
□ Left opaque panel = Right opaque panel (identical)
□ All corresponding panels across the window treated equally
□ No panel on one side that was skipped on the other

SHEER QUALITY:
□ Sheer panel is visibly translucent
□ Window light or outdoor scene is partially visible through sheer
□ Sheer appears lighter and airier than opaque panels
□ Sheer folds look soft and weightless

REALISM:
□ Room lighting is naturally reflected on all fabric surfaces
□ Fabric folds have visible highlight and shadow variation
□ No panel looks flat, pasted, or digitally composited
□ Texture is appropriately scaled — no visible tiling

PRESERVATION:
□ Window, walls, floor, furniture: unchanged from Image 1
□ Room perspective and composition: unchanged
□ Non-curtain shadows and lighting: unchanged

FINAL:
□ Output is a single, complete, photorealistic interior photograph
□ A viewer unfamiliar with this process would believe it is a real room photo

═══════════════════════════════════════════════════════════
OUTPUT
═══════════════════════════════════════════════════════════
One photorealistic image. No explanation. No annotations.
The image must be indistinguishable from a professional interior design photograph.
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