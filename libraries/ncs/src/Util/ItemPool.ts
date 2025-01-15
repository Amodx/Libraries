export class ItemPool<Item> {
  items: Item[] = [];
  maxSize: number = Infinity;

  addItem(item: Item) {
    if (this.items.length > this.maxSize) return false;
    this.items.push(item);
    return true;
  }

  get() {
    const item = this.items.shift()!;
    if (!item) return null;
    return item;
  }
}
