import { ContextRegisterData } from "./Context.types";
import { ContextArray } from "./ContextArray";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "../Nodes/NodeCursor";
export class ContextCursor<
  ContextSchema extends {} = {},
  Data extends {} = {},
> {
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

  setContext(node: NodeCursor, index: number) {
    this._index = index;
    this.arrays = node.graph.contexts;
    this._type = this.arrays._type[index];
  }
}
