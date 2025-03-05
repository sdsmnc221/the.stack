/**
 * Creates a simple flowerpot SVG path
 * @param {number} cx - X center position
 * @param {number} cy - Y center position
 * @param {number} width - Width of pot
 * @param {number} height - Height of pot
 * @returns {string} SVG path string
 */
export const createFlowerpotPath = (
  cx = 250,
  cy = 300,
  width = 200,
  height = 250
) => {
  const potTopWidth = width;
  const potBottomWidth = width * 0.8;
  const potHeight = height * 0.6;
  const rimHeight = height * 0.1;

  // Calculate coordinates
  const potTopY = cy - potHeight / 2;
  const potBottomY = cy + potHeight / 2;
  const rimTopY = potTopY - rimHeight;

  // Path construction
  return `
      M ${cx - potTopWidth / 2},${potTopY}
      L ${cx - potBottomWidth / 2},${potBottomY}
      L ${cx + potBottomWidth / 2},${potBottomY}
      L ${cx + potTopWidth / 2},${potTopY}
      L ${cx + potTopWidth / 2},${rimTopY}
      L ${cx - potTopWidth / 2},${rimTopY}
      Z
    `;
};
