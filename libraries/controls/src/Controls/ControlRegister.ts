import { ControlAction, ControlGroupData } from "./ControlAction";
import { ControlData } from "./ControlData";

export class ControlRegister {
  static _controlGroups = new Map<string, ControlGroupData>();
  static _controlData = new Map<string, ControlAction>();

  static registerData(groups: ControlGroupData[]) {
    for (const group of groups) {
      this._controlGroups.set(group.id, group);
      for (const control of group.controls) {
        this._controlData.set(control.id, control);
      }
    }
  }

  static store(): ControlData[] {
    const groups: ControlData[] = [];
    for (const [key, group] of this._controlGroups) {
      for (const control of group.controls) {
        const clone = structuredClone(control);
        delete (clone as any)["action"];
        groups.push(clone);
      }
    }
    return groups;
  }

  static loadIn(data: ControlData[]) {
    for (const control of data) {
      const con = this._controlData.get(control.id);
      if (!con) continue;
      this._controlData.set(control.id, { ...con, ...control });
    }
  }

  static getControlData(id: string) {
    const controlData = this._controlData.get(id);
    if (!controlData) throw new Error(`Control with id ${id} does not exist`);
    return controlData;
  }

  static getControlGroup(id: string) {
    const controlGroup = this._controlGroups.get(id);
    if (!controlGroup) throw new Error(`Control with id ${id} does not exist`);
    return controlGroup;
  }
}
