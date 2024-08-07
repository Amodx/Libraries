import { ComponentInstance } from "./ComponentInstance";
import { ItemGraphMap } from "../Maps/ItemGraphMap";

export class ComponentInstanceMap {
  private static types = new Map<
    string,
    ItemGraphMap<ComponentInstance<any, any, any, any>>
  >();
  static registerComponent(type: string) {
    const map = new ItemGraphMap<any>();
    this.types.set(type, map);
    return map;
  }
  static getMap(type: string) {
    const map = this.types.get(type);
    if (!map) throw new Error(`Map for component ${type} does not exist`);
    return map;
  }
}
