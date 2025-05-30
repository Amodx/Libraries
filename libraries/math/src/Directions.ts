import { Vector2Like } from "./Abstract/Vectors/Vector2Like";

export enum CompassDirections {
  North = "north",
  South = "south",
  West = "west",
  East = "east",
  NorthEast = "north-east",
  NorthWest = "north-west",
  SouthEast = "south-east",
  SouthWest = "south-west",
}

export enum CompassAngles {
  North = 0,
  NorthEast = Math.PI / 4,
  East = Math.PI / 2,
  SouthEast = (3 * Math.PI) / 4,
  South = Math.PI,
  SouthWest = (5 * Math.PI) / 4,
  West = (3 * Math.PI) / 2,
  NorthWest = (7 * Math.PI) / 4,
}

export const CompassAnglesMap: Record<CompassDirections, CompassAngles> = {
  [CompassDirections.North]: CompassAngles.North,
  [CompassDirections.South]: CompassAngles.South,
  [CompassDirections.West]: CompassAngles.West,
  [CompassDirections.East]: CompassAngles.East,
  [CompassDirections.NorthEast]: CompassAngles.NorthEast,
  [CompassDirections.NorthWest]: CompassAngles.NorthWest,
  [CompassDirections.SouthEast]: CompassAngles.SouthEast,
  [CompassDirections.SouthWest]: CompassAngles.SouthWest,
};

export class Directions {
  static Rotate(
    direction: CompassDirections,
    angle: number
  ): CompassDirections {
    const currentAngle = CompassAnglesMap[direction];
    const newAngle = (currentAngle + angle) % (2 * Math.PI);

    let closestDirection = CompassDirections.North;
    let smallestDifference = Math.PI * 2;

    for (const dir in CompassAngles) {
      const dirAngle = CompassAngles[dir as keyof typeof CompassAngles];
      const difference = Math.abs(newAngle - dirAngle);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestDirection = dir as CompassDirections;
      }
    }

    return closestDirection.toLowerCase() as any;
  }

  /**
   * Rotates the given direction by 45 degrees (half a compass direction).
   * @param direction - The current compass direction.
   * @returns The new compass direction after rotating by 45 degrees.
   */
  static RotateHalf(direction: CompassDirections): CompassDirections {
    return this.Rotate(direction, Math.PI / 4);
  }

  /**
   * Rotates the given direction by 90 degrees (a full compass direction).
   * @param direction - The current compass direction.
   * @returns The new compass direction after rotating by 90 degrees.
   */
  static RotateWhole(direction: CompassDirections): CompassDirections {
    return this.Rotate(direction, Math.PI / 2);
  }

  /**
   * Returns the opposite direction for a given compass direction.
   * @param direction - The compass direction.
   * @returns The opposite compass direction.
   */
  static GetOppositeDirection(direction: CompassDirections): CompassDirections {
    const oppositeAngle =
      (CompassAnglesMap[direction] + Math.PI) % (2 * Math.PI);
    for (const dir in CompassAngles) {
      if (CompassAngles[dir as keyof typeof CompassAngles] === oppositeAngle) {
        return dir.toLowerCase() as CompassDirections;
      }
    }

    return direction.toLowerCase() as any;
  }

  /**
   * Checks if two directions are perpendicular.
   * @param dir1 - The first compass direction.
   * @param dir2 - The second compass direction.
   * @returns True if the directions are perpendicular, otherwise false.
   */
  static ArePerpendicular(
    dir1: CompassDirections,
    dir2: CompassDirections
  ): boolean {
    const angle1 = CompassAnglesMap[dir1];
    const angle2 = CompassAnglesMap[dir2];

    const angleDifference = Math.abs(angle1 - angle2);
    return (
      Math.abs(angleDifference - Math.PI / 2) < 0.0001 ||
      Math.abs(angleDifference - (3 * Math.PI) / 2) < 0.0001
    );
  }

  /**
   * Converts a compass direction to a vector.
   * @param direction - The compass direction.
   * @returns The corresponding vector.
   */
  static ToVector(direction: CompassDirections): Vector2Like {
    const angle = CompassAnglesMap[direction];
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  /**
   * Converts a normalized vector to a compass direction.
   * @param vector - The normalized vector.
   * @returns The corresponding compass direction.
   */
  static FromVector(vector: Vector2Like): CompassDirections {
    // const angle = Math.atan2(vector.y, vector.x);
    const angle = Math.atan2(vector.x, vector.y);
    const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);

    let closestDirection = CompassDirections.North;
    let smallestDifference = Math.PI * 2;

    for (const dir in CompassAngles) {
      const dirAngle = CompassAngles[dir as keyof typeof CompassAngles];
      const difference = Math.abs(normalizedAngle - dirAngle);

      const altDifference = Math.min(
        difference,
        Math.abs(2 * Math.PI - difference)
      );

      if (altDifference < smallestDifference) {
        smallestDifference = altDifference;
        closestDirection = dir as CompassDirections;
      }
    }

    return CompassDirections[
      closestDirection as any as keyof typeof CompassDirections
    ];
  }
}
