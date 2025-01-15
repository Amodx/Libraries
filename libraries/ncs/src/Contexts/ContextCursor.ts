import { ContextRegisterData } from "./Context.types";
import { ContextArray } from "./ContextArray";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSPools } from "../Pools/NCSPools";
export class ContextCursor<
  ContextSchema extends {} = {},
  Data extends {} = {},
> {
  static Get() {
    const cursor = NCSPools.contextCursor.get();
    if (!cursor) return new ContextCursor();
    return cursor;
  }
  static Retrun(cursor: ContextCursor) {
    return NCSPools.contextCursor.addItem(cursor);
  }
  proto: ContextRegisterData<ContextSchema, Data>;
  _index = 0;
  _type = 0;
  get index() {
    return this._index;
  }
  get data() {
    return this.arrays._data[this._index];
  }
  get schema() {
    return null;
  }
  get nodes() {
    return this.arrays._node[this._index];
  }
  get type() {
    return NCSRegister.contexts.idPalette.getStringId(
      this.arrays._type[this._index]
    );
  }

  arrays: ContextArray;
  private constructor() {}

  setContext(node: NodeCursor, index: number) {
    this._index = index;
    this.arrays = node.graph._contexts;
    this._type = this.arrays._type[index];
  }

  dispose() {
    this.arrays.removeContext(this._index);
  }
}
