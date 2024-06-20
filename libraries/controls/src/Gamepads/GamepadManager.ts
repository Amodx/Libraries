import { Observable } from "@amodx/core/Observers/Observable.js";
import { GamepadController } from "./GamepadController.js";
import { UserManager } from "../Users/UserManager.js";

export class GamepadManager {
  static _gamepads = new Map<number, GamepadController>();

  static observers = {
    gamepadAdded: new Observable<GamepadController>(),
    gamepadRemoved: new Observable<GamepadController>(),
  };

  static addGamepad(event: GamepadEvent) {
    const user = UserManager.addUser(event.gamepad.index);
    const newGamePad = new GamepadController(user, event.gamepad);
    this._gamepads.set(event.gamepad.index, newGamePad);
    this.observers.gamepadAdded.notify(newGamePad);
    return newGamePad;
  }
  static removeGamepad(event: GamepadEvent) {
    if (!this._gamepads.has(event.gamepad.index)) return;
    this.observers.gamepadRemoved.notify(
      this._gamepads.get(event.gamepad.index)!
    );
    this._gamepads.delete(event.gamepad.index);
  }
  static updateGamepads() {
    for (const [index, gamepad] of this._gamepads) {
      gamepad.update();
    }
  }
}
