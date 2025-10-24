/**
 * Convert centimeters to millimeters
 */
export const cmToMm = (cm: number): number => {
  return cm * 10;
};

/**
 * Convert inches to millimeters
 */
export const inchesToMm = (inches: number): number => {
  return inches * 25.4;
};

/**
 * Convert millimeters to centimeters
 */
export const mmToCm = (mm: number): number => {
  return mm / 10;
};

/**
 * Convert millimeters to inches
 */
export const mmToInches = (mm: number): number => {
  return mm / 25.4;
};

/**
 * Convert a value to millimeters based on the unit
 */
export const toMm = (value: number, unit: 'cm' | 'inches'): number => {
  switch (unit) {
    case 'cm':
      return cmToMm(value);
    case 'inches':
      return inchesToMm(value);
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
};

/**
 * Convert millimeters to the specified unit
 */
export const fromMm = (mm: number, unit: 'cm' | 'inches'): number => {
  switch (unit) {
    case 'cm':
      return mmToCm(mm);
    case 'inches':
      return mmToInches(mm);
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
};

/**
 * Format a number to a specified number of decimal places
 */
export const formatNumber = (value: number, decimals: number = 1): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Validate that a dimension value is positive
 */
export const validateDimension = (value: number): boolean => {
  return value > 0 && !isNaN(value) && isFinite(value);
};
