import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../../Events/Event.types";
import { ControlEvent } from "../../Events/ControlEventBase";

abstract class BaseGamepadAxesEvent extends ControlEvent<
  {},
  {
    stick: "Left" | "Right";
    axes: [x: number, y: number];
  }
> {
  get axes(): Readonly<[x: number, y: number]> {
    return this.origin.axes;
  }
  readonly inputType = ControlInputTypes.GamePadAxes;

  getStick() {

    return this.origin.stick;
  }
}

export class GamepadAxesMoveEvent extends BaseGamepadAxesEvent {
  static eventType = ControlEventTypes.GamePadAxesMove;
  readonly eventType = ControlEventTypes.GamePadAxesMove;
}
