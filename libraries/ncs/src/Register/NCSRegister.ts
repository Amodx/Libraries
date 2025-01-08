import { SystemPrototype } from "../Systems/SystemPrototype";
import { ComponentRegisterData } from "../Components/Component.types";
import { Tag } from "../Tags/Tag";
import { ContextRegisterData } from "Contexts/Context.types";
class StringPalette {
  private _count = 0;
  _palette: string[] = [];
  _map: Record<string, number> = {};

  constructor(inital?: ArrayLike<string>) {
    if (inital) {
      const length = inital.length;
      for (let i = 0; i < length; i++) {
        this.register(inital[i]);
      }
    }
  }
  get size() {
    return this._count;
  }

  register(string: string) {
    const id = this._count;
    this._count++;
    this._palette[id] = string;
    this._map[string] = id;
    return id;
  }

  get() {
    return this._palette;
  }
  getMap() {
    return this._map;
  }

  isRegistered(id: string) {
    return this._map[id] !== undefined;
  }

  getNumberId(id: string) {
    return this._map[id];
  }
  getStringId(id: number) {
    return this._palette[id];
  }
}

class ItemRegister<Item extends any> {
  items: Item[];
  idPalette = new StringPalette();

  constructor(public itemtype: string) {}
  get(id: string | number): Item {
    const item =
      typeof id == "string"
        ? this.items[this.idPalette.getNumberId(id)]
        : this.items[id];
    if (!item)
      throw new Error(`[${this.itemtype}]: Entry with id ${id} does not exist`);

    return item;
  }
  has(id: string): boolean {
    return this.idPalette.isRegistered(id);
  }
  register(id: string, item: Item) {
    const itemId = this.idPalette.register(id);
    this.items[this.idPalette.register(id)] = item;
    return itemId;
  }
}

export class NCSRegister {
  static components = new ItemRegister<
    ComponentRegisterData<any, any, any, any>
  >("Components");
  static contexts = new ItemRegister<ContextRegisterData<any, any>>("Context");
  static tags = new ItemRegister<Tag>("Tags");
  static systems = new ItemRegister<SystemPrototype>("Systems");
}
