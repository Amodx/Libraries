import { Observable } from "../Util/Observable";
import { ComponentStateData } from "./Component.types";
import { NCSRegister } from "../Register/NCSRegister";
import { SchemaArray } from "../Schema/SchemaArray";
type ComponentObserverData = [type: number, index: number];
const componentObserverData: ComponentObserverData = [0, 0];
class ComponentArrayObservers {
  componentAdded = new Observable<ComponentObserverData>();
  componentRemoved = new Observable<ComponentObserverData>();
  nodeAdded = new Observable<number>();
  nodeRemoved = new Observable<number>();
}

export class ComponentArray {
  _freeSlots: number[] = [];
  _node: number[] = [];
  _state: ComponentStateData[] = [];
  _disposed: boolean[] = [];
  _data: any[] = [];
  _logic: any[] = [];

  schemaArray: SchemaArray;

  observers = new ComponentArrayObservers();

  numberTypeId: number;
  constructor(public typeId: string) {
    const schema = NCSRegister.components.get(typeId)!.schema;
    if (schema) this.schemaArray = schema.array;
    this.numberTypeId = NCSRegister.components.idPalette.getNumberId(typeId);
  }
  addComponent(
    node: number,
    state: ComponentStateData,
    schema: any | null,
    schemaView: string | null,
    data: any | null = null,
    logic: any | null = null
  ): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._node.length;
    this._node[slot] = node;
    this._state[slot] = state;
    this._disposed[slot] = false;
    data && (this._data[slot] = data);
    logic && (this._logic[slot] = logic);
    this.schemaArray.setData(slot, schema, schemaView);
    componentObserverData[0] = this.numberTypeId;
    componentObserverData[1] = slot;
    this.observers.componentAdded.notify(componentObserverData);
    this.observers.nodeAdded.notify(node);
    return slot;
  }
  removeComponent(index: number) {
    if (this._node[index] === undefined) return null;
    componentObserverData[0] = this.numberTypeId;
    componentObserverData[1] = index;
    this.observers.componentRemoved.notify(componentObserverData);
    this.observers.nodeRemoved.notify(this._node[index]);
    this._freeSlots.push(index);
    const data = this._node[index];
    (this._state as any)[index] = -1;
    this._disposed[index] = true;
    (this._data as any)[index] = undefined;
    (this._logic as any)[index] = undefined;
    this._node[index] = -1;
    return data;
  }
}
