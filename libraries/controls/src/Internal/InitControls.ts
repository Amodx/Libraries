import { GamepadManager } from "../Gamepads/GamepadManager";
import { UserManager } from "../Users/UserManager";
import { Controls } from "../Controls";

import { ControlsMap } from "./ControlsMap";
import { ControlEventManager } from "../Events/ControlsEventManager";
import { ControlEventTypes } from "../Events/Event.types";
import { ControlsInternal } from "./ControlsInternal";

export default function (controls: typeof Controls) {
  const rootElement = controls.controlRootElement as HTMLElement;
  const user = UserManager.addUser(0);
  controls.mainUser = user;

  const heldKeybaordKey = new Set();
  const gamePadConnectionListener = (e: GamepadEvent) => {
    const newGamepad = GamepadManager.addGamepad(e);
    newGamepad.observables.buttonPressed.subscribe(
      Controls,
      ({ number, key }) => {
        if (controls._capturing && controls._capturingMode == "gamepad") {
          controls._capturedData = {
            "gamepad-button": {
              button: key as any,
            },
          };
          controls._capturing = false;
          return;
        }
      }
    );
  };

  const gamePaddisconnectListener = (e: GamepadEvent) =>
    GamepadManager.removeGamepad(e);

  const mouseDownListener = (event: MouseEvent) => {
    const button = ControlsMap.mapMoueButton(event.button);
    if (controls._capturing && controls._capturingMode == "keyboard") {
      controls._capturedData = {
        mouse: {
          mode: "down",
          button: button,
        },
      };
      controls._capturing = false;
      return;
    }

    down: {
      const key = ControlsMap.getMouseId(button, "down");
      const control = user.getControlByType(key);
      control &&
        control.run(
          new (ControlEventManager.getEvent(ControlEventTypes.MouseDown)!)(
            control,
            event
          )
        );
      break down;
    }
    hold: {
      const key = ControlsMap.getMouseId(button, "hold");
      const control = user.getControlByType(key);
      if (!control || ControlsInternal.hasHold(button)) break hold;

      control.run(
        new (ControlEventManager.getEvent(ControlEventTypes.MouseHold)!)(
          control,
          event
        )
      );

      const input = control.data.input;
      ControlsInternal.addHold(
        button,
        () =>
          control.run(
            new (ControlEventManager.getEvent(ControlEventTypes.MouseHold)!)(
              control,
              event
            )
          ),
        input.mouse?.holdDelay ? input.mouse?.holdDelay : 10,
        input.mouse?.initHoldDelay ? input.mouse?.initHoldDelay : 250
      );
    }
  };

  const mouseUp = (event: MouseEvent) => {
    const button = ControlsMap.mapMoueButton(event.button);
    ControlsInternal.removeHold(button);
    ControlsInternal.releaseMouseButton(`${event.button}`);

    const key = ControlsMap.getMouseId(button, "up");
    const control = user.getControlByType(key);
    control &&
      control.run(
        new (ControlEventManager.getEvent(ControlEventTypes.MouseUp)!)(
          control,
          event
        )
      );
  };

  const keyDownListener = (event: KeyboardEvent) => {
    const keyBoardKey = ControlsMap.mapKey(event.key);

    if (controls._capturing && controls._capturingMode == "keyboard") {
      controls._capturedData = {
        keyboard: {
          key: keyBoardKey,
          mode: "down",
        },
      };
      controls._capturing = false;
      return;
    }

    down: {
      const key = ControlsMap.getKeyBaordId(keyBoardKey, "down");
      const control = user.getControlByType(key);
      if (!control || heldKeybaordKey.has(event.key)) break down;
      control.run(
        new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardDown)!)(
          control,
          event
        )
      );
      heldKeybaordKey.add(event.key);

      return;
    }

    hold: {
      const key = ControlsMap.getKeyBaordId(keyBoardKey, "hold");
      const control = user.getControlByType(key);
      if (!control || ControlsInternal.hasHold(keyBoardKey)) break hold;
      control.run(
        new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardHold)!)(
          control,
          event
        )
      );
      const input = control.data.input;
      ControlsInternal.addHold(
        keyBoardKey,
        () =>
          control.run(
            new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardHold)!)(
              control,
              event
            )
          ),
        input.keyboard?.holdDelay ? input.keyboard?.holdDelay : 10,
        input.keyboard?.initHoldDelay ? input.keyboard?.initHoldDelay : 250
      );
    }
  };

  const keyUpListener = (event: KeyboardEvent) => {
    const keyBoardKey = ControlsMap.mapKey(event.key);

    ControlsInternal.removeHold(keyBoardKey);
    ControlsInternal.releaseKey(event.key);
    heldKeybaordKey.delete(event.key);
    const key = ControlsMap.getKeyBaordId(keyBoardKey, "up");
    const control = user.getControlByType(key);
    control &&
      control.run(
        new (ControlEventManager.getEvent(ControlEventTypes.KeyBoardUp)!)(
          control,
          event
        )
      );
  };

  const wheelListener = (event: WheelEvent) => {
    if (event.deltaY < 0) {
      if (controls._capturing && controls._capturingMode == "keyboard") {
        controls._capturedData = {
          scroll: {
            mode: "up",
          },
        };
        controls._capturing = false;
        return;
      }
      const key = ControlsMap.getScrollId("up");
      const control = user.getControlByType(key);
      control &&
        control.run(
          new (ControlEventManager.getEvent(ControlEventTypes.WheelUp)!)(
            control,
            event
          )
        );
    } else {
      if (controls._capturing && controls._capturingMode == "keyboard") {
        controls._capturedData = {
          scroll: {
            mode: "down",
          },
        };
        controls._capturing = false;
        return;
      }
      const key = ControlsMap.getScrollId("down");
      const control = user.getControlByType(key);

      control &&
        control.run(
          new (ControlEventManager.getEvent(ControlEventTypes.WheelDown)!)(
            control,
            event
          )
        );
    }
  };

  const addListeners = () => {
    window.addEventListener("gamepadconnected", gamePadConnectionListener);
    window.addEventListener("gamepaddisconnected", gamePaddisconnectListener);
    rootElement.addEventListener("mousedown", mouseDownListener);
    rootElement.addEventListener("mouseup", mouseUp);
    rootElement.addEventListener("wheel", wheelListener);
    rootElement.addEventListener("keydown", keyDownListener);
    rootElement.addEventListener("keyup", keyUpListener);
  };
  const removeListeners = () => {
    window.removeEventListener("gamepadconnected", gamePadConnectionListener);
    window.removeEventListener(
      "gamepaddisconnected",
      gamePaddisconnectListener
    );
    rootElement.removeEventListener("mousedown", mouseDownListener);
    rootElement.removeEventListener("mouseup", mouseUp);
    rootElement.removeEventListener("wheel", wheelListener);
    rootElement.removeEventListener("keydown", keyDownListener);
    rootElement.removeEventListener("keyup", keyUpListener);
  };

  addListeners();

  return {
    addListeners,
    removeListeners,
  };
}
