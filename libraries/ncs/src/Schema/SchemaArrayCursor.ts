import { Observable } from "../Util/Observable";
import { SchemaArray } from "./SchemaArray";

export class SchemaArrayCursor {
  constructor(public schemaArray: SchemaArray) {}

  get data() {
    return this.schemaArray._data[this._index];
  }
  set data(value: any) {
    this.schemaArray._data[this._index] = value;
  }

  _index = 0;


  setIndex(index: number) {
    this._index = index;
  }
  getObserver(propertyIndex: number): Observable | null {
    return this.schemaArray.getObserver(propertyIndex, this._index);
  }
  setObserver(propertyIndex: number, value: Observable | null) {
    return this.schemaArray.setObserver(propertyIndex, this._index, value);
  }
  hasProxy(propertyIndex: number) {
    return this.schemaArray.hasProxy(propertyIndex, this._index);
  }
  fetchProxyData(propertyIndex: number) {
    return this.schemaArray.fetchProxyData(propertyIndex, this._index);
  }
  setProxyData(propertyIndex: number, value: any) {
    return this.schemaArray.setProxyData(propertyIndex, this._index, value);
  }
  removeProxy(propertyIndex: number) {
    return this.schemaArray.removeProxy(propertyIndex, this._index);
  }
  setProxy<T extends Record<string | number, any> = {}>(
    propertyIndex: number,
    object: T,
    key: keyof T
  ) {
    return this.schemaArray.setProxy(propertyIndex, this._index, object, key);
  }
}
