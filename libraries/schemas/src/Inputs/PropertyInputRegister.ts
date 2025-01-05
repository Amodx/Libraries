import { ArrayMap } from "@amodx/core/DataStructures/ArrayMap";
import { AbstractPropertyInput } from "./PropertyInput";
export class PropertyInputRegister {
  static properties = new ArrayMap<string, AbstractPropertyInput<any, any>>();

  static regsiterProperty(data: AbstractPropertyInput) {
    this.properties.set(data.id, data);
  }

  static getProperty(id: string) {
    const property = this.properties.get(id);
    if (!property) throw new Error(`Property with id ${id} does not exist`);
    return property;
  }
}
