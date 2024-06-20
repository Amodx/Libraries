import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../../Events/Event.types";
import { ControlEvent } from "../../Events/ControlEventBase";

export abstract class BaseGamepadAxesEvent extends ControlEvent<ControlInputTypes.GamePadAxes> {
  axes: [x: number, y: number] = [0, 0];
  readonly inputType = ControlInputTypes.GamePadAxes;

  getStick() {
    return this.controler.data.input[ControlInputTypes.GamePadAxes]?.stick;
  }
}

export class GamepadAxesMoveEvent extends BaseGamepadAxesEvent {
  static eventType = ControlEventTypes.GamePadAxesMove;
  readonly eventType = ControlEventTypes.GamePadAxesMove;
}
