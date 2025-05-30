import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../Event.types";
import { ControlEvent } from "../ControlEventBase";
import { Control } from "../../Controls/Control";
import { ControlsInternal } from "../../Internal/ControlsInternal";

abstract class BaseMouseEvent<
  Events extends Record<string, any>,
> extends ControlEvent<Events, MouseEvent> {
  readonly inputType = ControlInputTypes.Mouse;
  getButton() {
    return this.origin.button;
  }
}

export class MouseDownEvent extends BaseMouseEvent<{
  release: {};
}> {
  static eventType = ControlEventTypes.MouseDown;
  readonly eventType = ControlEventTypes.MouseDown;
  constructor(control: Control, event: MouseEvent) {
    super(control, event);
    ControlsInternal.addMouseButtonForRelease(`${event.button}`, this);
  }
}

export class MouseHoldEvent extends BaseMouseEvent<{}> {
  static eventType = ControlEventTypes.MouseHold;
  readonly eventType = ControlEventTypes.MouseHold;
}

export class MouseUpEvent extends BaseMouseEvent<{}> {
  static eventType = ControlEventTypes.MouseUp;
  readonly eventType = ControlEventTypes.MouseUp;
}

abstract class BaseWheelEvent extends ControlEvent {
  readonly inputType = ControlInputTypes.Scroll;
  getDirection() {
    return this.control.data.input[ControlInputTypes.Scroll]?.mode;
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
