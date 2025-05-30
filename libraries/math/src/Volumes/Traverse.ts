import { Vec2Array, Vec3Array } from "../Abstract/Vectors/Vector.types";

export class Traverse {
  static ForEachFromToVec2(
    start: Vec2Array,
    end: Vec2Array,
    step: number,
    run: (x: number, y: number) => void
  ) {
    const xStep = start[0] < end[0] ? step : -step;
    const yStep = start[1] < end[1] ? step : -step;

    for (let x = start[0]; xStep > 0 ? x <= end[0] : x >= end[0]; x += xStep) {
      for (
        let y = start[1];
        yStep > 0 ? y <= end[1] : y >= end[1];
        y += yStep
      ) {
        run(x, y);
      }
    }
  }

  static *FromToVec2(
    start: Vec2Array,
    end: Vec2Array,
    step: number
  ) {
    const xStep = start[0] < end[0] ? step : -step;
    const yStep = start[1] < end[1] ? step : -step;

    for (let x = start[0]; xStep > 0 ? x <= end[0] : x >= end[0]; x += xStep) {
      for (
        let y = start[1];
        yStep > 0 ? y <= end[1] : y >= end[1];
        y += yStep
      ) {
        yield { x, y };
      }
    }
  }

  static ForEachFromToVec3(
    start: Vec3Array,
    end: Vec3Array,
    step: number,
    run: (x: number, y: number, z: number) => void
  ) {
    const xStep = start[0] < end[0] ? step : -step;
    const yStep = start[1] < end[1] ? step : -step;
    const zStep = start[2] < end[2] ? step : -step;

    for (let x = start[0]; xStep > 0 ? x <= end[0] : x >= end[0]; x += xStep) {
      for (
        let y = start[1];
        yStep > 0 ? y <= end[1] : y >= end[1];
        y += yStep
      ) {
        for (
          let z = start[2];
          zStep > 0 ? z <= end[2] : z >= end[2];
          z += zStep
        ) {
          run(x, y, z);
        }
      }
    }
  }

  static *FromToVec3(
    start: Vec3Array,
    end: Vec3Array,
    step: number
  ) {
    const xStep = start[0] < end[0] ? step : -step;
    const yStep = start[1] < end[1] ? step : -step;
    const zStep = start[2] < end[2] ? step : -step;

    for (let x = start[0]; xStep > 0 ? x <= end[0] : x >= end[0]; x += xStep) {
      for (
        let y = start[1];
        yStep > 0 ? y <= end[1] : y >= end[1];
        y += yStep
      ) {
        for (
          let z = start[2];
          zStep > 0 ? z <= end[2] : z >= end[2];
          z += zStep
        ) {
          yield { x, y, z };
        }
      }
    }
  }
}