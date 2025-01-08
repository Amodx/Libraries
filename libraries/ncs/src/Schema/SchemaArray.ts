import { Observable } from "../Util/Observable";
import { BinaryObjectSchemaView } from "./Schema.types";
import { Schema } from "./Schema";

export class SchemaArray {
  _data: (any[] | BinaryObjectSchemaView)[] = [];
  _dataViews: string[] = [];
  _observers: Observable[][] = [];
  _proxyObjects: any[][] = [];
  _proxyKeys: any[][] = [];

  constructor(public schema: Schema) {
    for (let i = 0; i < schema._data.length; i++) {
      this._observers[i] = [];
      this._proxyObjects[i] = [];
      this._proxyKeys[i] = [];
    }
  }
  createViewCursor(index: number) {
    const data = this._data[index];
    if (data === undefined) return null;
    const viewId = this._dataViews[index];
    const view = this.schema.views.get(viewId);
    if (!view) return null;
    return view.createCursor();
  }

  setData(index: number, data: any, view?: string | null) {
    this._data[index] = data;
    this._dataViews[index] = view || "default";
  }
  removeData(index: number) {
    (this._data as any)[index] = undefined;
    (this._dataViews as any)[index] = undefined;
    for (let i = 0; i < this.schema._data.length; i++) {
      (this._observers as any)[i][index] = undefined;
      (this._proxyObjects as any)[i][index] = undefined;
      (this._proxyKeys as any)[i][index] = undefined;
    }
  }

  getObserver(propertyIndex: number, arrayIndex: number): Observable | null {
    if (!this._observers[propertyIndex][arrayIndex]) return null;
    let observer = !this._observers[propertyIndex][arrayIndex];
    if (!observer) return null;
    return observer;
  }

  setObserver(
    propertyIndex: number,
    arrayIndex: number,
    value: Observable | null
  ) {
    if (!value) {
      //@ts-ignore
      this._observers[propertyIndex][arrayIndex] = undefined;
      return;
    }
    this._observers[propertyIndex][arrayIndex] = value;
  }
  hasProxy(propertyIndex: number, arrayIndex: number) {
    return this._proxyObjects[propertyIndex][arrayIndex] !== undefined;
  }
  fetchProxyData(propertyIndex: number, arrayIndex: number) {
    return this._proxyObjects[propertyIndex][arrayIndex][
      this._proxyKeys[propertyIndex][arrayIndex]
    ];
  }
  setProxyData(propertyIndex: number, arrayIndex: number, value: any) {
    this._proxyObjects[propertyIndex][arrayIndex][
      this._proxyKeys[propertyIndex][arrayIndex]
    ] = value;
  }
  removeProxy(propertyIndex: number, arrayIndex: number) {
    this._proxyObjects[propertyIndex][arrayIndex] = undefined;
    (this._proxyKeys as any)[propertyIndex][arrayIndex] = undefined;
  }
  setProxy<T extends Record<string | number, any> = {}>(
    propertyIndex: number,
    arrayIndex: number,
    object: T,
    key: keyof T
  ) {
    this._proxyObjects[propertyIndex][arrayIndex] = object;
    this._proxyKeys[propertyIndex][arrayIndex] = key;
  }
}