import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../Event.types";
import { ControlEvent } from "../ControlEventBase";
import { Control } from "../../Controls/Control";
import { ControlsInternal } from "../../Internal/ControlsInternal";

abstract class BaseKeyEvent<
  Events extends Record<string, any>,
> extends ControlEvent<Events, KeyboardEvent> {
  readonly inputType = ControlInputTypes.KeyBoard;
  getKey() {
    return this.origin.key;
  }
}

export class KeyDownEvent extends BaseKeyEvent<{
  release: {};
}> {
  static eventType = ControlEventTypes.KeyBoardDown;
  readonly eventType = ControlEventTypes.KeyBoardDown;
  constructor(control: Control, event: KeyboardEvent) {
    super(control, event);
    ControlsInternal.addKeyForRelease(event.key, this);
  }
}

export class KeyHoldEvent extends BaseKeyEvent<{}> {
  static eventType = ControlEventTypes.KeyBoardHold;
  readonly eventType = ControlEventTypes.KeyBoardHold;
}

export class KeyUpEvent extends BaseKeyEvent<{}> {
  static eventType = ControlEventTypes.KeyBoardUp;
  readonly eventType = ControlEventTypes.KeyBoardUp;
}
