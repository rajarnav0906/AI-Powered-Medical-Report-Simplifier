/**
 * Compute the Levenshtein distance between two strings.
 * This measures how many edits (insert, delete, substitute) are required
 * to transform one string into another.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - The edit distance
 */
export const levenshteinDistance = (a = "", b = "") => {
  const rows = b.length + 1;
  const cols = a.length + 1;

  // Create 2D matrix initialized with null
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(null));

  // Initialize first row and column
  for (let i = 0; i < cols; i++) matrix[0][i] = i;
  for (let j = 0; j < rows; j++) matrix[j][0] = j;

  // Fill in the matrix
  for (let j = 1; j < rows; j++) {
    for (let i = 1; i < cols; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // Deletion
        matrix[j - 1][i] + 1,      // Insertion
        matrix[j - 1][i - 1] + cost // Substitution
      );
    }
  }

  return matrix[rows - 1][cols - 1];
};
