
import { ControlEvent } from "../Events/ControlEventBase";
import { Control } from "../Controls/Control";
import { ControlsMap } from "../Internal/ControlsMap";
import { ControlAction } from "../Controls/ControlAction";
import { ControlInputTypes } from "../Controls/ControlData";

export class User {
  _events = new Map<string, ControlEvent>();
  _controlsMapped = new Map<string, Control>();
  _controls = new Map<string, Control>();
  constructor(public id: number) {}

  getControlById(id: string) {
    this._controls.get(id);
  }
  getControlByType(id: string) {
    return this._controlsMapped.get(id);
  }

  clearControls() {
    this._events.clear();
    this._controlsMapped.clear();
    this._controls.clear();
  }

  registerControl(controlData: ControlAction) {
    const control = controlData.input;
    const controler = new Control(this, controlData);
    this._controls.set(controlData.id, controler);
    if (control[ControlInputTypes.KeyBoard]) {
      const keyBoardControl = control[ControlInputTypes.KeyBoard];
      const key = ControlsMap.getKeyBaordId(
        ControlsMap.mapKey(keyBoardControl.key),
        keyBoardControl.mode
      );
      this._controlsMapped.set(key, controler);
    }
    if (control[ControlInputTypes.Mouse]) {
      const mouseControl = control[ControlInputTypes.Mouse];
      const key = ControlsMap.getMouseId(
        mouseControl.button,
        mouseControl.mode
      );
      this._controlsMapped.set(key, controler);
    }
    if (control[ControlInputTypes.GamePadButton]) {
      const gamePadButtonControl = control[ControlInputTypes.GamePadButton];
      const key = ControlsMap.getGamePadId(
        gamePadButtonControl.button,
        gamePadButtonControl.mode
      );
      this._controlsMapped.set(key, controler);
    }
    if (control[ControlInputTypes.GamePadAxes]) {
      const gamePadButtonControl = control[ControlInputTypes.GamePadAxes];
      const key = ControlsMap.getGamePadAxeusId(gamePadButtonControl.stick);
      this._controlsMapped.set(key, controler);
    }
    if (control[ControlInputTypes.Scroll]) {
      const scrollControl = control[ControlInputTypes.Scroll];
      const key = ControlsMap.getScrollId(scrollControl.mode);
      this._controlsMapped.set(key, controler);
    }
  }
}
