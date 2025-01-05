import { Observable } from "@amodx/core/Observers/Observable";

export class ReaderManager {
  static objectSet = new Observable();

  static object: any;
  static setObject(object: any) {
    this.object = object;
    this.objectSet.notify();
  }
}
