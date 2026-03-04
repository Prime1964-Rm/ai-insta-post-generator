// src/carousel/badges.js

/**
 * Returns an array of badge objects for a given text.
 * Each badge has a label and color.
 */
export function detectBadges(text) {
    const badges = [];
  
    const mapping = [
      { regex: /\bSURGE\b/i, color: "#16a34a" },    // green
      { regex: /\bCRASH\b/i, color: "#dc2626" },    // red
      { regex: /\bAI\b/i, color: "#3b82f6" },       // blue
      { regex: /\bPROFITS\b/i, color: "#a855f7" }   // purple
    ];
  
    mapping.forEach(({ regex, color }) => {
      if (regex.test(text)) {
        badges.push({ label: text.match(regex)[0], color });
      }
    });
  
    return badges;
  }