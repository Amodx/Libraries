import {
  SerializedComponentData,
  ComponentRegisterData,
} from "./Component.types";
import { SchemaCursor } from "../Schema/Schema.types";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ComponentArray } from "./ComponentArray";
import { NCSPools } from "../Pools/NCSPools";
export class ComponentCursor<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {},
> {
  static Get() {
    const cursor = NCSPools.componentCursor.get();
    if (!cursor) return new ComponentCursor();
    return cursor;
  }
  static Retrun(cursor: ComponentCursor) {
    return NCSPools.componentCursor.addItem(cursor);
  }
  get index() {
    return this._index;
  }
  get type() {
    return NCSRegister.components.idPalette.getStringId(this._type);
  }
  get shared() {
    return this.__proto.shared;
  }
  schema: SchemaCursor<ComponentSchema>;
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

  public node: NodeCursor;
  public arrays: ComponentArray;
  public __proto: ComponentRegisterData<ComponentSchema, Data, Logic, Shared>;

  get typeId() {
    return this._type;
  }
  private _index = 0;
  private _type = 0;

  private constructor() {}
  setInstance(node: NodeCursor, type: number, index: number) {
    this._index = index;
    this._type = type;
    this.node = node;
    this.__proto = NCSRegister.components.items[this._type];

    this.arrays = node.graph._components[type];

    if (this.arrays.schemaArray._data[index] !== undefined) {
      this.schema = this.arrays.schemaArray.createViewCursor(index);
    }
    return this;
  }

  isDisposed() {
    return this.arrays._disposed[this._index];
  }
  dispose() {
    if (this.__proto.dispose) this.__proto.dispose(this);
    this.arrays.removeComponent(this._index);
  }

  returnCursor() {
    return ComponentCursor.Retrun(this);
  }

  update() {
    this.__proto.update && this.__proto.update(this);
  }

  toJSON(): SerializedComponentData {
    return {
      schema: this.schema && this.schema.toJSON(),
      type: this.type,
    };
  }
}
