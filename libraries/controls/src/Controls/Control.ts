import { ControlEventTypes } from "../Events/Event.types";
import {
  ControlEvents,
  ControlEventManager,
} from "../Events/ControlsEventManager";
import {
  ControlData,
  ControlInputData,
  ControlInputTypes,
} from "./ControlData";
import { ControlEvent } from "../Events/ControlEventBase";
import { User } from "../Users/User";
import { ControlsMap } from "../ControlsMap";
import { ControlAction } from "./ControlAction";

export class Control {
  constructor(public user: User, public data: ControlAction) {
    this.registerEvents(data.input);
  }
  _events = new Map<string, ControlEvent>();

  run(key: string) {
    const event = this.getEvent(key);
    if (!event) return;
    this.data.action(event as ControlEvents);
  }

  getEvent(id: string) {
    return this._events.get(id);
  }
  registerEvents(control: ControlInputData) {
    if (control[ControlInputTypes.KeyBoard]) {
      const keyBoardControl = control[ControlInputTypes.KeyBoard];
      const key = ControlsMap.getKeyBaordId(
        ControlsMap.mapKey(keyBoardControl.key),
        keyBoardControl.mode
      );
      keyBoardControl.mode == "down" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardDown)!)(
            this
          )
        );
      keyBoardControl.mode == "up" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardUp)!)(
            this
          )
        );
      keyBoardControl.mode == "hold" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardHold)!)(
            this
          )
        );
    }
    if (control[ControlInputTypes.Mouse]) {
      const mouseControl = control[ControlInputTypes.Mouse];
      const key = ControlsMap.getMouseId(
        mouseControl.button,
        mouseControl.mode
      );
      mouseControl.mode == "down" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.MouseDown)!)(this)
        );
      mouseControl.mode == "up" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.MouseHold)!)(this)
        );
      mouseControl.mode == "hold" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.MouseHold)!)(this)
        );
    }
    if (control[ControlInputTypes.GamePadButton]) {
      const gamePadButtonControl = control[ControlInputTypes.GamePadButton];
      const key = ControlsMap.getGamePadId(
        gamePadButtonControl.button,
        gamePadButtonControl.mode
      );
      gamePadButtonControl.mode == "down" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(
            ControlEventTypes.GamePadButtonDown
          )!)(this)
        );
      gamePadButtonControl.mode == "up" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(
            ControlEventTypes.GamePadButtonUp
          )!)(this)
        );
      gamePadButtonControl.mode == "hold" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(
            ControlEventTypes.GamePadButtonHold
          )!)(this)
        );
    }
    if (control[ControlInputTypes.GamePadAxes]) {
      const gamePadButtonControl = control[ControlInputTypes.GamePadAxes];
      const key = ControlsMap.getGamePadAxeusId(gamePadButtonControl.stick);

      this._events.set(
        key,
        new (ControlEventManager.getEvent(ControlEventTypes.GamePadAxesMove)!)(
          this
        )
      );
    }
    if (control[ControlInputTypes.Scroll]) {
      const scrollControl = control[ControlInputTypes.Scroll];
      const key = ControlsMap.getScrollId(scrollControl.mode);
      scrollControl.mode == "up" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.WheelUp)!)(this)
        );
      scrollControl.mode == "down" &&
        this._events.set(
          key,
          new (ControlEventManager.getEvent(ControlEventTypes.WheelDown)!)(this)
        );
    }
  }
}
