import { Vector2Like } from "../Abstract/Vectors/Vector2Like"

export class Square {
  static Create(
    center: Vector2Like = Vector2Like.Create(),
    sideLength: number = 1
  ) {
    return new Square(center, sideLength);
  }

  constructor(
    public center: Vector2Like = Vector2Like.Create(),
    public sideLength: number = 1
  ) {}
}
