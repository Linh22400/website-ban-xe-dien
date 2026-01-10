/**
 * Lifecycle callbacks for car-model
 * Sanitizes data before create/update to prevent null/undefined colors
 */

export default {
  // Before creating a new car model
  beforeCreate(event) {
    const { data } = event.params;
    sanitizeColors(data);
  },

  // Before updating an existing car model
  beforeUpdate(event) {
    const { data } = event.params;
    sanitizeColors(data);
  },
};

/**
 * Remove null/undefined colors from the colors array
 * Ensures all colors have valid name and hex values
 */
function sanitizeColors(data: any) {
  if (data.color && Array.isArray(data.color)) {
    // Filter out null, undefined, and invalid color objects
    data.color = data.color.filter((c: any) => {
      if (!c) return false; // Remove null/undefined
      if (!c.name || typeof c.name !== 'string') return false; // Require valid name
      if (!c.hex || typeof c.hex !== 'string') return false; // Require valid hex
      return true;
    });

    // Validate hex format and set default if invalid
    data.color = data.color.map((c: any) => {
      // Ensure hex starts with # and is valid format
      if (!c.hex.startsWith('#')) {
        c.hex = '#' + c.hex;
      }
      // If hex is still invalid, use default gray
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(c.hex)) {
        console.warn(`Invalid hex color "${c.hex}" for "${c.name}", using default #cccccc`);
        c.hex = '#cccccc';
      }
      return c;
    });

    console.log(`Sanitized colors: ${data.color.length} valid colors remaining`);
  }
}
