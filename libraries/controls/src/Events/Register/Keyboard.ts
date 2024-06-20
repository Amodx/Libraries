import { ControlInputTypes } from "../../Controls/ControlData";
import { ControlEventTypes } from "../Event.types";
import { ControlEvent } from "../ControlEventBase";
import { Observable } from "@amodx/core/Observers/Observable";

export abstract class BaseKeyEvent extends ControlEvent<ControlInputTypes.KeyBoard> {
  readonly inputType = ControlInputTypes.KeyBoard;
  getKey() {
    return this.controler.data.input[ControlInputTypes.KeyBoard]?.key;
  }
}

export class KeyDownEvent extends BaseKeyEvent {
  static eventType = ControlEventTypes.KeyBoardDown;
  readonly eventType = ControlEventTypes.KeyBoardDown;

  observers = {
    onRelease: new Observable<void>(),
  };
}

export class KeyHoldEvent extends BaseKeyEvent {
  static eventType = ControlEventTypes.KeyBoardHold;
  readonly eventType = ControlEventTypes.KeyBoardHold;
}

export class KeyUpEvent extends BaseKeyEvent {
  static eventType = ControlEventTypes.KeyBoardUp;
  readonly eventType = ControlEventTypes.KeyBoardUp;
}
