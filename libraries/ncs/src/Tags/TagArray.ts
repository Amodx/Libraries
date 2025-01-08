import { Observable } from "../Util/Observable";
import { NCSRegister } from "../Register/NCSRegister";
class TagArrayObservers {
  tagAdded = new Observable<number>();
  componentRemoved = new Observable<number>();
  nodeAdded = new Observable<number>();
  nodeRemoved = new Observable<number>();
}
export class TagArray {
  _freeSlots: number[] = [];
  _node: number[] = [];
  observers = new TagArrayObservers();
  typeNumberId: number
  constructor(public typeId: string) {
    
    this.typeNumberId = NCSRegister.tags.idPalette.getNumberId(typeId);
  }
  addTag(node: number): number {
    let slot = this._freeSlots.length
      ? this._freeSlots.shift()!
      : this._node.length;
    this._node[slot] = node;
    this.observers.tagAdded.notify(slot);
    this.observers.nodeAdded.notify(node);
    return slot;
  }
  removeTag(index: number) {
    if (this._node[index] === undefined) return null;
    this.observers.tagAdded.notify(index);
    this.observers.nodeRemoved.notify(   this._node[index]);
    this._freeSlots.push(index);
    this._node[index] = -1;
    return true;
  }
}
