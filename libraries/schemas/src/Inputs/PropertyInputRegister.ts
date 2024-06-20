import { ArrayMap } from "@amodx/core/DataStructures/ArrayMap";
import { PropertyInputConstructor } from "./PropertyInput";
export class PropertyInputRegister {
  static properties = new ArrayMap<string,PropertyInputConstructor>();

  static regsiterProperty(...data: PropertyInputConstructor[]) {
    this.properties.add(data.map((_) => [_.Meta.id, _]));
  }

  static getProperty(id: string) {
    const property = this.properties.get(id);
    if (!property) throw new Error(`Property with id ${id} does not exist`);
    return property;
  }
}
