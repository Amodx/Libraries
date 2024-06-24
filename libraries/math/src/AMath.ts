export class AMath {
  /**
   * Converts degrees to radians.
   * @param degrees - Angle in degrees.
   * @returns Angle in radians.
   */
  static DegreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees.
   * @param radians - Angle in radians.
   * @returns Angle in degrees.
   */
  static RadiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Clamps a number between a minimum and maximum value.
   * @param value - The number to clamp.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns The clamped value.
   */
  static Clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linearly interpolates between two values.
   * @param start - The start value.
   * @param end - The end value.
   * @param t - The interpolation factor (0 to 1).
   * @returns The interpolated value.
   */
  static Lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
  }

  /**
   * Checks if a number is within a specified range (inclusive).
   * @param value - The number to check.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns True if the number is within the range, otherwise false.
   */
  static IsInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Rounds a number to a specified number of decimal places.
   * @param value - The number to round.
   * @param decimalPlaces - The number of decimal places.
   * @returns The rounded number.
   */
  static RoundToDecimalPlaces(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }

  /**
   * Calculates the factorial of a number.
   * @param n - The number.
   * @returns The factorial of the number.
   */
  static Factorial(n: number): number {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}
