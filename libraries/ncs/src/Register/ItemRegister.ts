export class ItemRegister<Item extends any> {
  namespaces = new Map<string, Map<string, Item>>([["main", new Map()]]);

  constructor(public itemtype: string) {}
  get(id: string, namespace: string): Item {
    const namespaceMap = this.namespaces.get(namespace);
    if (!namespaceMap)
      throw new Error(
        `[${this.itemtype}]: Namespace with id ${id} does not exist`
      );

    const item = namespaceMap.get(id);
    if (!item)
      throw new Error(`[${this.itemtype}]: Entry with id ${id} does not exist`);

    return item;
  }
  register(id: string, namespace: string, item: Item) {
    let itemMap = this.namespaces.get(namespace);
    if (!itemMap) {
      itemMap = new Map();
      this.namespaces.set(namespace, itemMap);
    }
    itemMap.set(id, item);
  }
}
