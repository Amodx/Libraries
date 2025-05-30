import { Vector3Like } from "@amodx/math";
import { GUI } from "dat.gui";

export function addVector({
  name,
  gui,
  range,
  vector,
  step,

  onChange,
}: {
  name: string;
  gui: GUI;
  step?: number;
  vector: Vector3Like;
  range?: [min: number, max: number];
  onChange: () => void;
}) {
  step = step ? step : 0.1;
  range = range ? range : [-1, 1];
  gui
    .add(vector, "x", ...range)
    .step(step)
    .onChange(onChange)
    .name(`${name} X`);
  gui
    .add(vector, "y", ...range)
    .step(step)
    .onChange(onChange)
    .name(`${name} Y`);
  gui
    .add(vector, "z", ...range)
    .step(step)
    .onChange(onChange)
    .name(`${name} Z`);
}
