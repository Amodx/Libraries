import { PropertyData, PropertyMetaData } from "./Property.types";

export class Property implements PropertyData {
  id = "";
  name?: string;
  type = "";
  meta?: PropertyMetaData;
  value = null;
  children?: Property[];
  constructor(
    data: PropertyData,
    public readonly index: number
  ) {
    this.id = data.id;
    this.name = data.name;
    this.value = data.value;
    this.meta = data.meta;
  }
}
