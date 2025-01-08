import { Observable } from "../Util/Observable";
import { NodeObserverIds, NodeStateData } from "./Node.types";

const observerValues = Object.values(NodeObserverIds).map((_) => Number(_));
export class NodeArray {
  _freeSlots: number[] = [];

  /**A map of node ids to their index in the run time array */
  _idMap = new Map<bigint, number>();
  /**A map of node run time indexes to their unique id */
  _indexMap: bigint[] = [];

  _names: string[] = [];
  _state: NodeStateData[] = [];
  _events = new Map<string, (Observable<any>)[]>();
  _observers = new Map<NodeObserverIds, (Observable<any>)[]>(
    observerValues.map((_) => [_, []])
  );
  _parents: number[] = [];
  _children: number[][] = [];
  _components: number[][] = [];
  _tags: number[][] = [];
  _context: number[][] = [];

  addNode(
    id: bigint | null,
    parent: number,
    name: string,
    state: NodeStateData,
    children: number[] | null = null,
    components: number[] | null = null,
    tags: number[] | null = null,
    context: number[] | null = null
  ): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._parents.length;

    id && this.addNodeId(slot, id);
    this._parents[slot] = parent;
    this._names[slot] = name;
    this._state[slot] = state;

    children && (this._children[slot] = children);
    components && (this._components[slot] = components);
    tags && (this._tags[slot] = tags);
    context && (this._context[slot] = context);
    return slot;
  }
  removeNode(index: number) {
    if (this._parents[index] === undefined) return null;
    this._freeSlots.push(index);
    this._indexMap[index] && this.removeNodeId(this._indexMap[index]);
    this._parents[index] = -1;
    this._names[index] = "";

    for (let i = 0; i < observerValues.length; i++) {
      const array = this._observers.get(observerValues[i])![index] as any;
      array[index] = undefined;
    }
    for (const [key] of this._events) {
      const array = this._events.get(key)![index] as any;
      array[index] = undefined;
    }
    (this._state as any)[index] = undefined;
    (this._children as any)[index] = undefined;
    (this._components as any)[index] = undefined;
    (this._tags as any)[index] = undefined;
    (this._context as any)[index] = undefined;
  }
  addNodeId(index: number, id: bigint) {
    this._idMap.set(id, index);
    this._indexMap[index] = id;
  }
  removeNodeId(id: bigint) {
    const index = this._idMap.get(id)!;
    (this._indexMap as any)[index] = undefined;
    this._idMap.delete(id);
  }
}
