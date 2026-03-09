// searchUtils.js
// Utility function for searching fabrics by name, description, or color

/**
 * Filters an array of fabric objects by a search query.
 * @param {Array<{name: string, description: string, color: string}>} textures - Array of fabric objects.
 * @param {string} query - The search string.
 * @returns {Array<{name: string, description: string, color: string}>} Filtered array matching the query.
 */

export function searchTextures(textures, query) {
  if (!query) return textures;

  const lowerQuery = query.toLowerCase();

  return textures.filter(
    t =>
      (t.name && t.name.toLowerCase().includes(lowerQuery)) ||
      (t.description && t.description.toLowerCase().includes(lowerQuery)) ||
      (t.color && t.color.toLowerCase().includes(lowerQuery))
  );
}