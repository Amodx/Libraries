import { TraitInstance } from "./TraitInstance";
import { ItemGraphMap } from "../Maps/ItemGraphMap";

export class TraitInstanceMap {
  private static types = new Map<
    string,
    ItemGraphMap<TraitInstance<any, any, any, any>>
  >();
  static registerTrait(type: string) {
    const map = new ItemGraphMap<any>();
    this.types.set(type, map);
    return map;
  }
  static getMap(type: string) {
    const map = this.types.get(type);
    if (!map) throw new Error(`Map for trait ${type} does not exist`);
    return map;
  }
}
