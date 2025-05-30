import { GamepadManager } from "./Gamepads/GamepadManager.js";
import { ControlData, ControlInputData } from "./Controls/ControlData.js";
import { ControlGroupData, ControlAction } from "./Controls/ControlAction.js";
import { RecursivePartial } from "@amodx/core";
import { User } from "./Users/User.js";
import { Environment } from "@amodx/core/Environment/Environment.js";

import { ControlsInternal } from "./Internal/ControlsInternal.js";
import InitControls from "./Internal/InitControls.js";
import { UserManager } from "./Users/UserManager.js";
import { ControlRegister } from "./Controls/ControlRegister.js";
export class Controls {
  static controls = ControlRegister;
  static _os = Environment.system.os;

  static _capturing = false;
  static _capturingMode: "gamepad" | "keyboard" = "gamepad";
  static _capturedData: RecursivePartial<ControlInputData> | null = null;
  static mainUser: User;
  static controlRootElement: HTMLElement | Window = window;
  private constructor() {}
  static reInitControls = () => {};
  static clearControls = () => {};

  private static _initalized = false;
  static init(controlRootElement: HTMLElement | Window = window) {
    this.controlRootElement = controlRootElement;
    if (this._initalized) return this;
    this._initalized = true;
    const { addListeners, removeListeners } = InitControls(this);
    this.clearControls = () => {
      removeListeners();
    };
    this.reInitControls = () => {
      addListeners();
    };
    return this;
  }

  static registerControls(data: ControlGroupData[]) {
    this.controls.registerData(data);
    return this;
  }

  static getControl(id: string) {
    return this.controls.getControlData(id);
  }

  static captureControlForInput(
    controlId: string,
    mode: "keyboard" | "gamepad" = "keyboard"
  ) {
    return new Promise((resolve) => {
      this._capturingMode = mode;
      setTimeout(() => {
        this._capturing = true;
        const inte = setInterval(() => {
          if (!this._capturing) {
            resolve(true);
            clearInterval(inte);
            if (!this._capturedData) return;
            this.updateControlInputData(controlId, this._capturedData);
          }
        }, 100);
      }, 200);
    });
  }

  static updateControlInputData(
    controlId: string,
    data: RecursivePartial<ControlInputData>
  ) {
    const control = this.getControl(controlId);
    if (!control) {
      throw new Error(`Control with id: ${controlId} does not exists`);
    }
    for (const type in control.input) {
      //@ts-ignore
      if (!data[type]) continue;
      //@ts-ignore
      control.input[type] = { ...control.input[type], ...data[type] };
    }
    UserManager.updateControls();
  }

  static serializeInputData(): ControlData[] {
    return this.controls.store();
  }

  static injestInputData(data: ControlData[]) {
    this.controls.loadIn(data);
    UserManager.updateControls();
  }

  static update(delta = 0.16) {
    GamepadManager.updateGamepads();
    ControlsInternal.runHoldUpdate(delta);
  }
}
