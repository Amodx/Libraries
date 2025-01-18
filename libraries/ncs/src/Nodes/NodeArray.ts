import { IdPalette } from "../Util/IdPalette";
import { NCSPools } from "../Pools/NCSPools";
import { Observable } from "../Util/Observable";
import { NodeObserverIds } from "./Node.types";

const observerValues = Object.values(NodeObserverIds)
  .map((_) => Number(_))
  .filter((v) => !Number.isNaN(v));
const observersArrays: Observable<any>[][] = [];

for (let i = 0; i < observerValues.length; i++) {
  observersArrays[observerValues[i]] = [];
}

export class NodeArray {
  _freeSlots: number[] = [];
  _eventPalette = new IdPalette();

  /**A map of node ids to their index in the run time array */
  _idMap = new Map<bigint, number>();
  /**A map of node run time indexes to their unique id */
  _indexMap: bigint[] = [];

  _names: string[] = [];
  _events: Observable<any>[][] = [];
  _observers: Observable<any>[][] = structuredClone(observersArrays);
  _parents: number[] = [];
  _children: number[][] = [];
  _components: number[][] = [];
  _tags: number[][] = [];
  _context: number[][] = [];
  _disposed: boolean[] = [];
  _enabled: boolean[] = [];
  _hasObservers: boolean[] = [];
  addNode(id: bigint | null, parent: number, name: string): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._parents.length;

    id && this.addNodeId(slot, id);
    this._parents[slot] = parent;
    this._names[slot] = name;
    this._disposed[slot] = false;
    this._enabled[slot] = true;
    this._hasObservers[slot] = false;
    return slot;
  }
  removeNode(slot: number) {
    if (this._parents[slot] === undefined) return false;
    this._freeSlots.push(slot);
    this._indexMap[slot] && this.removeNodeId(this._indexMap[slot]);
    this._parents[slot] = -1;
    this._names[slot] = "";
    this._disposed[slot] = true;
    this._enabled[slot] = false;
    this._hasObservers[slot] = false;
    for (let i = 0; i < observerValues.length; i++) {
      const observer = this._observers[i]![slot];
      if (observer !== undefined) {
        NCSPools.observers.addItem(observer);
        (this._events[i] as any)![slot] = undefined;
      }
    }
    for (let i = 0; i < this._eventPalette.size; i++) {
      const observer = this._events[i]![slot];
      if (observer !== undefined) {
        NCSPools.observers.addItem(observer);
        (this._events[i] as any)![slot] = undefined;
      }
    }

    if (this._children[slot] !== undefined) {
      this._children[slot].length = 0;
      NCSPools.numberArray.addItem(this._children[slot]);
      (this._children as any)[slot] = undefined;
    }

    if (this._components[slot] !== undefined) {
      this._components[slot].length = 0;
      NCSPools.numberArray.addItem(this._components[slot]);
      (this._components as any)[slot] = undefined;
    }

    if (this._tags[slot] !== undefined) {
      this._tags[slot].length = 0;
      NCSPools.numberArray.addItem(this._tags[slot]);
      (this._tags as any)[slot] = undefined;
    }

    if (this._context[slot] !== undefined) {
      this._context[slot].length = 0;
      NCSPools.numberArray.addItem(this._context[slot]);
      (this._context as any)[slot] = undefined;
    }
    return true;
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
