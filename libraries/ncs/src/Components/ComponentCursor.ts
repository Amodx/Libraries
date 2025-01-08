import {
  SerializedComponentData,
  ComponentStateData,
  ComponentRegisterData,
} from "./Component.types";
import { SchemaCursor } from "../Schema/Schema.types";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ComponentArray } from "./ComponentArray";
export class ComponentCursor<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
> {
  get index() {
    return this._index;
  }
  get type() {
    return NCSRegister.components.idPalette.getStringId(this._type);
  }
  get shared() {
    return this.proto.shared;
  }
  schema: SchemaCursor<ComponentSchema> | null;
  get data(): Data | null {
    return this.arrays._data[this._index];
  }
  set data(data: Data | null) {
    this.arrays._data[this._index] = data;
  }
  get logic(): Logic | null {
    return this.arrays._logic[this._index];
  }
  set logic(logic: Logic | null) {
    this.arrays._logic[this._index] = logic;
  }
  get state(): ComponentStateData {
    return this.arrays._state[this._index];
  }

  public node: NodeCursor;
  public arrays: ComponentArray;
  public proto: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>;

  private _index = 0;
  private _type = 0;
  setInstance(node: NodeCursor, type: number, index: number) {
    this._index = index;
    this._type = type;
    this.node = node;
    this.proto = NCSRegister.components.items[this._type];
    if (this.arrays.schemaArray._data[index] !== undefined) {
      this.schema = this.arrays.schemaArray.createViewCursor(index);
    }
    return this;
  }

  init() {
    this.proto.init && this.proto.init(this);
  }

  isDisposed() {
    return this.arrays._disposed[this._index];
  }
  dispose() {
    if (this.proto.dispose) this.proto.dispose(this);
    this.arrays._disposed[this._index] = true;
  }

  update() {
    this.proto.update && this.proto.update(this);
  }

  toJSON(): SerializedComponentData {
    return {
      schema: this.schema && this.schema.toJSON(),
      type: this.type,
      state: this.state,
    };
  }
}
