import { ControlEvents } from "../Events/ControlsEventManager";
import { ControlData } from "./ControlData";

export type ControlAction = {
  action: (event: ControlEvents) => void;
} & ControlData;

export type ControlGroupData = {
  id: string;
  name: string;
  controls: ControlAction[];
};
