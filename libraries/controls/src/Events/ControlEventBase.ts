import { Control } from "Controls/Control";
import { ControlInputTypes } from "../Controls/ControlData";
import { ControlEventTypes } from "./Event.types";

export interface ControlEventConstructor<
  Events extends Record<string, any> = {},
  Origin extends any = {},
> {
  eventType: string;
  new (controler: Control, origin: Origin): ControlEvent<Events, Origin>;
}

export abstract class ControlEvent<
  Events extends Record<string, any> = {},
  Origin extends any = {},
  EventType extends ControlEventTypes = any,
  InputType extends ControlInputTypes = any,
> extends EventTarget {
  abstract readonly eventType: EventType;
  abstract readonly inputType: InputType;
  constructor(
    public control: Control,
    public origin: Origin
  ) {
    super();
  }

  addEventListener<K extends keyof Events>(
    type: K,
    listener:
      | ((event: CustomEvent<Events[K]>) => void)
      | EventListenerObject
      | null,
    options?: AddEventListenerOptions
  ) {
    super.addEventListener(type as string, listener as EventListener, options);
  }

  removeEventListener<K extends keyof Events>(
    type: K,
    listener:
      | ((event: CustomEvent<Events[K]>) => void)
      | EventListenerObject
      | null
  ) {
    super.removeEventListener(type as string, listener as EventListener);
  }

  dispatch<K extends keyof Events>(type: K, detail: Events[K]) {
    super.dispatchEvent(new CustomEvent<Events[K]>(type as string, { detail }));
    return true;
  }
}
