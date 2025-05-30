import { ControlEvent } from "../Events/ControlEventBase";
import { User } from "../Users/User";
import { ControlAction } from "./ControlAction";

export class Control {
  constructor(
    public user: User,
    public data: ControlAction
  ) {}

  run(event: ControlEvent<any>) {
    this.data.action(event);
  }
}
