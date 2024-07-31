export class ItemPool<Item> {
  items: Item[] = [];

  constructor(public maxSize: number = 100) {}

  addItem(item: Item) {
    if (this.items.length > this.maxSize) return false;
    this.items.push(item);
  }

  get() {
    const item = this.items.shift()!;
    if (!item) return null;
    return item;
  }
}
