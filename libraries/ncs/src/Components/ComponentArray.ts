import { Observable } from "../Util/Observable";
import { NCSRegister } from "../Register/NCSRegister";
import { SchemaArray } from "../Schema/SchemaArray";
import { ComponentRegisterData } from "./Component.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ComponentCursor } from "./ComponentCursor";
import { Graph } from "../Graphs/Graph";
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
  _disposed: boolean[] = [];
  _data: any[] = [];


  schemaArray: SchemaArray;

  proto: ComponentRegisterData;
  observers = new ComponentArrayObservers();

  private _nodeCursor: NodeCursor;
  private _componentCursor: ComponentCursor;
  constructor(
    public graph: Graph,
    public numberTypeId: number
  ) {
    const proto = NCSRegister.components.get(
      NCSRegister.components.idPalette.getStringId(numberTypeId)
    )!;
    if (proto.schema) this.schemaArray = proto.schema.array;
    this.proto = proto;
    this._nodeCursor = NodeCursor.Get();
    this._componentCursor = ComponentCursor.Get();
  }
  addComponent(
    node: number,
    schema: any | null,
    schemaView: string | null
  ): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._node.length;
    this._node[slot] = node;
    this._disposed[slot] = false;
    if (this.schemaArray) this.schemaArray.setData(slot, schema, schemaView);
    componentObserverData[0] = this.numberTypeId;
    componentObserverData[1] = slot;
    this.observers.componentAdded.notify(componentObserverData);

    return slot;
  }

  removeComponent(index: number) {
    if (this._node[index] === undefined) return null;
    componentObserverData[0] = this.numberTypeId;
    componentObserverData[1] = index;
    this.observers.componentRemoved.notify(componentObserverData);
    this.observers.nodeRemoved.notify(this._node[index]);
    this._freeSlots.push(index);
    const nodeIndex = this._node[index];
    this._disposed[index] = true;
    (this._data as any)[index] = undefined;

    this._node[index] = -1;
    if (this.schemaArray) this.schemaArray.removeData(index);
    return nodeIndex;
  }

  update() {
    const update = this.proto.update;
    if (!update) return;
    for (let i = 0; i < this._disposed.length; i++) {
      if (this._disposed[i]) continue;
      this._componentCursor.setInstance(
        this._nodeCursor.setNode(this.graph, this._node[i]),
        this.numberTypeId,
        i
      );
      update(this._componentCursor);
    }
  }

  init(index: number) {
    const init = this.proto.init;
    if (!init) return false;

    this._componentCursor.setInstance(
      this._nodeCursor.setNode(this.graph, this._node[index]),
      this.numberTypeId,
      index
    );
    init(this._componentCursor);
    return false;
  }
}
