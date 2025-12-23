/**
 * Determines if a color is dark or light
 * @param {string} color - Hex color (e.g., '#000000') or rgb(a) color
 * @returns {boolean} - true if dark, false if light
 */
export function isDarkColor(color) {
  if (!color) return false;
  
  let r, g, b;
  
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    r = parseInt(matches[0]);
    g = parseInt(matches[1]);
    b = parseInt(matches[2]);
  } else {
    return false;
  }
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance < 0.5;
}

/**
 * Get text colors based on background
 * Returns object with two text colors for variety
 */
export function getTextColors(bgColor) {
  if (isDarkColor(bgColor)) {
    return {
      textColor1: '#e5e7eb',      // Pure white for primary text
      textColor2: '#d1d5db'     // gray-300 for secondary text
    };
  } else {
    return {
      textColor1: '#030712',      // Pure black for primary text
      textColor2: '#374151'      // gray-700 for secondary text
    };
  }
}