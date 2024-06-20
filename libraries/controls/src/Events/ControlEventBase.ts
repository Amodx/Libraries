import { Control } from "Controls/Control";
import { ControlInputTypes } from "../Controls/ControlData";
import { ControlEventTypes } from "./Event.types";

export interface ControlEventConstructor<T extends ControlInputTypes = any> {
  eventType: string;
  new (controler: Control): ControlEvent<T>;
}

export abstract class ControlEvent<T extends ControlInputTypes = any> {
  abstract readonly eventType: ControlEventTypes;
  abstract readonly inputType: T;
  constructor(public controler: Control) {}
}
