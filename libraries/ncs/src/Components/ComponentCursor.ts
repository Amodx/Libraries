import { ComponentRegisterData } from "./Component.types";
import { SchemaCursor } from "../Schema/Schema.types";
import { NCSRegister } from "../Register/NCSRegister";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ComponentArray } from "./ComponentArray";
import { NCSPools } from "../Pools/NCSPools";
export class ComponentCursor<
  ComponentSchema extends object = {},
  Data extends any = any,
  Shared extends any = any,
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
  get shared(): Shared {
    return this.__proto.shared!;
  }
  schema: SchemaCursor<ComponentSchema>;
  get data(): Data {
    return this.arrays._data[this._index];
  }
  set data(data: Data) {
    this.arrays._data[this._index] = data;
  }

  public node: NodeCursor;
  public arrays: ComponentArray;
  public __proto: ComponentRegisterData<ComponentSchema, Data, Shared>;

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

    if (this.arrays?.schemaArray?._data[index] !== undefined) {
      this.schema = this.arrays.schemaArray.createViewCursor(index);
      this.schema.setInstance(index);
    }
    return this;
  }

  get isDisposed() {
    return this.arrays._disposed[this._index];
  }
  dispose() {

    if (this.__proto.dispose) this.__proto.dispose(this);
    this.arrays.removeComponent(this._index);
  }

  returnCursor() {
    return ComponentCursor.Retrun(this);
  }
  cloneCursor(
    cursor?: ComponentCursor,
    nodeCursor?: NodeCursor
  ): ComponentCursor<ComponentSchema, Data, Shared> {
    const newCursor = cursor || ComponentCursor.Get();
    const newNodeCursor = nodeCursor || NodeCursor.Get();
    newNodeCursor.setNode(this.node.graph, this.node.index);

    newCursor.setInstance(newNodeCursor, this.typeId, this._index);
    return newCursor as any;
  }

  update() {
    this.__proto.update && this.__proto.update(this);
  }
}
