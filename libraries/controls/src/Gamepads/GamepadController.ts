import { Controls } from "../Controls.js";
import { DefaultGamePadButtons } from "../index.js";
import { GamepadAxesMoveEvent } from "../Events/Register/GamePadAxes.js";
import { Observable } from "@amodx/core/Observers/Observable.js";
import { User } from "../Users/User.js";
import { ControlsMap } from "../Internal/ControlsMap.js"
import { ControlEventManager } from "../Events/ControlsEventManager.js";
import { ControlEventTypes } from "../Events/Event.types.js";
import { ControlsInternal } from "../Internal/ControlsInternal.js";

export class GamepadController {
  static BINDINGS = {
    XBOX360: <DefaultGamePadButtons[]>[
      "A",
      "B",
      "X",
      "Y",
      "LB",
      "RB",
      "Left Trigger",
      "Right Trigger",

      "Back",
      "Start",
      "Left Analog In",
      "Right Analog In",

      "DPad Up",
      "DPad Down",
      "DPad Left",
      "DPad Right",
    ],
  };

  invertYAxis: boolean;

  bindings: DefaultGamePadButtons[];
  pressed: Record<string, number> = {};

  axes: number[];

  observables = {
    buttonPressed: new Observable<{ number: number; key: string }>(),
    buttonReleased: new Observable<{ number: number; key: string }>(),
  };

  constructor(
    public user: User,
    public gamepad: Gamepad
  ) {
    for (const button of GamepadController.BINDINGS.XBOX360) {
      this.pressed[button] = -1;
    }
    this.bindings = GamepadController.BINDINGS.XBOX360;
    if (Controls._os == "mac") {
      this.invertYAxis = true;
    }
  }

  _axes1: [x: number, y: number] = [0, 0];
  _axes2: [x: number, y: number] = [0, 0];

  _testAxes(value: number) {
    return (value * 100) >> 0;
  }

  update() {
    const gp = navigator.getGamepads()[this.gamepad.index]!;

    if (this._testAxes(gp.axes[0]) || this._testAxes(gp.axes[1])) {
      const key = ControlsMap.getGamePadAxeusId("Left");
      const control = this.user.getControlByType(key);
      if (control) {
        this._axes1[0] = gp.axes[0];
        this._axes1[1] = gp.axes[1] * (this.invertYAxis ? -1 : 1);
        const event = new GamepadAxesMoveEvent(control, {
          stick: "Left",
          axes: this._axes1,
        });

        control.run(event);
      }
    }

    if (this._testAxes(gp.axes[2]) || this._testAxes(gp.axes[3])) {
      const key = ControlsMap.getGamePadAxeusId("Left");
      const control = this.user.getControlByType(key);
      if (control) {
        this._axes2[0] = gp.axes[2];
        this._axes2[1] = gp.axes[3] * (this.invertYAxis ? -1 : 1);
        const event = new GamepadAxesMoveEvent(control, {
          stick: "Right",
          axes: this._axes2,
        });
        control.run(event);
      }
    }
    for (let i = 0; i < gp.buttons.length; i++) {
      //   if (!this.bindings[i]) continue;
      const id = `${i}-${this.gamepad.index}`;
      const button = gp.buttons[i];
      const buttonKey = this.bindings[i];
      if (button.pressed) {
        if (this.pressed[buttonKey] < 0) {
          const key = ControlsMap.getGamePadId(buttonKey, "down");
          const control = this.user.getControlByType(key);
          if (control) {
            control.run(
              new (ControlEventManager.getEvent(
                ControlEventTypes.GamePadButtonDown
              )!)(control, this)
            );
          }
          this.observables.buttonPressed.notify({
            number: i,
            key: buttonKey,
          });
          this.pressed[buttonKey] = 1;
        }

        this.pressed[buttonKey]++;

        const key = ControlsMap.getGamePadId(buttonKey, "hold");
        const control = this.user.getControlByType(key);

        if (control) {
          if (!ControlsInternal.hasHold(id)) {
            control.run(
              new (ControlEventManager.getEvent(
                ControlEventTypes.GamePadButtonHold
              )!)(control, this)
            );
            const input = control.data.input;
            let delay = input["gamepad-button"]?.holdDelay;
            delay = delay ? delay : 10;
            ControlsInternal.addHold(
              id,
              () => {
                control.run(
                  new (ControlEventManager.getEvent(
                    ControlEventTypes.GamePadButtonHold
                  )!)(control, this)
                );
              },
              delay,
              input["gamepad-button"]?.initHoldDelay
                ? input["gamepad-button"]?.initHoldDelay
                : 250
            );
          }
        }
      } else {
        if (this.pressed[buttonKey]) {
          const key = ControlsMap.getGamePadId(buttonKey, "up");
          const control = this.user.getControlByType(key);
          if (control) {
            control.run(
              new (ControlEventManager.getEvent(
                ControlEventTypes.GamePadButtonUp
              )!)(control, this)
            );
          }
        }
        if (ControlsInternal.hasHold(id)) {
          ControlsInternal.removeHold(id);
        }
        this.pressed[buttonKey] = -1;
        this.observables.buttonReleased.notify({
          number: i,
          key: buttonKey,
        });
      }
    }
  }
}
