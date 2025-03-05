/**
 * Improved utility functions for creating SVG paths for word cloud shapes
 */

/**
 * Creates a rectangle shape
 * @param {number} x - X position of top-left corner
 * @param {number} y - Y position of top-left corner
 * @param {number} width - Width of rectangle
 * @param {number} height - Height of rectangle
 * @returns {string} SVG path string
 */
export const createRectangle = (
  x = 100,
  y = 100,
  width = 400,
  height = 300
) => {
  // Ensure the path is closed with Z
  return `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${
    y + height
  } Z`;
};

/**
 * Creates a circle shape
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center
 * @param {number} radius - Radius of circle
 * @returns {string} SVG path string
 */
export const createCircle = (cx = 250, cy = 250, radius = 200) => {
  // Use proper SVG arc notation
  return `M${cx + radius},${cy}
            A${radius},${radius} 0 1,1 ${cx - radius},${cy}
            A${radius},${radius} 0 1,1 ${cx + radius},${cy}
            Z`;
};

/**
 * Creates an improved heart shape
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center
 * @param {number} size - Size of heart
 * @returns {string} SVG path string
 */
export const createHeart = (cx = 250, cy = 250, size = 150) => {
  // A more accurate heart shape with smoother curves
  return `M ${cx} ${cy - size / 5}
            C ${cx - size / 2} ${cy - size} ${cx - size} ${cy - size / 4} ${
    cx - size / 4
  } ${cy + size / 2}
            L ${cx} ${cy + size}
            L ${cx + size / 4} ${cy + size / 2}
            C ${cx + size} ${cy - size / 4} ${cx + size / 2} ${
    cy - size
  } ${cx} ${cy - size / 5}
            Z`;
};

/**
 * Creates an improved star shape
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center
 * @param {number} outerRadius - Outer radius of star
 * @param {number} innerRadius - Inner radius of star (for points)
 * @param {number} points - Number of points
 * @returns {string} SVG path string
 */
export const createStar = (
  cx = 250,
  cy = 250,
  outerRadius = 200,
  innerRadius = 80,
  points = 5
) => {
  let path = "";

  // Calculate points with more precision
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2; // Start from top

    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    if (i === 0) {
      path += `M ${x} ${y} `;
    } else {
      path += `L ${x} ${y} `;
    }
  }

  path += "Z"; // Close the path
  return path;
};

/**
 * Creates a cloud shape
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center
 * @param {number} width - Width of cloud
 * @param {number} height - Height of cloud
 * @returns {string} SVG path string
 */
export const createCloud = (cx = 300, cy = 200, width = 400, height = 200) => {
  // More detailed cloud with proper bezier curves
  return `M ${cx - width / 2 + width / 10} ${cy + height / 3}
            C ${cx - width / 2} ${cy + height / 3} ${cx - width / 2} ${cy} ${
    cx - width / 3
  } ${cy - height / 6}
            C ${cx - width / 3} ${cy - height / 2} ${cx - width / 6} ${
    cy - height / 2
  } ${cx - width / 6} ${cy - height / 4}
            C ${cx - width / 6} ${cy - height / 1.5} ${cx + width / 6} ${
    cy - height / 1.2
  } ${cx + width / 6} ${cy - height / 4}
            C ${cx + width / 4} ${cy - height / 2} ${cx + width / 3} ${
    cy - height / 3
  } ${cx + width / 3} ${cy - height / 6}
            C ${cx + width / 2} ${cy - height / 6} ${cx + width / 2} ${
    cy + height / 6
  } ${cx + width / 3} ${cy + height / 6}
            C ${cx + width / 2.5} ${cy + height / 2} ${cx} ${cy + height / 2} ${
    cx - width / 6
  } ${cy + height / 3}
            Z`;
};

/**
 * Creates a tree shape
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center base
 * @param {number} width - Width of tree
 * @param {number} height - Height of tree
 * @returns {string} SVG path string
 */
export const createTree = (cx = 250, cy = 400, width = 250, height = 400) => {
  const trunkWidth = width * 0.2;
  const trunkHeight = height * 0.3;

  // Create a more realistic tree shape
  return `M ${cx - trunkWidth / 2} ${cy}
            L ${cx - trunkWidth / 2} ${cy - trunkHeight}
            L ${cx - width / 2} ${cy - trunkHeight}
            C ${cx - width / 2.2} ${cy - height * 0.6} ${cx - width / 3} ${
    cy - height * 0.7
  } ${cx} ${cy - height}
            C ${cx + width / 3} ${cy - height * 0.7} ${cx + width / 2.2} ${
    cy - height * 0.6
  } ${cx + width / 2} ${cy - trunkHeight}
            L ${cx + trunkWidth / 2} ${cy - trunkHeight}
            L ${cx + trunkWidth / 2} ${cy}
            Z`;
};

/**
 * Creates a mountain range shape
 * @param {number} width - Width of the mountain range
 * @param {number} height - Height of the mountain range
 * @param {number} peaks - Number of peaks
 * @returns {string} SVG path string
 */
export const createMountains = (width = 500, height = 300, peaks = 3) => {
  let path = `M 0 ${height} `;

  const segmentWidth = width / (peaks * 2);

  for (let i = 0; i < peaks; i++) {
    const peakHeight = height - (Math.random() * 0.3 + 0.7) * height;
    const startX = i * segmentWidth * 2;
    const peakX = startX + segmentWidth;
    const endX = startX + segmentWidth * 2;

    path += `L ${peakX} ${peakHeight} `;
    path += `L ${endX} ${height} `;
  }

  path += `L ${width} ${height} Z`;
  return path;
};

/**
 * Creates a simple animal silhouette (e.g., a bird)
 * @param {number} cx - X position of center
 * @param {number} cy - Y position of center
 * @param {number} size - Size of the silhouette
 * @returns {string} SVG path string
 */
export const createBird = (cx = 250, cy = 250, size = 200) => {
  return `M ${cx - size / 2} ${cy}
            C ${cx - size / 4} ${cy - size / 4} ${cx - size / 8} ${
    cy - size / 2
  } ${cx} ${cy - size / 4}
            C ${cx + size / 8} ${cy - size / 2} ${cx + size / 4} ${
    cy - size / 4
  } ${cx + size / 2} ${cy}
            C ${cx + size / 4} ${cy + size / 8} ${cx + size / 8} ${
    cy + size / 4
  } ${cx} ${cy + size / 8}
            C ${cx - size / 8} ${cy + size / 4} ${cx - size / 4} ${
    cy + size / 8
  } ${cx - size / 2} ${cy}
            Z`;
};
