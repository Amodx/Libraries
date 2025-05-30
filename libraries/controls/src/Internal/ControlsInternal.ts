import { KeyDownEvent, MouseDownEvent } from "../Events/Register";

export class ControlsInternal {
  static _keysForRelease = new Map<string, KeyDownEvent[]>();
  static _mouseButtonsForRelease = new Map<string, MouseDownEvent[]>();

  static addKeyForRelease(key: string, event: KeyDownEvent) {
    let events = this._keysForRelease.get(key)!;
    if (!events) {
      events = [];
      this._keysForRelease.set(key, events)!;
    }
    events.push(event);
  }

  static releaseKey(key: string) {
    const events = this._keysForRelease.get(key);
    if (!events) return false;
    for (const event of events) {
      event.dispatch("release", {});
    }
    events.length = 0;
  }

  static addMouseButtonForRelease(key: string, event: MouseDownEvent) {
    let events = this._mouseButtonsForRelease.get(key)!;
    if (!events) {
      events = [];
      this._mouseButtonsForRelease.set(key, events)!;
    }
    events.push(event);
  }

  static releaseMouseButton(key: string) {
    const events = this._mouseButtonsForRelease.get(key);
    if (!events) return false;
    for (const event of events) {
      event.dispatch("release", {});
    }
    events.length = 0;
  }


  private static _functions = new Map<
  string,
  {
    time: number;
    delay: number;
    activeDelay: number;
    run: Function;
    activeTime: number;
  }
>();

static addHold(id: string, run: Function, delay: number, activeDelay = 0) {
  if (this._functions.has(id)) return;
  this._functions.set(id, {
    time: performance.now(),
    delay,
    run,
    activeDelay,
    activeTime: performance.now(),
  });
}
static removeHold(id: string) {
  this._functions.delete(id);
}

static hasHold(id: string) {
  return this._functions.has(id);
}

static runHoldUpdate(frameDelta: number) {
  const time = performance.now();
  for (const [key, node] of this._functions) {
    if (node.delay) {
      const activeDelta = time - node.activeTime + frameDelta;
      if (activeDelta < node.delay) {
        continue;
      }
    }
    if (node.activeDelay) {
      const delta = time - node.time + frameDelta;
      if (delta < node.activeDelay) {
        continue;
      }
    }
    node.run();
    node.activeTime = time;
  }
}
}
