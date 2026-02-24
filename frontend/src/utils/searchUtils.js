// searchUtils.js
// Utility function for searching textures by name or description

/**
 * Filters an array of texture objects by a search query.
 * @param {Array<{name: string, description: string}>} textures - Array of texture objects.
 * @param {string} query - The search string.
 * @returns {Array<{name: string, description: string}>} Filtered array matching the query.
 */
export function searchTextures(textures, query) {
  if (!query) return textures;
  const lowerQuery = query.toLowerCase();
  return textures.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
  );
}
