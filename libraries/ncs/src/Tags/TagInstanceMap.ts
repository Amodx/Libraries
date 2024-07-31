import { ItemGraphMap } from "../Maps/ItemGraphMap";
import { TagInstance } from "./TagInstance";

export class TagInstanceMap {
  private static types = new Map<string, ItemGraphMap<TagInstance>>();
  static registerTag(type: string) {
    const map = new ItemGraphMap<TagInstance>();
    this.types.set(type, map);
    return map;
  }
  static getMap(type: string) {
    const map = this.types.get(type);
    if (!map) throw new Error(`Map for component ${type} does not exist`);
    return map;
  }
}
