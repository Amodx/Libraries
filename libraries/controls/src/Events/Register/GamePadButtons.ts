import { ControlInputTypes } from "../../Controls//ControlData";
import { ControlEventTypes } from "../Event.types";
import { ControlEvent } from "../ControlEventBase";

abstract class BaseGamepadButtonEvent extends ControlEvent {
  readonly inputType = ControlInputTypes.GamePadButton;

  getButton() {
    return this.control.data.input[ControlInputTypes.GamePadButton]?.button;
  }
}

export class GamepadDownEvent extends BaseGamepadButtonEvent {
  static eventType = ControlEventTypes.GamePadButtonDown;
  readonly eventType = ControlEventTypes.GamePadButtonDown;
}

export class GamepadButtonHoldEvent extends BaseGamepadButtonEvent {
  static eventType = ControlEventTypes.GamePadButtonHold;
  readonly eventType = ControlEventTypes.GamePadButtonHold;
}

export class GamepadUpEvent extends BaseGamepadButtonEvent {
  static eventType = ControlEventTypes.GamePadButtonUp;
  readonly eventType = ControlEventTypes.GamePadButtonHold;
}
