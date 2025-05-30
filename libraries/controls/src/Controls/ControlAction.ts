import { ControlEvent } from "../Events/ControlEventBase";
import { ControlData } from "./ControlData";

export type ControlAction<
Control extends ControlEvent<any, any, any> = any,
> = {
  action: (
    event: Control
  ) => void;
} & ControlData;

export type ControlGroupData = {
  id: string;
  name: string;
  controls: ControlAction[];
};
