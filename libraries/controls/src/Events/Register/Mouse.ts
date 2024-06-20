import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../Event.types";
import { ControlEvent } from "../ControlEventBase";
import { Observable } from "@amodx/core/Observers/Observable";

export abstract class BaseMouseEvent extends ControlEvent<ControlInputTypes.Mouse> {
  readonly inputType = ControlInputTypes.Mouse;
  getButton() {
    return this.controler.data.input[ControlInputTypes.Mouse]?.button;
  }
}

export class MouseDownEvent extends BaseMouseEvent {
  static eventType = ControlEventTypes.MouseDown;
  readonly eventType = ControlEventTypes.MouseDown;
}

export class MouseHoldEvent extends BaseMouseEvent {
  static eventType = ControlEventTypes.MouseHold;
  readonly eventType = ControlEventTypes.MouseHold;
}

export class MouseUpEvent extends BaseMouseEvent {
  static eventType = ControlEventTypes.MouseUp;
  readonly eventType = ControlEventTypes.MouseUp;
}

export abstract class BaseWheelEvent extends ControlEvent<ControlInputTypes.Scroll> {
  readonly inputType = ControlInputTypes.Scroll;
  getDirection() {
    return this.controler.data.input[ControlInputTypes.Scroll]?.mode;
  }
}

export class WheelUpEvent extends BaseWheelEvent {
  static eventType = ControlEventTypes.WheelUp;
  readonly eventType = ControlEventTypes.WheelUp;
}

export class WheelDownEvent extends BaseWheelEvent {
  static eventType = ControlEventTypes.WheelDown;
  readonly eventType = ControlEventTypes.WheelDown;
}
