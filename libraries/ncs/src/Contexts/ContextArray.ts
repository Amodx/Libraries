import { ContextStateData } from "./Context.types";
import { NCSRegister } from "../Register/NCSRegister";
import { SchemaArray } from "../Schema/SchemaArray";
export class ContextArray {
  _freeSlots: number[] = [];
  _type: number[] = [];
  _node: number[][] = [];
  _state: ContextStateData[] = [];
  _disposed: boolean[] = [];
  _data: any[] = [];
  schemaArray: SchemaArray[];

  numberTypeId: number;

  addContext(
    type: number,
    node: number[],
    state: ContextStateData,
    schema: any | null,
    data: any | null = null
  ): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._node.length;
    const contextSchema = NCSRegister.contexts.get(type)!.schema;
    if (contextSchema) {
      let schemaArray = this.schemaArray[type];
      if (!schemaArray) {
        schemaArray = contextSchema.array;
        this.schemaArray[type] = schemaArray;
      }
      schemaArray.setData(slot, schema);
    }
    this._type[slot] = type;
    this._node[slot] = node;
    this._state[slot] = state;
    this._disposed[slot] = false;
    data && (this._data[slot] = data);

    return slot;
  }
  removeContext(index: number) {
    if (this._node[index] === undefined) return null;
    this._freeSlots.push(index);
    const data = this._node[index];
    (this._node as any)[index] = [];
    (this._state as any)[index] = -1;
    this._disposed[index] = true;
    let schemaArray = this.schemaArray[this._type[index]];
    (this._type as any)[index] = -1;
    if (schemaArray) {
      schemaArray.removeData(index);
    }
    (this._data as any)[index] = undefined;

    return data;
  }
}
