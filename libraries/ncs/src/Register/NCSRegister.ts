import { SystemPrototype } from "../Systems/SystemPrototype";
import { ComponentRegisterData } from "../Components/Component.types";
import { Tag } from "../Tags/Tag";
import { ContextRegisterData } from "../Contexts/Context.types";
import { IdPalette } from "../Util/IdPalette";

class ItemRegister<Item extends any> {
  items: Item[] = [];
  idPalette = new IdPalette();

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
    this.items[itemId] = item;
    return itemId;
  }
}

export class NCSRegister {
  static components = new ItemRegister<
    ComponentRegisterData<any, any,  any>
  >("Components");
  static contexts = new ItemRegister<ContextRegisterData<any, any>>("Context");
  static tags = new ItemRegister<Tag>("Tags");
  static systems = new ItemRegister<SystemPrototype>("Systems");
}
